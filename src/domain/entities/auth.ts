export interface UserOut {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  smtp_configured: boolean;
  created_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export interface AuthResponse {
  user: UserOut;
  tokens: TokenPair;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  role?: string;
}

export interface UserSmtpOut {
  smtp_email: string | null;
  has_password: boolean;
}

export interface SmtpCredentialsUpdate {
  smtp_email: string;
  smtp_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}
