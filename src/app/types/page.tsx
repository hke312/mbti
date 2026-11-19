"use client";

import Link from "next/link";
import { useState } from "react";
import CharacterViewer from "@/components/three/CharacterViewer";
import { MBTI_TYPE_LIST, MBTI_TYPES, type MbtiTypeCode } from "@/data/types";

/**
 * 헤더의 "유형 도감" 메뉴와 연결되는 `/types` 페이지입니다.
 * 위쪽에는 선택한 유형의 3D 캐릭터(단일 캔버스)를 크게 보여 주고,
 * 가운데에는 유형 정보와 자세히 보기 버튼을, 맨 아래에는 4×4 유형 선택 버튼을 배치합니다.
 */
export default function TypesPage() {
  // 현재 선택된 MBTI 유형 코드 (기본값은 첫 번째 유형인 INTJ)
  const [selectedCode, setSelectedCode] = useState<MbtiTypeCode>("INTJ");
  const selectedType = MBTI_TYPES[selectedCode];

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* 페이지 제목 및 간단한 조작 안내 */}
      <section className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">유형 도감</h1>
        <p className="text-xs font-medium text-slate-500">
          캐릭터를 돌리거나 톡 눌러 보면 폴짝 뛰어올라요!
        </p>
      </section>

      {/* 1) 위쪽: 선택한 유형의 3D 캐릭터 영역 (한 화면에 3D 캔버스 1개만 사용) */}
      <div
        className="h-[300px] w-full rounded-3xl border-2 border-white/90 shadow-[0_12px_32px_rgba(140,125,185,0.12)] transition-colors duration-300"
        style={{
          background: `radial-gradient(circle at 50% 42%, #FFFFFFE6 0%, ${selectedType.color}88 100%)`,
        }}
      >
        <CharacterViewer typeCode={selectedCode} />
      </div>

      {/* 2) 가운데: 캐릭터 이름, 유형 코드, 별명, 한 줄 소개, 자세히 보기 버튼 */}
      <section className="flex flex-col gap-3 rounded-3xl border border-white/90 bg-white/95 p-5 shadow-[0_10px_26px_rgba(140,125,185,0.09)]">
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-slate-800"
            style={{ backgroundColor: selectedType.color }}
          >
            {selectedType.character.name} · {selectedType.character.animal}
          </span>
          <span className="text-lg font-extrabold tracking-wider text-slate-900">
            {selectedType.code}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-slate-900">
            {selectedType.nickname}
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {selectedType.summary}
          </p>
        </div>

        <Link
          href={`/result/${selectedType.code}`}
          className="mt-1 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#6C4DF6] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(108,77,246,0.22)] transition-colors hover:bg-[#5B3CE6] active:scale-[0.98]"
        >
          자세히 보기
        </Link>
      </section>

      {/* 3) 맨 아래: 16개 유형 버튼 4줄 4칸 그리드 */}
      <div className="grid grid-cols-4 gap-2">
        {MBTI_TYPE_LIST.map((item) => {
          const isSelected = item.code === selectedCode;

          return (
            <button
              key={item.code}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedCode(item.code)}
              className={`flex min-h-[54px] flex-col items-center justify-center rounded-2xl border-2 px-1 py-2 transition-all active:scale-[0.96] ${
                isSelected
                  ? "border-[#6C4DF6] font-extrabold text-slate-900 shadow-sm"
                  : "border-white/90 bg-white/85 font-bold text-slate-700 hover:bg-white"
              }`}
              style={
                isSelected
                  ? { backgroundColor: `${item.color}99` }
                  : undefined
              }
            >
              <span className="text-xs tracking-wide">{item.code}</span>
              <span className="mt-0.5 text-[11px] font-medium text-slate-600">
                {item.character.animal}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
