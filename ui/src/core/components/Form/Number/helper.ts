export const isNumber = (value: string) => /[0-9]/.test(value);

export const isIntoMax = (value: string, max: number) => parseInt(value) > max;