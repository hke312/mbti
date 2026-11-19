import Link from "next/link";
import { Suspense } from "react";
import ShareResultButton from "@/components/ShareResultButton";
import { MBTI_TYPES, type MbtiTypeCode } from "@/data/types";

/**
 * URL에서 받은 문자열이 16가지 MBTI 유형 코드 중 하나인지 확인합니다.
 */
function findTypeInfo(rawType: string) {
  const upperCode = rawType.toUpperCase();
  if (Object.hasOwn(MBTI_TYPES, upperCode)) {
    return MBTI_TYPES[upperCode as MbtiTypeCode];
  }
  return null;
}

/**
 * URL 파라미터(`params`)를 읽어 해당 MBTI 유형 결과를 그려 주는 내부 컴포넌트입니다.
 */
async function ResultContent({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const typeInfo = findTypeInfo(type);

  // 16가지 유형에 없는 코드로 접속한 경우 안내 화면과 홈 이동 버튼을 보여 줍니다.
  if (!typeInfo) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <section className="flex w-full flex-col items-center gap-5 rounded-3xl border border-white/90 bg-white/95 px-6 py-12 shadow-[0_12px_32px_rgba(140,125,185,0.12)]">
          <span
            aria-hidden="true"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-2xl"
          >
            🔎
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            없는 유형이에요
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            입력하신 주소의 성격 유형을 찾을 수 없어요. 첫 화면으로 돌아가 다시 시작해 주세요.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#6C4DF6] px-6 py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(108,77,246,0.25)] transition-all hover:bg-[#5B3CE6] active:scale-[0.98]"
          >
            홈으로 가기
          </Link>
        </section>
      </div>
    );
  }

  return (
    // 본문 영역 전체에 해당 유형의 대표 색상이 은은하게 깔리도록 배경 그라데이션을 적용합니다.
    <div
      className="-mx-5 -my-7 flex flex-1 flex-col gap-6 px-5 py-7"
      style={{
        background: `linear-gradient(180deg, ${typeInfo.color}66 0%, ${typeInfo.color}24 45%, rgba(255, 255, 255, 0.72) 100%)`,
      }}
    >
      {/* 1) 상단 요약: "당신의 유형은", 큰 유형 코드, 별명 */}
      <section className="flex flex-col items-center gap-2 pt-1 text-center">
        <span
          className="inline-flex rounded-full border border-white/80 px-4 py-1.5 text-xs font-bold text-slate-700 shadow-xs"
          style={{ backgroundColor: `${typeInfo.color}88` }}
        >
          당신의 유형은
        </span>

        <h1 className="mt-1 text-5xl font-extrabold tracking-widest text-slate-900">
          {typeInfo.code}
        </h1>

        <p className="text-xl font-bold text-slate-800">{typeInfo.nickname}</p>
      </section>

      {/* 2) 캐릭터 자리: 다음 단계에서 3D 캐릭터가 들어갈 대표 색상 배경의 둥근 상자 */}
      <div className="flex justify-center">
        <div
          className="flex h-44 w-full max-w-[280px] items-center justify-center rounded-3xl border-4 border-white/90 px-6 text-center shadow-[0_12px_30px_rgba(120,105,170,0.14)]"
          style={{ backgroundColor: typeInfo.color }}
        >
          <span className="rounded-full bg-white/85 px-5 py-2.5 text-lg font-extrabold text-slate-800 shadow-xs">
            {typeInfo.character.name}
          </span>
        </div>
      </div>

      {/* 3) 한 줄 소개와 성격 설명 */}
      <section
        className="flex flex-col gap-3 rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_10px_26px_rgba(140,125,185,0.09)]"
        style={{ borderColor: `${typeInfo.color}CC` }}
      >
        <h2 className="text-base font-bold text-slate-900">{typeInfo.summary}</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          {typeInfo.description}
        </p>
      </section>

      {/* 4) 강점 목록 & 조심할 점 목록 */}
      <section className="flex flex-col gap-4">
        {/* 강점 카드 */}
        <article
          className="flex flex-col gap-3 rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_10px_26px_rgba(140,125,185,0.09)]"
          style={{ borderColor: `${typeInfo.color}AA` }}
        >
          <h2 className="text-base font-bold text-slate-900">이런 강점이 있어요</h2>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-slate-700">
            {typeInfo.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: typeInfo.color }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* 조심할 점 카드 */}
        <article
          className="flex flex-col gap-3 rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_10px_26px_rgba(140,125,185,0.09)]"
          style={{ borderColor: `${typeInfo.color}AA` }}
        >
          <h2 className="text-base font-bold text-slate-900">조금만 조심해요</h2>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-slate-700">
            {typeInfo.cautions.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* 5) 잘 맞는 유형 2개: 클릭 시 해당 유형의 결과 페이지로 이동 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-slate-900">잘 맞는 유형</h2>
        <div className="grid grid-cols-2 gap-3">
          {typeInfo.bestMatches.map((matchCode) => {
            const matchInfo = MBTI_TYPES[matchCode];
            return (
              <Link
                key={matchCode}
                href={`/result/${matchCode}`}
                className="flex min-h-[96px] flex-col justify-between gap-1.5 rounded-3xl border border-white/90 bg-white/90 p-4 shadow-[0_8px_22px_rgba(140,125,185,0.09)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ backgroundColor: `${matchInfo.color}40` }}
              >
                <span className="text-lg font-extrabold tracking-wide text-slate-900">
                  {matchInfo.code}
                </span>
                <span className="text-xs font-medium leading-snug text-slate-700">
                  {matchInfo.nickname}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6) 하단 버튼 2개: 다시 검사하기 + 결과 공유하기 */}
      <div className="flex flex-col gap-3 pt-2">
        <ShareResultButton />
        <Link
          href="/test"
          className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-violet-100 bg-white/95 px-6 py-4 text-base font-bold text-slate-800 shadow-[0_8px_20px_rgba(140,125,185,0.08)] transition-colors hover:bg-violet-50 active:scale-[0.98]"
        >
          다시 검사하기
        </Link>
      </div>
    </div>
  );
}

/**
 * 성격 유형 검사 결과 페이지(`/result/[type]`)입니다.
 */
export default function ResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-center">
          <div className="w-full rounded-3xl border border-white/90 bg-white/90 px-6 py-12 text-sm font-medium text-slate-500 shadow-[0_12px_32px_rgba(140,125,185,0.12)]">
            결과를 불러오는 중이에요...
          </div>
        </div>
      }
    >
      <ResultContent params={params} />
    </Suspense>
  );
}
