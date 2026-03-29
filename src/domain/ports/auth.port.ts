import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  SmtpCredentialsUpdate,
  UserOut,
  UserSmtpOut,
} from "@/domain/entities/auth";

export interface IAuthRepository {
  login(data: LoginRequest): Promise<AuthResponse>;
  register(data: RegisterRequest, token: string): Promise<UserOut>;
  logout(refreshToken: string, token: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  changePassword(data: ChangePasswordRequest, token: string): Promise<void>;
}

export interface IUserRepository {
  getMe(token: string): Promise<UserOut>;
  getSmtp(token: string): Promise<UserSmtpOut>;
  updateSmtp(data: SmtpCredentialsUpdate, token: string): Promise<UserSmtpOut>;
}
