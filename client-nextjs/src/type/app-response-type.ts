export type AppResponse<T> = {
  statusCode: number;
  status: string;
  message?: string;
  errors?: {
    message: string;
    details?: ErrorValidation[];
  };
  data?: T;
  meta?: Meta;
};

export type AppErrorResponse = {
  statusCode: number;
  status: string;
  message?: string;
  errors?: {
    message: string;
    details?: ErrorValidation[];
  };
};

export type ErrorValidation = {
  message: string;
  path?: string;
};

export type Meta = {
  pagination?: PaginationMeta;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};
