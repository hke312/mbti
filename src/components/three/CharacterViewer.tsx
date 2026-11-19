"use client";

import dynamic from "next/dynamic";
import type { MbtiTypeCode } from "@/data/types";

/**
 * 3D 캔버스는 브라우저 전용 WebGL API를 쓰므로 `ssr: false`로 서버 렌더링에서 제외합니다.
 * 클라이언트에서 번들을 불러오는 동안 "캐릭터 불러오는 중..." 안내를 표시합니다.
 */
const CharacterCanvas = dynamic(
  () => import("@/components/three/CharacterCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
        캐릭터 불러오는 중...
      </div>
    ),
  }
);

/**
 * 페이지 어디서나 안전하게 3D 캐릭터를 띄울 수 있는 래퍼 컴포넌트입니다.
 */
export default function CharacterViewer({
  typeCode = "ISFJ",
}: {
  typeCode?: MbtiTypeCode;
}) {
  return <CharacterCanvas typeCode={typeCode} />;
}
