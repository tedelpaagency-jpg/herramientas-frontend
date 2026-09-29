import { apiClient } from './apiClient';

export interface SendResetCodeResponse {
  status: string;
  message: string;
  email?: string;
}

export interface VerifyResetCodeResponse {
  status: string;
  message: string;
  reset_token: string;
}

export interface ResetPasswordResponse {
  status: string;
  message: string;
}

export const passwordResetService = {
  /**
   * Step 1 & 2: Send 6-digit verification code to the given email
   */
  async sendResetCode(email: string): Promise<SendResetCodeResponse> {
    const response = await apiClient.post<SendResetCodeResponse>('/v1/auth/forgot-password/send-code', {
      email,
    });
    return response.data;
  },

  /**
   * Step 3: Validate the 6-digit verification code
   */
  async verifyResetCode(email: string, code: string): Promise<VerifyResetCodeResponse> {
    const response = await apiClient.post<VerifyResetCodeResponse>('/v1/auth/forgot-password/verify-code', {
      email,
      code,
    });
    return response.data;
  },

  /**
   * Step 4: Update password with confirmation
   */
  async resetPassword(payload: {
    email: string;
    reset_token: string;
    password: string;
    password_confirmation: string;
  }): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>('/v1/auth/forgot-password/reset-password', payload);
    return response.data;
  },
};

export default passwordResetService;
