import type { Metadata } from "next";
import { Inter } from "next/font/google";
import KakaoScript from "@/components/KakaoScript";
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
        <KakaoScript />
      </body>
    </html>
  );
}
