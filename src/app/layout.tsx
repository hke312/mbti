import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

// next/font/google을 이용해 Noto Sans KR 글꼴을 최적화하여 불러옵니다.
// 한국어 글꼴 데이터는 latin 서브셋 설정과 함께 유니코드 범위별로 자동 제공됩니다.
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

// 브라우저 탭 제목과 서비스 설명(메타데이터)을 한국어로 설정합니다.
export const metadata: Metadata = {
  title: "희희 MBTI",
  description: "25개 질문으로 알아보는 나의 성격 유형과 3D 동물 캐릭터",
};

/**
 * 모든 페이지에 공통으로 적용되는 루트 레이아웃입니다.
 * PC 화면에서도 모바일(최대 너비 480px)처럼 가운데에 깔끔하게 보이도록 구성합니다.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      {/* 바깥 배경은 밝은 파스텔 그라데이션으로 채웁니다. */}
      <body className="min-h-full bg-gradient-to-b from-[#FFF3F8] via-[#F4EEFF] to-[#EAF6FF] font-sans text-slate-800">
        {/* 가운데 정렬 + 최대 너비 480px 모바일 화면 틀 */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-white/70 shadow-[0_18px_50px_rgba(130,112,190,0.12)] sm:my-6 sm:min-h-[calc(100dvh-3rem)] sm:overflow-hidden sm:rounded-[32px] sm:border sm:border-white">
          {/* 공통 상단 헤더 */}
          <Header />

          {/* 각 페이지의 실제 본문이 들어가는 영역 */}
          <main className="flex flex-1 flex-col px-5 py-7">{children}</main>
        </div>
      </body>
    </html>
  );
}
