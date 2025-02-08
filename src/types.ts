export interface Employee {
  id: string;
  name: string;
  hourlyRate: number;
}

export interface WorkEntry {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  transportationFee: number;
  date: string;
}

export interface CalculationResult {
  workingMinutes: number;
  roundedMinutes: number;
  baseSalary: number;
  totalSalary: number;
}