"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CharacterViewer from "@/components/three/CharacterViewer";
import { MBTI_TYPE_LIST } from "@/data/types";

/**
 * 첫 화면(`/`) 제목 아래에서 3초마다 다른 유형의 3D 캐릭터를 순환 표시하는 컴포넌트입니다.
 * 한 화면에 3D 캔버스 1개만 유지해 모바일에서도 가볍게 동작합니다.
 */
export default function HomeCharacterShowcase() {
  // 현재 화면에 보여 줄 유형 인덱스 (0 ~ 15)
  const [typeIndex, setTypeIndex] = useState(9); // 시작은 포근 곰돌(ISFJ)
  // 자동 전환 일시정지 여부 (접근성: 사용자가 원할 때 멈출 수 있음)
  const [isPaused, setIsPaused] = useState(false);

  // OS에서 '동작 줄이기'가 켜져 있으면 처음부터 자동 전환을 멈춰 둡니다.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      const id = window.setTimeout(() => setIsPaused(true), 0);
      return () => window.clearTimeout(id);
    }
  }, []);

  // 3초마다 다음 유형 캐릭터로 바꿉니다.
  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setTypeIndex((prev) => (prev + 1) % MBTI_TYPE_LIST.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const currentType = MBTI_TYPE_LIST[typeIndex];

  return (
    <div className="flex flex-col items-center gap-2.5">
      {/* 단일 3D 캔버스 무대 */}
      <div
        className="h-[240px] w-full rounded-3xl border-2 border-white/90 shadow-[0_12px_30px_rgba(140,125,185,0.12)] transition-colors duration-500"
        style={{
          background: `radial-gradient(circle at 50% 42%, #FFFFFFEA 0%, ${currentType.color}88 100%)`,
        }}
      >
        <CharacterViewer typeCode={currentType.code} />
      </div>

      {/* 현재 캐릭터 이름 배지 + 접근성용 자동 전환 멈춤/켜기 버튼 */}
      <div className="flex w-full items-center justify-between gap-2 px-1">
        <Link
          href={`/result/${currentType.code}`}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/90 bg-white/90 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs transition-colors hover:bg-white"
        >
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: currentType.color }}
          />
          <span>
            {currentType.code} · {currentType.character.name} ({currentType.character.animal})
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="inline-flex min-h-9 items-center justify-center rounded-full border border-violet-100 bg-white/85 px-3 py-1 text-xs font-semibold text-slate-600 shadow-xs transition-colors hover:bg-violet-50"
        >
          {isPaused ? "자동 전환 켜기" : "멈춤"}
        </button>
      </div>
    </div>
  );
}
