import Link from "next/link";

// 첫 화면에 보여 줄 서비스 특징 카드 3개의 데이터를 배열로 정리했습니다.
const FEATURE_CARDS = [
  {
    icon: "📝",
    badgeBg: "bg-pink-100",
    cardBg: "bg-gradient-to-r from-pink-50/90 to-rose-50/70",
    title: "25문항 · 3분",
    description: "부담 없이 빠르게 답할 수 있는 가벼운 질문들로 구성되어 있어요.",
  },
  {
    icon: "✨",
    badgeBg: "bg-violet-100",
    cardBg: "bg-gradient-to-r from-violet-50/90 to-indigo-50/70",
    title: "16가지 유형",
    description: "나의 평소 생각과 행동 습관을 16가지 성격 유형으로 정리해 드려요.",
  },
  {
    icon: "🦊",
    badgeBg: "bg-sky-100",
    cardBg: "bg-gradient-to-r from-sky-50/90 to-teal-50/70",
    title: "유형별 3D 캐릭터",
    description: "각 성격 유형과 꼭 닮은 귀여운 3D 동물 친구를 만나볼 수 있어요.",
  },
] as const;

/**
 * 서비스의 첫 화면(`/`) 컴포넌트입니다.
 * 모바일(가로 375px) 기준에서 한눈에 들어오도록 세로 배치로 구성했습니다.
 */
export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-between gap-8">
      {/* 상단: 메인 소개 영역 + 검사 시작 버튼 */}
      <section className="flex flex-col gap-7 pt-2">
        <div className="flex flex-col items-center gap-3 text-center">
          {/* 장식용 상단 파스텔 배지 */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-violet-700 shadow-xs">
            <span aria-hidden="true">🌷</span>
            <span>귀여운 3D 동물과 함께하는 성격 검사</span>
          </span>

          {/* 페이지의 유일한 큰 제목(h1) */}
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            나는 어떤 유형일까?
          </h1>

          {/* 한 줄 소개 문구 */}
          <p className="max-w-[320px] text-base leading-relaxed text-slate-600">
            간단한 질문에 답하고 나만의 성격 유형과 3D 동물 캐릭터를 확인해 보세요.
          </p>
        </div>

        {/* 검사 페이지(`/test`)로 이동하는 큼직한 메인 버튼 */}
        <Link
          href="/test"
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#6C4DF6] px-6 py-4 text-lg font-bold text-white shadow-[0_12px_28px_rgba(108,77,246,0.28)] transition-all hover:bg-[#5B3CE6] active:scale-[0.98]"
        >
          <span>검사 시작하기</span>
          <span aria-hidden="true">→</span>
        </Link>

        {/* 특징 카드 3개 영역 */}
        <div className="flex flex-col gap-3.5">
          {FEATURE_CARDS.map((card) => (
            <article
              key={card.title}
              className={`flex items-start gap-4 rounded-3xl border border-white/90 ${card.cardBg} p-4 shadow-[0_8px_24px_rgba(140,125,185,0.09)]`}
            >
              {/* 장식용 아이콘 박스 */}
              <div
                aria-hidden="true"
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.badgeBg} text-2xl shadow-xs`}
              >
                {card.icon}
              </div>

              {/* 카드 제목(h2)과 설명 */}
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-bold text-slate-800">{card.title}</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 맨 아래 작은 안내 문구 */}
      <p className="pt-2 text-center text-xs leading-relaxed text-slate-500">
        이 검사는 재미로 보는 간이 검사이며, 공식 MBTI® 검사가 아닙니다.
      </p>
    </div>
  );
}
