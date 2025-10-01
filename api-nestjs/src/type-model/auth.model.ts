export class RegisterRequest {
  username: string;
  password: string;
  confirm_password: string;
}

export class RegisterResponse {
  id: bigint;
  username: string;
}

export class LoginRequest {
  username: string;
  password: string;
}

export class LoginResponse {
  token: string;
}
