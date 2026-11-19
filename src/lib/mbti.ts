import type { MbtiTrait } from "@/data/questions";

/**
 * MBTI를 이루는 4가지 지표 쌍입니다.
 * 각 쌍에서 더 많이 선택된 글자를 순서대로 고릅니다.
 */
const AXIS_PAIRS: ReadonlyArray<[MbtiTrait, MbtiTrait]> = [
  ["E", "I"],
  ["S", "N"],
  ["T", "F"],
  ["J", "P"],
];

/**
 * 사용자가 선택한 성향 글자 배열을 받아 최종 MBTI 4글자 유형을 계산합니다.
 *
 * @param traits - 각 문항에서 선택한 성향 글자(`E`, `I`, `S`, `N`, `T`, `F`, `J`, `P`) 목록
 * @returns 계산된 4글자 MBTI 유형 코드 (예: `"ENFP"`)
 */
export function calculateMbtiType(traits: MbtiTrait[]): string {
  // 8가지 성향 글자별 선택 횟수를 0으로 초기화합니다.
  const counts: Record<MbtiTrait, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // 사용자가 고른 답안을 하나씩 돌며 해당 성향 점수를 1씩 더합니다.
  for (const trait of traits) {
    counts[trait] += 1;
  }

  // 4가지 지표마다 더 많이 나온 쪽 글자를 골라 이어 붙입니다.
  // 동점인 경우에는 앞쪽 글자(E, S, T, J)를 선택합니다.
  return AXIS_PAIRS.map(([first, second]) =>
    counts[first] >= counts[second] ? first : second
  ).join("");
}
