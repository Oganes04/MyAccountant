/*
  # Initial schema setup

  1. New Tables
    - `categories`
      - Hierarchical structure for expense/income categories
      - Supports multiple levels of nesting
    - `employees`
      - Employee information
      - Department and role tracking
    - `contractors`
      - Contractor/client information
    - `transactions`
      - Financial transactions
      - Links to categories, employees, and contractors
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Categories table for both income and expense categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  parent_id uuid REFERENCES categories(id),
  is_fixed boolean DEFAULT false, -- For fixed vs variable expenses
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  position text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contractors table
CREATE TABLE IF NOT EXISTS contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL, -- e.g., 'client', 'supplier'
  contact_person text,
  contact_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount decimal NOT NULL,
  category_id uuid REFERENCES categories(id),
  employee_id uuid REFERENCES employees(id),
  contractor_id uuid REFERENCES contractors(id),
  description text,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all operations for authenticated users" ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON employees
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON contractors
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON transactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert some initial data
INSERT INTO categories (name, type, is_fixed) VALUES
  ('Зарплата', 'expense', true),
  ('Аренда', 'expense', true),
  ('Интернет', 'expense', true),
  ('Продукты', 'expense', false),
  ('Кафе', 'expense', false),
  ('Транспорт', 'expense', false),
  ('Продажи', 'income', false),
  ('Услуги', 'income', false)
ON CONFLICT DO NOTHING;