import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "똑딱 데이트",
  description: "AI 기반 데이트 코스 추천 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        {/* 카카오 SDK 로드 */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
          crossOrigin="anonymous"
          strategy="afterInteractive"
          onLoad={() => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
              const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
              if (appKey) {
                window.Kakao.init(appKey);
              }
            }
          }}
        />
      </body>
    </html>
  );
}
