export const copyToClipboard = (value: string) => {
  navigator.clipboard.writeText(value);
};
