import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Employee } from '../types';

interface Props {
  employees: Employee[];
  onDelete: (id: string) => void;
  onEdit: (employee: Employee) => void;
}

export function EmployeeList({ employees, onDelete, onEdit }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">登録済み従業員一覧</h2>
      <div className="grid gap-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium text-gray-900">{employee.name}</h3>
              <p className="text-sm text-gray-500">時給: {employee.hourlyRate.toLocaleString()}円</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(employee)}
                className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(employee.id)}
                className="p-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}