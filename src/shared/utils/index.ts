export const deleteDuplicatedElements = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const prueba = (a: number, b: number) => {
  return a + b;
};
