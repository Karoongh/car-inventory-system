export interface RequestOtpDto {
  mobile: string;
}

export interface VerifyOtpDto {
  mobile: string;
  code: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: string;
}

export interface AuthUser {
  id: string;
  mobile: string;
  fullName: string | null;
  role: 'Owner' | 'Admin';
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}
