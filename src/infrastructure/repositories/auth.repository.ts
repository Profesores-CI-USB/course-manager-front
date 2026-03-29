import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  SmtpCredentialsUpdate,
  UserOut,
  UserSmtpOut,
} from "@/domain/entities/auth";
import type {
  IAuthRepository,
  IUserRepository,
} from "@/domain/ports/auth.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class AuthRepository implements IAuthRepository {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/v1/auth/login", data);
  }

  async register(data: RegisterRequest, token: string): Promise<UserOut> {
    return apiClient.post<UserOut>("/api/v1/auth/users", data, token);
  }

  async logout(refreshToken: string, token: string): Promise<void> {
    await apiClient.post("/api/v1/auth/logout", { refresh_token: refreshToken }, token);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return apiClient.post("/api/v1/auth/refresh", {
      refresh_token: refreshToken,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/api/v1/auth/forgot-password", { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post("/api/v1/auth/reset-password", {
      token,
      new_password: newPassword,
    });
  }

  async changePassword(
    data: ChangePasswordRequest,
    token: string,
  ): Promise<void> {
    await apiClient.post("/api/v1/auth/change-password", data, token);
  }
}

export class UserRepository implements IUserRepository {
  async getMe(token: string): Promise<UserOut> {
    return apiClient.get<UserOut>("/api/v1/users/me", token);
  }

  async getSmtp(token: string): Promise<UserSmtpOut> {
    return apiClient.get<UserSmtpOut>("/api/v1/users/me/smtp", token);
  }

  async updateSmtp(
    data: SmtpCredentialsUpdate,
    token: string,
  ): Promise<UserSmtpOut> {
    return apiClient.put<UserSmtpOut>("/api/v1/users/me/smtp", data, token);
  }
}
