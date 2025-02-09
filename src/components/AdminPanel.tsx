import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Category, Employee, Contractor } from '../types';

function AdminPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <nav className="flex space-x-4">
            <Link
              to="/admin/categories"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Категории
            </Link>
            <Link
              to="/admin/employees"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Сотрудники
            </Link>
            <Link
              to="/admin/contractors"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Контрагенты
            </Link>
          </nav>
        </div>
      </div>

      <Routes>
        <Route path="/categories" element={<CategoriesManager />} />
        <Route path="/employees" element={<EmployeesManager />} />
        <Route path="/contractors" element={<ContractorsManager />} />
      </Routes>
    </div>
  );
}

function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense' as const,
    is_fixed: false,
    parent_id: null as string | null
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error loading categories:', error);
      return;
    }
    
    setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('categories')
      .insert([newCategory]);

    if (error) {
      console.error('Error adding category:', error);
      return;
    }

    setNewCategory({
      name: '',
      type: 'expense',
      is_fixed: false,
      parent_id: null
    });
    loadCategories();
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Управление категориями
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Название
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Тип
            </label>
            <select
              value={newCategory.type}
              onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as 'income' | 'expense' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="expense">Расход</option>
              <option value="income">Доход</option>
            </select>
          </div>

          {newCategory.type === 'expense' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newCategory.is_fixed}
                onChange={(e) => setNewCategory({ ...newCategory, is_fixed: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Постоянный расход
              </label>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Родительская категория (опционально)
            </label>
            <select
              value={newCategory.parent_id || ''}
              onChange={(e) => setNewCategory({ ...newCategory, parent_id: e.target.value || null })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Нет родительской категории</option>
              {categories
                .filter(cat => cat.type === newCategory.type)
                .map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              }
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Добавить категорию
          </button>
        </form>

        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Существующие категории</h4>
          <div className="space-y-2">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-gray-500">
                    {category.type === 'income' ? 'Доход' : 'Расход'}
                    {category.type === 'expense' && ` (${category.is_fixed ? 'Постоянный' : 'Переменный'})`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeesManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    department: '',
    position: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error loading employees:', error);
      return;
    }
    
    setEmployees(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('employees')
      .insert([newEmployee]);

    if (error) {
      console.error('Error adding employee:', error);
      return;
    }

    setNewEmployee({
      name: '',
      department: '',
      position: ''
    });
    loadEmployees();
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Управление сотрудниками
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ФИО
            </label>
            <input
              type="text"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Отдел
            </label>
            <input
              type="text"
              value={newEmployee.department}
              onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Должность
            </label>
            <input
              type="text"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Добавить сотрудника
          </button>
        </form>

        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Список сотрудников</h4>
          <div className="space-y-2">
            {employees.map(employee => (
              <div
                key={employee.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-gray-500">
                    {employee.department} - {employee.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContractorsManager() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [newContractor, setNewContractor] = useState({
    name: '',
    type: 'client',
    contact_person: '',
    contact_email: ''
  });

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error loading contractors:', error);
      return;
    }
    
    setContractors(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('contractors')
      .insert([newContractor]);

    if (error) {
      console.error('Error adding contractor:', error);
      return;
    }

    setNewContractor({
      name: '',
      type: 'client',
      contact_person: '',
      contact_email: ''
    });
    loadContractors();
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Управление контрагентами
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Название
            </label>
            <input
              type="text"
              value={newContractor.name}
              onChange={(e) => setNewContractor({ ...newContractor, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Тип
            </label>
            <select
              value={newContractor.type}
              onChange={(e) => setNewContractor({ ...newContractor, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="client">Клиент</option>
              <option value="supplier">Поставщик</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Контактное лицо
            </label>
            <input
              type="text"
              value={newContractor.contact_person}
              onChange={(e) => setNewContractor({ ...newContractor, contact_person: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={newContractor.contact_email}
              onChange={(e) => setNewContractor({ ...newContractor, contact_email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Добавить контрагента
          </button>
        </form>

        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Список контрагентов</h4>
          <div className="space-y-2">
            {contractors.map(contractor => (
              <div
                key={contractor.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{contractor.name}</p>
                  <p className="text-sm text-gray-500">
                    {contractor.type === 'client' ? 'Клиент' : 'Поставщик'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {contractor.contact_person} - {contractor.contact_email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;