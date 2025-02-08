import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Employee } from '../types';

interface Props {
  onSubmit: (employee: Omit<Employee, 'id'>) => void;
  existingNames: string[];
}

export function EmployeeForm({ onSubmit, existingNames }: Props) {
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('名前を入力してください');
      return;
    }
    
    if (existingNames.includes(name.trim())) {
      setError('この名前は既に登録されています');
      return;
    }
    
    const rate = Number(hourlyRate);
    if (isNaN(rate) || rate <= 0) {
      setError('有効な時給を入力してください');
      return;
    }

    onSubmit({ name: name.trim(), hourlyRate: rate });
    setName('');
    setHourlyRate('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          名前
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="山田 太郎"
        />
      </div>
      
      <div>
        <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
          時給 (円)
        </label>
        <input
          type="number"
          id="hourlyRate"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="1200"
          min="1"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        登録する
      </button>
    </form>
  );
}