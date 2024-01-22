export const deleteDuplicatedElements = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const checkLength = (value: string, min: number, max: number, errorMessage: string, errors: string[]) => {
  if (value.length < min || value.length > max) {
    errors.push(errorMessage);
  }
};

export const checkPattern = (value: string, pattern: RegExp, errorMessage: string, errors: string[]) => {
  if (!pattern.test(value)) {
    errors.push(errorMessage);
  }
};
