import Link from "next/link";

/**
 * 모든 페이지 상단에 공통으로 표시되는 헤더 컴포넌트입니다.
 * 왼쪽에는 홈(`/`)으로 이동하는 서비스 이름을,
 * 오른쪽에는 유형 도감(`/types`)으로 이동하는 메뉴를 배치합니다.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-violet-100/80 bg-white/80 px-5 py-3.5 backdrop-blur-md">
      {/* 왼쪽: 서비스 이름 (클릭하면 첫 화면 `/`으로 이동) */}
      <Link
        href="/"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-1 text-lg font-bold tracking-tight text-slate-800 transition-opacity hover:opacity-80"
      >
        {/* 서비스 로고를 상징하는 작은 파스텔 배지 (장식용이라 스크린 리더에서는 숨김) */}
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 via-violet-200 to-sky-200 text-sm shadow-sm"
        >
          🐾
        </span>
        <span>희희 MBTI</span>
      </Link>

      {/* 오른쪽: 주요 메뉴 (현재는 '유형 도감' 링크 1개만 제공) */}
      <nav aria-label="주요">
        <Link
          href="/types"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 shadow-xs transition-colors hover:bg-violet-100 active:scale-[0.98]"
        >
          유형 도감
        </Link>
      </nav>
    </header>
  );
}
