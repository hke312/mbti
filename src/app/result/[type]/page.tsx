import { Suspense } from "react";

/**
 * URL 파라미터(`params`)에서 MBTI 유형 코드를 읽어 크게 보여 주는 내부 컴포넌트입니다.
 * Next.js Cache Components 환경에서는 `params` 접근을 `<Suspense>`로 감싸야 빌드 오류 없이 동작합니다.
 */
async function ResultContent({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const mbtiType = type.toUpperCase();

  return (
    <section className="flex w-full flex-col items-center gap-4 rounded-3xl border border-white/90 bg-white/95 px-6 py-12 shadow-[0_12px_32px_rgba(140,125,185,0.12)]">
      <span className="inline-flex rounded-full bg-violet-100 px-3.5 py-1 text-xs font-semibold text-violet-700">
        나의 성격 유형
      </span>

      {/* 계산된 MBTI 유형 코드 크게 표시 */}
      <h1 className="text-5xl font-extrabold tracking-widest text-[#6C4DF6]">
        {mbtiType}
      </h1>

      <p className="text-sm leading-relaxed text-slate-500">
        유형별 상세 설명과 3D 캐릭터는 다음 단계에서 만들어질 예정이에요.
      </p>
    </section>
  );
}

/**
 * 검사 결과 임시 페이지(`/result/[type]`)입니다.
 * 다음 단계에서 상세 설명과 3D 캐릭터를 추가하기 전까지
 * 계산된 4글자 MBTI 유형 코드를 크게 보여 주는 역할을 합니다.
 */
export default function ResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Suspense
        fallback={
          <div className="w-full rounded-3xl border border-white/90 bg-white/90 px-6 py-12 text-sm font-medium text-slate-500 shadow-[0_12px_32px_rgba(140,125,185,0.12)]">
            결과를 불러오는 중이에요...
          </div>
        }
      >
        <ResultContent params={params} />
      </Suspense>
    </div>
  );
}
