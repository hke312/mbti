"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 구형 브라우저나 클립보드 API가 제한된 환경에서 사용하는 예비 복사 함수입니다.
 */
function legacyCopy(text: string): boolean {
  const field = Object.assign(document.createElement("textarea"), { value: text });
  field.setAttribute("readonly", "");
  field.style.cssText = "position:fixed;inset-block-start:0;opacity:0";
  document.body.append(field);
  field.select();

  try {
    return document.execCommand("copy");
  } finally {
    field.remove();
  }
}

/**
 * 현재 결과 페이지 주소를 클립보드에 복사하고 안내 문구를 보여 주는 버튼입니다.
 */
export default function ShareResultButton() {
  // 화면과 스크린 리더에 안내 문구를 띄우기 위한 상태 ("주소를 복사했어요" 등)
  const [statusMessage, setStatusMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 컴포넌트가 사라질 때 남아 있는 타이머를 정리합니다.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /**
   * "결과 공유하기" 버튼을 눌렀을 때 현재 페이지 주소를 복사합니다.
   */
  const handleShare = async () => {
    const currentUrl = window.location.href;
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl);
        copied = true;
      } else {
        copied = legacyCopy(currentUrl);
      }
    } catch {
      copied = legacyCopy(currentUrl);
    }

    // 이전 타이머가 남아 있으면 먼저 취소해 연속 클릭 시에도 안내가 겹치지 않게 합니다.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setStatusMessage(
      copied ? "주소를 복사했어요" : "주소 복사에 실패했어요. 주소창에서 복사해 주세요."
    );

    // 일정 시간이 지나면 안내 문구를 비워 오래된 메시지가 남지 않게 합니다.
    timerRef.current = setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#6C4DF6] px-6 py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(108,77,246,0.25)] transition-all hover:bg-[#5B3CE6] active:scale-[0.98]"
      >
        결과 공유하기
      </button>

      {/* 버튼 바깥에 role="status" 라이브 리전을 두어 스크린 리더도 복사 결과를 바로 읽도록 합니다. */}
      <p
        role="status"
        className={`min-h-5 text-center text-sm font-semibold text-violet-700 transition-opacity ${
          statusMessage ? "opacity-100" : "opacity-0"
        }`}
      >
        {statusMessage}
      </p>
    </div>
  );
}
