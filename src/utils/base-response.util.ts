export interface BaseResponse<T> {
  status: number;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export function createResponse<T>(
  status: number,
  message: string,
  data?: T,
  pagination?: BaseResponse<T>['pagination'],
): BaseResponse<T> {
  return {
    status,
    message,
    ...(data !== undefined ? { data } : {}),
    ...(pagination ? { pagination } : {}),
  };
}
