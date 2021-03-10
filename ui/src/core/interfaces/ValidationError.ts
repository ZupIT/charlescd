export type DetailedErrorResponse = {
  errors: DetailedError[];
}

export type DetailedError = {
  id: string;
  title: string;  
  detail: string;
  meta: ErrorMeta;
}

export type ErrorMeta = {
  component: string;
  field: string;
  timestamp: string;
}

export type ValidationError = {
  message: string;
  errors: FieldError[];
};

export type FieldError = {
  field: string;
  error: string;
};
