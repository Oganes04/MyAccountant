import React, { useEffect, useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Category, Transaction } from '../types';

function MainApp() {
  const [view, setView] = useState<'main' | 'income' | 'expense' | 'category'>('main');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currentType, setCurrentType] = useState<'income' | 'expense'>('income');

  useEffect(() => {
    loadCategories();
    loadTransactions();
    // Инициализация Telegram Web App
    window.Telegram?.WebApp.ready();
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

  const loadTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        category:categories(*),
        employee:employees(*),
        contractor:contractors(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading transactions:', error);
      return;
    }
    
    setTransactions(data);
  };

  const handleAddTransaction = async () => {
    if (!amount || !selectedCategory) return;

    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          type: currentType,
          amount: parseFloat(amount),
          category_id: selectedCategory,
          description
        }
      ]);

    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }

    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setView('main');
    loadTransactions();
  };

  const renderMainView = () => (
    <div className="space-y-4">
      <button
        onClick={() => {
          setCurrentType('income');
          setView('category');
        }}
        className="w-full p-4 bg-green-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
      >
        <PlusCircle className="w-6 h-6" />
        <span>Доход</span>
      </button>
      <button
        onClick={() => {
          setCurrentType('expense');
          setView('category');
        }}
        className="w-full p-4 bg-red-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors"
      >
        <MinusCircle className="w-6 h-6" />
        <span>Расход</span>
      </button>
      
      {transactions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">История операций</h2>
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-4 rounded-lg ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {transaction.category?.name}
                    </p>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                  </div>
                  <p className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount} ₽
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCategoryView = () => {
    const filteredCategories = categories.filter(cat => cat.type === currentType);
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {filteredCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Сумма</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Введите сумму"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Описание</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Введите описание"
              />
            </div>

            <button
              onClick={handleAddTransaction}
              className={`w-full p-4 text-white rounded-lg ${
                currentType === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Добавить {currentType === 'income' ? 'доход' : 'расход'}
            </button>
          </>
        )}
        
        <button
          onClick={() => {
            setView('main');
            setSelectedCategory('');
          }}
          className="w-full p-4 bg-gray-500 text-white rounded-lg"
        >
          Назад
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Учет финансов</h1>
      
      {view === 'main' && renderMainView()}
      {view === 'category' && renderCategoryView()}
    </div>
  );
}

export default MainApp;