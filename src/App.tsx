import React, { useEffect, useState } from 'react';
import { PlusCircle, MinusCircle, Receipt, Calendar, Building2, Wifi, ShoppingCart, Coffee, Car } from 'lucide-react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (fn: () => void) => void;
        };
        close: () => void;
      };
    };
  }
}

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category?: string;
  amount: number;
  date: string;
  description: string;
};

function App() {
  const [view, setView] = useState<'main' | 'income' | 'expense' | 'fixed' | 'variable'>('main');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Инициализация Telegram Web App
    window.Telegram?.WebApp.ready();
  }, []);

  const fixedExpenses = [
    { icon: <Building2 className="w-6 h-6" />, name: 'Аренда' },
    { icon: <Wifi className="w-6 h-6" />, name: 'Интернет' },
  ];

  const variableExpenses = [
    { icon: <ShoppingCart className="w-6 h-6" />, name: 'Продукты' },
    { icon: <Coffee className="w-6 h-6" />, name: 'Кафе' },
    { icon: <Car className="w-6 h-6" />, name: 'Транспорт' },
  ];

  const handleAddTransaction = (type: 'income' | 'expense', category?: string) => {
    if (!amount) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      category,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      description
    };

    setTransactions([...transactions, newTransaction]);
    setAmount('');
    setDescription('');
    setView('main');
  };

  const renderMainView = () => (
    <div className="space-y-4">
      <button
        onClick={() => setView('income')}
        className="w-full p-4 bg-green-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
      >
        <PlusCircle className="w-6 h-6" />
        <span>Доход</span>
      </button>
      <button
        onClick={() => setView('expense')}
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
                      {transaction.category || (transaction.type === 'income' ? 'Доход' : 'Расход')}
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

  const renderExpenseTypeView = () => (
    <div className="space-y-4">
      <button
        onClick={() => setView('fixed')}
        className="w-full p-4 bg-blue-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors"
      >
        <Calendar className="w-6 h-6" />
        <span>Постоянные расходы</span>
      </button>
      <button
        onClick={() => setView('variable')}
        className="w-full p-4 bg-purple-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-600 transition-colors"
      >
        <Receipt className="w-6 h-6" />
        <span>Переменные расходы</span>
      </button>
      <button
        onClick={() => setView('main')}
        className="w-full p-4 bg-gray-500 text-white rounded-lg"
      >
        Назад
      </button>
    </div>
  );

  const renderTransactionForm = (type: 'income' | 'expense', categories?: { icon: JSX.Element; name: string }[]) => (
    <div className="space-y-4">
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
      
      {categories && (
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 ${
                selectedCategory === category.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category.icon}
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      )}

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
        onClick={() => handleAddTransaction(type, selectedCategory)}
        className={`w-full p-4 text-white rounded-lg ${
          type === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        Добавить {type === 'income' ? 'доход' : 'расход'}
      </button>
      
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Учет финансов</h1>
        
        {view === 'main' && renderMainView()}
        {view === 'expense' && renderExpenseTypeView()}
        {view === 'income' && renderTransactionForm('income')}
        {view === 'fixed' && renderTransactionForm('expense', fixedExpenses)}
        {view === 'variable' && renderTransactionForm('expense', variableExpenses)}
      </div>
    </div>
  );
}

export default App;