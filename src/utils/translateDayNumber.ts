export const translateDayNumber = (dayNumber: number): string => {
  const daysMap = new Map([
    [0, 'Domingo'],
    [1, 'Lunes'],
    [2, 'Martes'],
    [3, 'Miércoles'],
    [4, 'Jueves'],
    [5, 'Viernes'],
    [6, 'Sábado'],
  ]);
  const result = daysMap.get(dayNumber);
  if (!result) {
    throw new Error('Invalid day number');
  } else {
    return result;
  }
};
