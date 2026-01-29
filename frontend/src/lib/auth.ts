import { AuthTokens, User } from '@/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * 카카오 액세스 토큰으로 백엔드 JWT 토큰 발급
 */
export async function exchangeKakaoTokenForJWT(kakaoAccessToken: string): Promise<{
  user: User;
  tokens: AuthTokens;
}> {
  const response = await fetch(`${API_BASE_URL}/auth/kakao/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken: kakaoAccessToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Kakao token for JWT');
  }

  const data = await response.json();
  return data;
}

/**
 * Refresh Token으로 새로운 Access Token 발급
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  return data;
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser(accessToken: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get current user');
  }

  const data = await response.json();
  return data;
}

/**
 * 로그아웃
 */
export async function logout(accessToken: string): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
}

/**
 * 토큰 만료 여부 확인
 */
export function isTokenExpired(expiresIn: number): boolean {
  // expiresIn은 밀리초 단위의 만료 시간 (timestamp)
  return Date.now() >= expiresIn;
}

/**
 * 토큰 만료 시간 계산 (현재 시간 + 유효 기간)
 */
export function calculateTokenExpiry(expiresInSeconds: number): number {
  return Date.now() + (expiresInSeconds * 1000);
}
