"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, type MbtiTrait } from "@/data/questions";
import { calculateMbtiType } from "@/lib/mbti";

/**
 * 성격 유형 검사 진행 화면(`/test`)입니다.
 * 한 화면에 1문항씩 보여 주며, 선택지를 누르면 바로 다음 문항으로 넘어갑니다.
 */
export default function TestPage() {
  const router = useRouter();

  // 현재 화면에 보여 줄 문항의 순서 번호(0부터 24까지)
  const [currentIndex, setCurrentIndex] = useState(0);

  // 각 문항에서 사용자가 고른 성향 글자를 저장하는 배열
  const [answers, setAnswers] = useState<(MbtiTrait | null)[]>(() =>
    Array(QUESTIONS.length).fill(null)
  );

  // 마지막 25번 문항 선택 후 결과 페이지 이동 중 중복 클릭을 막기 위한 상태
  const [isNavigating, setIsNavigating] = useState(false);

  const totalCount = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const selectedTrait = answers[currentIndex];

  /**
   * 선택지 버튼 2개 중 하나를 눌렀을 때 실행됩니다.
   * 답을 저장한 뒤 다음 문항으로 넘어가거나, 마지막 문항이면 결과 페이지로 이동합니다.
   */
  const handleSelectOption = (trait: MbtiTrait) => {
    if (isNavigating) return;

    // 현재 문항의 답안을 새 배열에 반영합니다.
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = trait;
    setAnswers(nextAnswers);

    // 아직 남은 문항이 있으면 다음 문항으로 이동합니다.
    if (currentIndex < totalCount - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    // 25번째 문항까지 모두 답했다면 MBTI 유형을 계산해 결과 페이지로 이동합니다.
    setIsNavigating(true);
    const completedTraits = nextAnswers.filter(
      (item): item is MbtiTrait => item !== null
    );
    const mbtiType = calculateMbtiType(completedTraits);
    router.push(`/result/${mbtiType}`);
  };

  /**
   * "이전" 버튼을 눌렀을 때 앞 문항으로 되돌아갑니다.
   */
  const handlePrev = () => {
    if (currentIndex > 0 && !isNavigating) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between gap-6">
      <div className="flex flex-col gap-6">
        {/* 상단 진행 상황 영역: 현재 번호("3 / 25")와 진행 막대 */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-sm font-semibold text-violet-700">
            <span>진행 현황</span>
            <span aria-live="polite">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
          <progress
            value={currentIndex + 1}
            max={totalCount}
            aria-label={`검사 진행률 ${currentIndex + 1} / ${totalCount}`}
            className="mbti-progress h-3 w-full"
          />
        </div>

        {/* 질문 카드 영역 */}
        <section className="rounded-3xl border border-white/90 bg-white/95 p-6 shadow-[0_10px_28px_rgba(140,125,185,0.10)]">
          <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
            Q{currentQuestion.id}
          </span>
          <h1 className="mt-3 text-xl font-bold leading-relaxed text-slate-900">
            {currentQuestion.question}
          </h1>
        </section>

        {/* 선택지 2개 버튼 영역: 누르면 즉시 다음 질문으로 이동 */}
        <div className="flex flex-col gap-3.5">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedTrait === option.trait;

            return (
              <button
                key={`${currentQuestion.id}-${option.trait}`}
                type="button"
                disabled={isNavigating}
                aria-pressed={isSelected}
                onClick={() => handleSelectOption(option.trait)}
                className={`min-h-[84px] w-full rounded-3xl border-2 px-5 py-4 text-left text-base font-semibold leading-relaxed transition-all active:scale-[0.98] disabled:opacity-60 ${
                  isSelected
                    ? "border-[#6C4DF6] bg-violet-50 text-violet-950 shadow-[0_10px_24px_rgba(108,77,246,0.16)]"
                    : "border-white/90 bg-white/90 text-slate-800 shadow-[0_8px_24px_rgba(140,125,185,0.09)] hover:border-violet-200 hover:bg-violet-50/50"
                }`}
              >
                {option.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* 하단 이전 버튼 영역: 첫 질문(currentIndex === 0)에서는 숨깁니다. */}
      {currentIndex > 0 && (
        <div className="pt-2">
          <button
            type="button"
            disabled={isNavigating}
            onClick={handlePrev}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-violet-100 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-violet-50 active:scale-[0.98] disabled:opacity-60"
          >
            ← 이전
          </button>
        </div>
      )}
    </div>
  );
}
