export const convertToNumber = (value: string | null, defaultValue: number) => {
  return value ? Number(value) : defaultValue;
};
