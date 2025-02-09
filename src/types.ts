export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  parent_id: string | null;
  is_fixed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  created_at: string;
  updated_at: string;
}

export interface Contractor {
  id: string;
  name: string;
  type: string;
  contact_person: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category_id: string;
  employee_id?: string;
  contractor_id?: string;
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  employee?: Employee;
  contractor?: Contractor;
}