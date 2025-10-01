export class AppResponse<T> {
  statusCode: number;
  status: string;
  message?: string;
  errors?: {
    message: string;
    details?: ErrorValidation[];
  };
  data?: T;
  meta?: Meta;
}

export class ErrorValidation {
  message: string;
  path?: string;
}

export class Meta {
  pagination?: PaginationMeta;
}

export class PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
