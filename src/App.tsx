import React, { useState, useEffect } from 'react';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeeList } from './components/EmployeeList';
import { WorkEntryForm } from './components/WorkEntryForm';
import type { Employee, WorkEntry, CalculationResult } from './types';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState<'settings' | 'work'>('settings');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  const saveEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: crypto.randomUUID(),
    };
    saveEmployees([...employees, newEmployee]);
  };

  const handleDeleteEmployee = (id: string) => {
    saveEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleEditEmployee = (updatedEmployee: Employee) => {
    saveEmployees(employees.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ));
  };

  const handleCalculate = (entry: WorkEntry, result: CalculationResult) => {
    setCalculationResult(result);
    // Save work entry to localStorage if needed
    const workEntries = JSON.parse(localStorage.getItem('workEntries') || '[]');
    localStorage.setItem('workEntries', JSON.stringify([...workEntries, entry]));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">給与計算システム</h1>
        
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('settings')}
                className={`${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                時給設定
              </button>
              <button
                onClick={() => setActiveTab('work')}
                className={`${
                  activeTab === 'work'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                勤務入力
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'settings' ? (
          <div className="space-y-6">
            <EmployeeForm
              onSubmit={handleAddEmployee}
              existingNames={employees.map(emp => emp.name)}
            />
            <EmployeeList
              employees={employees}
              onDelete={handleDeleteEmployee}
              onEdit={handleEditEmployee}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <WorkEntryForm
              employees={employees}
              onCalculate={handleCalculate}
            />
            
            {calculationResult && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">計算結果</h2>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">総勤務時間</dt>
                    <dd className="mt-1 text-lg text-gray-900">
                      {Math.floor(calculationResult.workingMinutes / 60)}時間
                      {calculationResult.workingMinutes % 60}分
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">15分単位の勤務時間</dt>
                    <dd className="mt-1 text-lg text-gray-900">
                      {Math.floor(calculationResult.roundedMinutes / 60)}時間
                      {calculationResult.roundedMinutes % 60}分
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">基本給</dt>
                    <dd className="mt-1 text-lg text-gray-900">
                      {calculationResult.baseSalary.toLocaleString()}円
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">総支給額</dt>
                    <dd className="mt-1 text-lg font-semibold text-blue-600">
                      {calculationResult.totalSalary.toLocaleString()}円
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;