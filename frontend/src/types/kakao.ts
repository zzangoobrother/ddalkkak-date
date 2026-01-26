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

export interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (options: KakaoShareOptions) => void;
    createDefaultButton: (options: KakaoShareButton) => void;
  };
}

declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}

export {};
