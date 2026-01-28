/**
 * 카카오 JavaScript SDK 타입 정의
 * @see https://developers.kakao.com/docs/latest/ko/kakaotalk-sharing/js
 */

export interface KakaoShareButton {
  container: string;
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

export interface KakaoShareOptions {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

export interface KakaoAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

export interface KakaoUserProfile {
  id: number;
  connected_at: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account?: {
    profile_needs_agreement?: boolean;
    profile?: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image?: boolean;
    };
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    email?: string;
  };
}

export interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (options: KakaoShareOptions) => void;
    createDefaultButton: (options: KakaoShareButton) => void;
  };
  Auth: {
    login: (settings: {
      success: (response: KakaoAuthResponse) => void;
      fail: (error: Error) => void;
      scope?: string;
    }) => void;
    logout: (callback?: () => void) => void;
    getAccessToken: () => string | null;
    setAccessToken: (token: string) => void;
  };
  API: {
    request: (settings: {
      url: string;
      success: (response: KakaoUserProfile) => void;
      fail: (error: Error) => void;
    }) => void;
  };
}

declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}

export {};
