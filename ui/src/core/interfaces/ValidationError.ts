export type ValidationError = {
  message: string;
  errors: FieldError[];
};

export type FieldError = {
  field: string;
  error: string;
};
