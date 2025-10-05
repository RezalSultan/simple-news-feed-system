export type RegisterRequest = {
  username: string;
  password: string;
  confirm_password: string;
};

export type RegisterResponse = {
  id: bigint;
  username: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  refresh_token: string;
};
