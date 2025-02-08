export const calculateWorkingMinutes = (startTime: string, endTime: string): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let minutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  
  // Handle overnight shifts
  if (minutes < 0) {
    minutes += 24 * 60;
  }
  
  return minutes;
};

export const roundToFifteenMinutes = (minutes: number): number => {
  return Math.floor(minutes / 15) * 15;
};

export const calculateSalary = (
  hourlyRate: number,
  minutes: number,
  transportationFee: number
): number => {
  const hourlyRatePer15Min = hourlyRate / 4;
  const numberOfFifteenMinBlocks = Math.floor(minutes / 15);
  return hourlyRatePer15Min * numberOfFifteenMinBlocks + transportationFee;
};