export interface BaseResponseSchema {
  message: string;
}

export interface UserDetailsFromToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
