/**
 * 인증 관련 타입 정의
 */

export interface User {
  userId: string;
  kakaoId: number;
  nickname: string;
  profileImage?: string;
  email?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  kakaoAccessToken: string;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
  agreedToMarketing?: boolean;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface TermsAgreement {
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}
