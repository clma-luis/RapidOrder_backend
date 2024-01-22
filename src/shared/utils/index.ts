export const deleteDuplicatedElements = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};
