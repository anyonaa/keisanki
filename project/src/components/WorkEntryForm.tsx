import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import type { Employee, WorkEntry, CalculationResult } from '../types';
import { calculateWorkingMinutes, roundToFifteenMinutes, calculateSalary } from '../utils/calculations';

interface Props {
  employees: Employee[];
  onCalculate: (entry: WorkEntry, result: CalculationResult) => void;
}

export function WorkEntryForm({ employees, onCalculate }: Props) {
  const [employeeId, setEmployeeId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [transportationFee, setTransportationFee] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId || !startTime || !endTime) {
      setError('すべての必須項目を入力してください');
      return;
    }

    const workingMinutes = calculateWorkingMinutes(startTime, endTime);
    if (workingMinutes < 0) {
      setError('退勤時間は出勤時間より後である必要があります');
      return;
    }

    const roundedMinutes = roundToFifteenMinutes(workingMinutes);
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) {
      setError('従業員が見つかりません');
      return;
    }

    const fee = Number(transportationFee) || 0;
    const baseSalary = calculateSalary(employee.hourlyRate, roundedMinutes, 0);
    const totalSalary = baseSalary + fee;

    const entry: WorkEntry = {
      id: crypto.randomUUID(),
      employeeId,
      startTime,
      endTime,
      transportationFee: fee,
      date: new Date().toISOString().split('T')[0],
    };

    const result: CalculationResult = {
      workingMinutes,
      roundedMinutes,
      baseSalary,
      totalSalary,
    };

    onCalculate(entry, result);
    resetForm();
  };

  const resetForm = () => {
    setEmployeeId('');
    setStartTime('');
    setEndTime('');
    setTransportationFee('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="employee" className="block text-sm font-medium text-gray-700">
          従業員
        </label>
        <select
          id="employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            出勤時間
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            退勤時間
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="transportationFee" className="block text-sm font-medium text-gray-700">
          交通費 (円)
        </label>
        <input
          type="number"
          id="transportationFee"
          value={transportationFee}
          onChange={(e) => setTransportationFee(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="0"
          min="0"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Calculator className="w-5 h-5 mr-2" />
          計算する
        </button>
        
        <button
          type="button"
          onClick={resetForm}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          リセット
        </button>
      </div>
    </form>
  );
}