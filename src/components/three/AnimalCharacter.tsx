"use client";

import { useEffect, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type * as THREE from "three";
import type { MbtiTypeCode } from "@/data/types";

/**
 * 16가지 유형별 3D 동물 캐릭터의 색상 팔레트입니다.
 * 대표 파스텔 색상을 바탕으로 하되, 어떤 동물인지 한눈에 알아보도록 어울리는 색을 맞췄습니다.
 */
interface AnimalPalette {
  body: string;
  accent: string;
  detail: string;
  cheek: string;
}

const ANIMAL_PALETTES: Record<MbtiTypeCode, AnimalPalette> = {
  INTJ: { body: "#A391C6", accent: "#EDE5FF", detail: "#6F5D99", cheek: "#F2A8C2" }, // 부엉이
  INTP: { body: "#9AB6E8", accent: "#EFF5FF", detail: "#5B77AD", cheek: "#F7A6BA" }, // 고양이
  ENTJ: { body: "#E8A666", accent: "#FFF1DF", detail: "#B56734", cheek: "#F59898" }, // 사자
  ENTP: { body: "#EB8952", accent: "#FFF4EA", detail: "#47342D", cheek: "#F79E9E" }, // 여우
  INFJ: { body: "#CFA584", accent: "#DCF4EC", detail: "#7E5942", cheek: "#F4A4B3" }, // 사슴
  INFP: { body: "#F9D2E3", accent: "#FFF5FA", detail: "#F09BBF", cheek: "#F596B8" }, // 토끼
  ENFJ: { body: "#EDC77B", accent: "#FFF7E2", detail: "#C48A45", cheek: "#F59EA4" }, // 강아지
  ENFP: { body: "#B86B3B", accent: "#F2D6B3", detail: "#6A381A", cheek: "#F2B49F" }, // 다람쥐
  ISTJ: { body: "#88C4A8", accent: "#E7F4FA", detail: "#5E9178", cheek: "#F2A4B0" }, // 거북이
  ISFJ: { body: "#D49A6A", accent: "#FBF0E4", detail: "#F7D4BC", cheek: "#F7A1A8" }, // 곰
  ESTJ: { body: "#3C4B66", accent: "#FFFFFF", detail: "#F5A63B", cheek: "#F5A3B2" }, // 펭귄
  ESFJ: { body: "#FFF9F4", accent: "#FCE2EE", detail: "#E8B7C9", cheek: "#F59BB6" }, // 양
  ISTP: { body: "#9E8B7E", accent: "#F7EFE8", detail: "#62534B", cheek: "#F0A2AA" }, // 고슴도치
  ISFP: { body: "#FFFFFF", accent: "#DCF5DF", detail: "#2B2830", cheek: "#F59EB0" }, // 판다
  ESTP: { body: "#C98952", accent: "#FDE7CB", detail: "#8E572C", cheek: "#F59898" }, // 원숭이
  ESFP: { body: "#FF84A6", accent: "#FFE169", detail: "#6AC5F2", cheek: "#FF6B8B" }, // 앵무새
};

/**
 * 유형별 성격에 맞춘 기본 움직임 계산 함수입니다.
 */
function getPersonalityMotion(typeCode: MbtiTypeCode, t: number) {
  switch (typeCode) {
    case "ENFP": // 다람쥐: 신나게 통통 튀기
      return {
        y: Math.abs(Math.sin(t * 4.2)) * 0.11,
        rotY: Math.sin(t * 2.1) * 0.12,
        rotX: 0,
        rotZ: Math.sin(t * 4.2) * 0.05,
      };
    case "ISTJ": // 거북이: 천천히 고개/몸 끄덕이기
      return {
        y: Math.sin(t * 1.1) * 0.025,
        rotY: Math.sin(t * 0.5) * 0.04,
        rotX: Math.max(0, Math.sin(t * 1.6)) * 0.09,
        rotZ: 0,
      };
    case "ESFP": // 앵무새: 좌우로 흔들며 춤추기
      return {
        y: Math.abs(Math.sin(t * 3.6)) * 0.07,
        rotY: Math.sin(t * 1.8) * 0.16,
        rotX: 0,
        rotZ: Math.sin(t * 3.6) * 0.12,
      };
    case "INTJ": // 부엉이: 진중하게 살짝 갸우뚱 살피기
      return {
        y: Math.sin(t * 1.3) * 0.04,
        rotY: Math.sin(t * 0.7) * 0.14,
        rotX: 0,
        rotZ: Math.sin(t * 0.9) * 0.07,
      };
    case "INTP": // 고양이: 나른하게 둥실
      return {
        y: Math.sin(t * 1.4) * 0.045,
        rotY: Math.sin(t * 0.6) * 0.06,
        rotX: Math.sin(t * 1.2) * 0.03,
        rotZ: Math.sin(t * 0.8) * 0.04,
      };
    case "ENTJ": // 사자: 당당하고 리듬감 있는 바운스
      return {
        y: Math.abs(Math.sin(t * 2.6)) * 0.065,
        rotY: Math.sin(t * 1.0) * 0.08,
        rotX: -0.02,
        rotZ: 0,
      };
    case "ENTP": // 여우: 장난스럽게 좌우 두리번
      return {
        y: Math.sin(t * 2.8) * 0.055,
        rotY: Math.sin(t * 1.9) * 0.18,
        rotX: 0,
        rotZ: Math.sin(t * 1.9) * 0.07,
      };
    case "INFJ": // 사슴: 고요하고 우아하게 둥실
      return {
        y: Math.sin(t * 1.2) * 0.055,
        rotY: Math.sin(t * 0.55) * 0.07,
        rotX: 0,
        rotZ: Math.sin(t * 0.7) * 0.03,
      };
    case "INFP": // 토끼: 몽실하게 살짝살짝 통통
      return {
        y: Math.abs(Math.sin(t * 2.5)) * 0.055,
        rotY: Math.sin(t * 1.1) * 0.08,
        rotX: 0,
        rotZ: Math.sin(t * 1.4) * 0.05,
      };
    case "ENFJ": // 강아지: 반갑게 앞으로 살짝 숙이며 통통
      return {
        y: Math.abs(Math.sin(t * 3.4)) * 0.08,
        rotY: Math.sin(t * 1.7) * 0.1,
        rotX: 0.05,
        rotZ: Math.sin(t * 3.4) * 0.06,
      };
    case "ESTJ": // 펭귄: 당차게 좌우로 뒤뚱뒤뚱
      return {
        y: Math.abs(Math.sin(t * 3.2)) * 0.045,
        rotY: Math.sin(t * 1.6) * 0.08,
        rotX: 0,
        rotZ: Math.sin(t * 3.2) * 0.1,
      };
    case "ESFJ": // 양: 다정하고 포근하게 흔들흔들
      return {
        y: Math.sin(t * 2.0) * 0.05,
        rotY: Math.sin(t * 1.2) * 0.09,
        rotX: 0,
        rotZ: Math.sin(t * 2.0) * 0.07,
      };
    case "ISTP": // 고슴도치: 차분하게 가끔 좌우로 쓱 보기
      return {
        y: Math.sin(t * 1.3) * 0.035,
        rotY: Math.sin(t * 0.65) * 0.1,
        rotX: 0,
        rotZ: 0,
      };
    case "ISFP": // 판다: 느긋하게 평화로운 리듬
      return {
        y: Math.sin(t * 1.5) * 0.045,
        rotY: Math.sin(t * 0.8) * 0.07,
        rotX: 0,
        rotZ: Math.sin(t * 1.1) * 0.06,
      };
    case "ESTP": // 원숭이: 에너지 넘치게 앞뒤 까딱 + 점프감
      return {
        y: Math.abs(Math.sin(t * 3.8)) * 0.09,
        rotY: Math.sin(t * 2.2) * 0.16,
        rotX: Math.sin(t * 3.8) * 0.06,
        rotZ: 0,
      };
    case "ISFJ": // 곰: 포근하게 둥실
    default:
      return {
        y: Math.sin(t * 1.6) * 0.055,
        rotY: Math.sin(t * 0.75) * 0.06,
        rotX: 0,
        rotZ: 0,
      };
  }
}

/**
 * 유형 코드를 받아 16가지 동물 캐릭터 중 하나를 그려 주는 공통 3D 캐릭터 컴포넌트입니다.
 * 머리·몸통·눈·팔다리 기본 골격을 함께 쓰고, 동물별 특징 부위와 움직임만 다르게 적용합니다.
 */
export default function AnimalCharacter({ typeCode }: { typeCode: MbtiTypeCode }) {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);

  // 탭(클릭)했을 때 폴짝 뛰어오르는 점프 애니메이션 시작 시각(ms)
  const jumpStartRef = useRef<number | null>(null);
  // OS 동작 줄이기 설정 여부
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      prefersReducedMotionRef.current = mediaQuery.matches;
    };
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  // 유형이 바뀔 때 진행 중이던 점프 상태는 초기화합니다.
  useEffect(() => {
    jumpStartRef.current = null;
  }, [typeCode]);

  // 캐릭터를 짧게 누르거나 탭하면 폴짝 뛰어오릅니다. (드래그 회전과 구분하기 위해 delta 확인)
  const handleJump = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta > 6) return;
    jumpStartRef.current = performance.now();
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1) 클릭/탭 점프 높이 계산 (0.48초 동안 포물선 점프)
    let jumpY = 0;
    let jumpSquash = 1;
    if (jumpStartRef.current !== null) {
      const elapsed = (performance.now() - jumpStartRef.current) / 1000;
      const duration = 0.48;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        jumpY = Math.sin(progress * Math.PI) * 0.48;
        jumpSquash = 1 + Math.sin(progress * Math.PI * 2) * 0.06;
      } else {
        jumpStartRef.current = null;
      }
    }

    if (prefersReducedMotionRef.current) {
      if (rootRef.current) {
        rootRef.current.position.y = jumpY * 0.5;
        rootRef.current.rotation.set(0, 0, 0);
      }
      return;
    }

    // 2) 유형별 성격에 어울리는 움직임 적용
    const motion = getPersonalityMotion(typeCode, t);
    if (rootRef.current) {
      rootRef.current.position.y = motion.y + jumpY;
      rootRef.current.rotation.set(motion.rotX, motion.rotY, motion.rotZ);
      rootRef.current.scale.set(1 / Math.sqrt(jumpSquash), jumpSquash, 1 / Math.sqrt(jumpSquash));
    }

    // 3) 공통 숨 쉬기 (몸통과 머리가 살짝 커졌다 작아짐)
    if (bodyRef.current) {
      const breath = 1 + Math.sin(t * 2.2) * 0.025;
      bodyRef.current.scale.set(breath, 1 / Math.sqrt(breath), breath);
    }
    if (headRef.current) {
      const headBreath = 1 + Math.sin(t * 2.2) * 0.01;
      headRef.current.scale.setScalar(headBreath);
    }

    // 4) 꼬리 살랑임 (고양이, 강아지, 여우, 원숭이, 다람쥐)
    if (tailRef.current) {
      const wagSpeed = typeCode === "ENFJ" ? 7.5 : 3.0;
      const wagAmp = typeCode === "ENFJ" ? 0.35 : 0.16;
      tailRef.current.rotation.y = Math.sin(t * wagSpeed) * wagAmp;
    }

    // 5) 날개 퍼덕임 (부엉이, 펭귄, 앵무새)
    if (leftWingRef.current && rightWingRef.current) {
      const flapSpeed = typeCode === "ESFP" ? 5.5 : 2.8;
      const flapAmp = typeCode === "ESFP" ? 0.22 : 0.1;
      const flap = Math.sin(t * flapSpeed) * flapAmp;
      leftWingRef.current.rotation.z = 0.55 + flap;
      rightWingRef.current.rotation.z = -0.55 - flap;
    }

    // 6) 약 3.6초마다 눈 깜빡이기
    const blinkCycle = t % 3.6;
    let eyeScaleY = 1;
    if (blinkCycle < 0.16) {
      eyeScaleY = Math.max(0.08, 1 - Math.sin((blinkCycle / 0.16) * Math.PI) * 0.92);
    }
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = eyeScaleY;
      rightEyeRef.current.scale.y = eyeScaleY;
    }
  });

  const palette = ANIMAL_PALETTES[typeCode];
  const isBird = typeCode === "INTJ" || typeCode === "ESTJ" || typeCode === "ESFP";
  const hasBeak = isBird;
  const hasPointySnout = typeCode === "ENTP" || typeCode === "ISTP";
  const limbColor = typeCode === "ISFP" || typeCode === "ESTJ" ? palette.detail : palette.body;

  return (
    <group ref={rootRef} onClick={handleJump}>
      {/* ======================== 1. 공통 머리 + 동물별 얼굴/귀 특징 ======================== */}
      <group ref={headRef} position={[0, 0.42, 0]}>
        {/* 기본 둥근 머리 (모바일 성능을 위해 적정 면 수 24x20 사용) */}
        <mesh scale={[1.08, 0.96, 0.98]}>
          <sphereGeometry args={[0.62, 24, 20]} />
          <meshStandardMaterial color={palette.body} roughness={0.42} metalness={0.02} />
        </mesh>

        {/* 펭귄(ESTJ) 전용: 하얀 얼굴 마스크 */}
        {typeCode === "ESTJ" && (
          <mesh position={[0, -0.05, 0.22]} scale={[0.92, 0.85, 0.85]}>
            <sphereGeometry args={[0.5, 20, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.42} />
          </mesh>
        )}

        {/* 고슴도치(ISTP) 전용: 돌출된 부드러운 밝은 볼/입 주변 마스크 */}
        {typeCode === "ISTP" && (
          <mesh position={[0, -0.1, 0.34]} scale={[0.88, 0.76, 0.7]}>
            <sphereGeometry args={[0.41, 20, 16]} />
            <meshStandardMaterial color={palette.accent} roughness={0.45} />
          </mesh>
        )}

        {/* 원숭이(ESTP) 전용: 하트 모양의 깔끔한 밝은 얼굴 마스크 */}
        {typeCode === "ESTP" && (
          <>
            <mesh position={[-0.17, 0.07, 0.455]} scale={[1.0, 0.92, 0.52]}>
              <sphereGeometry args={[0.23, 18, 14]} />
              <meshStandardMaterial color={palette.accent} roughness={0.45} />
            </mesh>
            <mesh position={[0.17, 0.07, 0.455]} scale={[1.0, 0.92, 0.52]}>
              <sphereGeometry args={[0.23, 18, 14]} />
              <meshStandardMaterial color={palette.accent} roughness={0.45} />
            </mesh>
            <mesh position={[0, -0.13, 0.44]} scale={[1.15, 0.8, 0.56]}>
              <sphereGeometry args={[0.28, 18, 14]} />
              <meshStandardMaterial color={palette.accent} roughness={0.45} />
            </mesh>
          </>
        )}

        {/* 판다(ISFP) 전용: 눈 주변 검은 무늬 */}
        {typeCode === "ISFP" && (
          <>
            <mesh position={[-0.23, 0.07, 0.51]} rotation={[0, 0, 0.32]} scale={[1.25, 0.95, 0.45]}>
              <sphereGeometry args={[0.13, 14, 12]} />
              <meshStandardMaterial color={palette.detail} roughness={0.4} />
            </mesh>
            <mesh position={[0.23, 0.07, 0.51]} rotation={[0, 0, -0.32]} scale={[1.25, 0.95, 0.45]}>
              <sphereGeometry args={[0.13, 14, 12]} />
              <meshStandardMaterial color={palette.detail} roughness={0.4} />
            </mesh>
          </>
        )}

        {/* 부엉이(INTJ) 전용: 동심원 무늬의 큰 얼굴 원반(눈테) 2개 */}
        {typeCode === "INTJ" &&
          [-1, 1].map((side) => (
            <group
              key={side}
              position={[side * 0.205, 0.06, 0.525]}
              rotation={[-0.04, side * 0.33, 0]}
            >
              {/* 연보라빛 얼굴 원반 바탕 */}
              <mesh scale={[1.04, 1.0, 0.3]}>
                <sphereGeometry args={[0.255, 24, 16]} />
                <meshStandardMaterial color="#DCD1EE" roughness={0.48} />
              </mesh>
              {/* 바깥쪽·중간·안쪽 진한 보라빛 동심원 테두리 (앞으로 뚜렷하게 감싸도록 배치) */}
              <mesh position={[0, 0, 0.046]} scale={[1.04, 1.0, 0.45]}>
                <torusGeometry args={[0.228, 0.016, 10, 28]} />
                <meshStandardMaterial color="#65496E" roughness={0.45} />
              </mesh>
              <mesh position={[0, 0, 0.066]} scale={[1.04, 1.0, 0.45]}>
                <torusGeometry args={[0.175, 0.015, 10, 26]} />
                <meshStandardMaterial color="#65496E" roughness={0.45} />
              </mesh>
              <mesh position={[0, 0, 0.077]} scale={[1.04, 1.0, 0.45]}>
                <torusGeometry args={[0.125, 0.014, 10, 24]} />
                <meshStandardMaterial color="#65496E" roughness={0.45} />
              </mesh>
              {/* 눈 바로 뒤 부드러운 흰자 쿠션 */}
              <mesh position={[0, 0, 0.083]} scale={[1, 1, 0.24]}>
                <sphereGeometry args={[0.104, 16, 12]} />
                <meshStandardMaterial color="#F7F3FF" roughness={0.35} />
              </mesh>
            </group>
          ))}

        {/* 사자(ENTJ) 전용: 얼굴을 빙 두른 몽글한 갈기 */}
        {typeCode === "ENTJ" &&
          Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 0.61;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.95, -0.04]}
              >
                <sphereGeometry args={[0.22, 12, 10]} />
                <meshStandardMaterial color={palette.detail} roughness={0.5} />
              </mesh>
            );
          })}

        {/* 양(ESFJ) 전용: 머리 위 몽글몽글한 양털 구 여러 개 */}
        {typeCode === "ESFJ" && (
          <>
            {[
              [0, 0.56, 0.08],
              [-0.2, 0.53, 0.1],
              [0.2, 0.53, 0.1],
              [-0.12, 0.57, -0.12],
              [0.12, 0.57, -0.12],
            ].map(([x, y, z], idx) => (
              <mesh key={idx} position={[x, y, z]}>
                <sphereGeometry args={[0.17, 12, 10]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.55} />
              </mesh>
            ))}
          </>
        )}

        {/* 앵무새(ESFP) 전용: 머리 위 알록달록한 깃털 벼슬 (상단이 잘리지 않게 높이 조절) */}
        {typeCode === "ESFP" && (
          <group position={[0, 0.56, 0.06]}>
            <mesh position={[-0.08, 0.07, 0]} rotation={[0.1, 0, 0.4]}>
              <capsuleGeometry args={[0.052, 0.13, 6, 10]} />
              <meshStandardMaterial color="#FFD95E" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.1, 0.02]} rotation={[0.15, 0, 0]}>
              <capsuleGeometry args={[0.056, 0.15, 6, 10]} />
              <meshStandardMaterial color="#FF6B93" roughness={0.4} />
            </mesh>
            <mesh position={[0.08, 0.07, 0]} rotation={[0.1, 0, -0.4]}>
              <capsuleGeometry args={[0.052, 0.13, 6, 10]} />
              <meshStandardMaterial color="#6AC5F2" roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* ---------- 귀 / 뿔 / 귀깃 분기 ---------- */}
        {/* 곰(ISFJ) / 판다(ISFP) / 사자(ENTJ) / 다람쥐(ENFP): 둥근 귀 */}
        {(typeCode === "ISFJ" ||
          typeCode === "ISFP" ||
          typeCode === "ENTJ" ||
          typeCode === "ENFP") && (
          <>
            {[-1, 1].map((side) => (
              <group key={side} position={[side * 0.47, 0.45, -0.02]}>
                <mesh scale={[1, 1, 0.7]}>
                  <sphereGeometry args={[typeCode === "ENFP" ? 0.18 : 0.21, 14, 12]} />
                  <meshStandardMaterial
                    color={typeCode === "ISFP" ? palette.detail : palette.body}
                    roughness={0.42}
                  />
                </mesh>
                {typeCode !== "ISFP" && (
                  <mesh position={[0, 0, 0.08]} scale={[1, 1, 0.6]}>
                    <sphereGeometry args={[0.115, 12, 10]} />
                    <meshStandardMaterial color={palette.accent} roughness={0.45} />
                  </mesh>
                )}
              </group>
            ))}
          </>
        )}

        {/* 원숭이(ESTP): 얼굴 옆 크고 둥근 귀 */}
        {typeCode === "ESTP" &&
          [-1, 1].map((side) => (
            <group key={side} position={[side * 0.68, 0.06, 0]}>
              <mesh scale={[1, 1, 0.52]}>
                <sphereGeometry args={[0.23, 14, 12]} />
                <meshStandardMaterial color={palette.body} roughness={0.42} />
              </mesh>
              <mesh position={[0, 0, 0.06]} scale={[1, 1, 0.5]}>
                <sphereGeometry args={[0.14, 12, 10]} />
                <meshStandardMaterial color={palette.accent} roughness={0.45} />
              </mesh>
            </group>
          ))}

        {/* 고양이(INTP) / 여우(ENTP): 뾰족한 세모 귀 */}
        {(typeCode === "INTP" || typeCode === "ENTP") &&
          [-1, 1].map((side) => {
            const isFox = typeCode === "ENTP";
            return (
              <group
                key={side}
                position={[side * (isFox ? 0.42 : 0.4), isFox ? 0.56 : 0.52, -0.02]}
                rotation={[0, 0, -side * (isFox ? 0.28 : 0.35)]}
              >
                <mesh>
                  <coneGeometry args={[isFox ? 0.21 : 0.19, isFox ? 0.48 : 0.38, 12]} />
                  <meshStandardMaterial color={palette.body} roughness={0.42} />
                </mesh>
                <mesh position={[0, -0.03, 0.07]} scale={[0.6, 0.65, 0.5]}>
                  <coneGeometry args={[0.16, 0.3, 12]} />
                  <meshStandardMaterial
                    color={isFox ? palette.accent : "#F8B8CB"}
                    roughness={0.45}
                  />
                </mesh>
                {isFox && (
                  <mesh position={[0, 0.16, 0]}>
                    <coneGeometry args={[0.08, 0.18, 10]} />
                    <meshStandardMaterial color={palette.detail} roughness={0.42} />
                  </mesh>
                )}
              </group>
            );
          })}

        {/* 토끼(INFP): 길쭉한 귀 (위쪽이 잘리지 않게 각도와 길이 다듬기) */}
        {typeCode === "INFP" &&
          [-1, 1].map((side) => (
            <group
              key={side}
              position={[side * 0.27, 0.59, -0.01]}
              rotation={[0.08, 0, -side * 0.22]}
            >
              <mesh scale={[0.95, 1, 0.65]}>
                <capsuleGeometry args={[0.12, 0.32, 6, 12]} />
                <meshStandardMaterial color={palette.body} roughness={0.42} />
              </mesh>
              <mesh position={[0, -0.02, 0.052]} scale={[0.6, 0.85, 0.5]}>
                <capsuleGeometry args={[0.09, 0.26, 6, 10]} />
                <meshStandardMaterial color={palette.detail} roughness={0.45} />
              </mesh>
            </group>
          ))}

        {/* 강아지(ENFJ): 아래로 처진 귀 */}
        {typeCode === "ENFJ" &&
          [-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.62, -0.02, 0.06]}
              rotation={[0.1, 0, side * 0.22]}
              scale={[0.75, 1, 0.6]}
            >
              <capsuleGeometry args={[0.16, 0.34, 6, 12]} />
              <meshStandardMaterial color={palette.detail} roughness={0.45} />
            </mesh>
          ))}

        {/* 양(ESFJ): 옆으로 난 귀 */}
        {typeCode === "ESFJ" &&
          [-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.68, 0.08, 0.02]}
              rotation={[0, 0, side * 1.28]}
              scale={[0.7, 1, 0.6]}
            >
              <capsuleGeometry args={[0.1, 0.2, 6, 10]} />
              <meshStandardMaterial color={palette.accent} roughness={0.45} />
            </mesh>
          ))}

        {/* 부엉이(INTJ): 미간 위에서 옆으로 부드럽게 쓸려 올라간 풍성한 눈썹 귀깃 */}
        {typeCode === "INTJ" &&
          [-1, 1].map((side) => (
            <group key={side}>
              {/* 눈 위 안쪽부터 붙는 아래쪽 깃털 다발 */}
              <mesh
                position={[side * 0.28, 0.4, 0.34]}
                rotation={[-0.1, side * 0.25, -side * 1.02]}
                scale={[0.85, 1.0, 0.65]}
              >
                <capsuleGeometry args={[0.072, 0.24, 6, 12]} />
                <meshStandardMaterial color="#6E4D9C" roughness={0.44} />
              </mesh>
              {/* 중간 풍성한 깃털 */}
              <mesh
                position={[side * 0.38, 0.48, 0.21]}
                rotation={[-0.08, side * 0.2, -side * 0.92]}
                scale={[0.88, 1.0, 0.68]}
              >
                <capsuleGeometry args={[0.082, 0.28, 6, 12]} />
                <meshStandardMaterial color="#624091" roughness={0.44} />
              </mesh>
              {/* 바깥쪽 뾰족하게 마무리되는 귀깃 끝 */}
              <mesh
                position={[side * 0.47, 0.56, 0.1]}
                rotation={[-0.06, side * 0.15, -side * 0.8]}
                scale={[0.92, 1.0, 0.65]}
              >
                <coneGeometry args={[0.095, 0.32, 12]} />
                <meshStandardMaterial color="#553583" roughness={0.42} />
              </mesh>
            </group>
          ))}

        {/* 사슴(INFJ): 작은 사슴 귀 + 가지 모양 뿔 */}
        {typeCode === "INFJ" &&
          [-1, 1].map((side) => (
            <group key={side}>
              {/* 옆 귀 */}
              <mesh
                position={[side * 0.6, 0.24, -0.04]}
                rotation={[0, 0, side * 1.05]}
                scale={[0.65, 1, 0.55]}
              >
                <capsuleGeometry args={[0.09, 0.22, 6, 10]} />
                <meshStandardMaterial color={palette.body} roughness={0.42} />
              </mesh>
              {/* 가지 모양 뿔 */}
              <group position={[side * 0.24, 0.62, -0.02]} rotation={[0, 0, -side * 0.22]}>
                <mesh>
                  <capsuleGeometry args={[0.036, 0.34, 4, 8]} />
                  <meshStandardMaterial color={palette.detail} roughness={0.45} />
                </mesh>
                <mesh position={[side * 0.08, 0.08, 0.02]} rotation={[0, 0, -side * 0.65]}>
                  <capsuleGeometry args={[0.028, 0.16, 4, 8]} />
                  <meshStandardMaterial color={palette.detail} roughness={0.45} />
                </mesh>
              </group>
            </group>
          ))}

        {/* 고슴도치(ISTP): 작은 둥근 귀 */}
        {typeCode === "ISTP" && (
          <>
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.52, 0.28, 0.05]} scale={[1, 1, 0.6]}>
                <sphereGeometry args={[0.11, 12, 10]} />
                <meshStandardMaterial color={palette.accent} roughness={0.45} />
              </mesh>
            ))}
          </>
        )}

        {/* ---------- 까만 눈 2개 + 작은 하얀 반짝임 (부엉이는 따뜻한 갈색 홍채 포함) ---------- */}
        {[
          { ref: leftEyeRef, side: -1 },
          { ref: rightEyeRef, side: 1 },
        ].map(({ ref, side }) => (
          <group
            key={side}
            ref={ref}
            position={[
              side * (typeCode === "INTJ" ? 0.228 : 0.22),
              0.065,
              typeCode === "INTJ" ? 0.605 : 0.55,
            ]}
          >
            {typeCode === "INTJ" && (
              <mesh position={[0, 0, -0.012]} scale={[1, 1, 0.65]}>
                <sphereGeometry args={[0.092, 16, 12]} />
                <meshStandardMaterial color="#7D492D" roughness={0.28} />
              </mesh>
            )}
            <mesh>
              <sphereGeometry args={[typeCode === "INTJ" ? 0.064 : 0.075, 14, 12]} />
              <meshStandardMaterial color="#1E1816" roughness={0.14} metalness={0.05} />
            </mesh>
            <mesh position={[0.024, 0.024, typeCode === "INTJ" ? 0.055 : 0.062]}>
              <sphereGeometry args={[0.023, 8, 6]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[-0.018, -0.018, typeCode === "INTJ" ? 0.058 : 0.066]}>
              <sphereGeometry args={[0.011, 8, 6]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>
        ))}

        {/* ---------- 볼록한 볼 (부엉이는 얼굴 원반이 넓어 생략, 다람쥐는 더 볼록하게 강조) ---------- */}
        {typeCode !== "INTJ" &&
          [-1, 1].map((side) => (
            <mesh
              key={side}
              position={[
                side * (typeCode === "ENFP" ? 0.34 : 0.36),
                -0.1,
                typeCode === "ENFP" ? 0.49 : 0.47,
              ]}
              scale={typeCode === "ENFP" ? [1.35, 1.05, 0.72] : [1.2, 0.76, 0.35]}
            >
              <sphereGeometry args={[typeCode === "ENFP" ? 0.12 : 0.082, 12, 10]} />
              <meshStandardMaterial
                color={palette.cheek}
                roughness={0.5}
              />
            </mesh>
          ))}

        {/* ---------- 부리 / 뾰족한 주둥이 / 둥근 주둥이 ---------- */}
        {typeCode === "INTJ" ? (
          // 부엉이(INTJ): 아래로 도톰하게 굽은 노란 갈고리 부리
          <group position={[0, -0.015, 0.615]}>
            <mesh position={[0, 0.02, -0.01]} scale={[0.95, 0.85, 0.85]}>
              <sphereGeometry args={[0.074, 14, 12]} />
              <meshStandardMaterial color="#E6A334" roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.035, 0.035]} rotation={[2.35, 0, 0]} scale={[1.05, 1, 0.92]}>
              <coneGeometry args={[0.074, 0.17, 14]} />
              <meshStandardMaterial color="#E6A334" roughness={0.35} />
            </mesh>
          </group>
        ) : hasBeak ? (
          // 새(부엉이, 펭귄, 앵무새) 부리
          <group position={[0, -0.06, 0.62]}>
            <mesh
              rotation={[typeCode === "ESFP" ? 1.85 : 1.55, 0, 0]}
              scale={[1.1, 1, 0.85]}
            >
              <coneGeometry args={[0.085, 0.18, 12]} />
              <meshStandardMaterial
                color={typeCode === "ESFP" ? "#FFB74D" : "#F7AE3B"}
                roughness={0.35}
              />
            </mesh>
            {typeCode === "ESFP" && (
              <mesh position={[0, -0.06, 0.04]} rotation={[2.45, 0, 0]}>
                <coneGeometry args={[0.055, 0.12, 10]} />
                <meshStandardMaterial color="#F28C28" roughness={0.35} />
              </mesh>
            )}
          </group>
        ) : hasPointySnout ? (
          // 여우(ENTP), 고슴도치(ISTP): 둥근 밑볼과 이어지는 뾰족한 주둥이와 코
          <group position={[0, -0.11, 0.54]}>
            <mesh scale={[1.15, 0.86, 0.65]}>
              <sphereGeometry args={[0.135, 16, 12]} />
              <meshStandardMaterial color={palette.accent} roughness={0.45} />
            </mesh>
            <mesh position={[0, 0, 0.06]} rotation={[1.55, 0, 0]} scale={[1.05, 1, 0.85]}>
              <coneGeometry args={[0.115, 0.24, 16]} />
              <meshStandardMaterial color={palette.accent} roughness={0.45} />
            </mesh>
            <mesh position={[0, 0.01, 0.18]}>
              <sphereGeometry args={[0.044, 10, 8]} />
              <meshStandardMaterial color="#2D201B" roughness={0.2} />
            </mesh>
          </group>
        ) : (
          // 둥근 주둥이 + 코 (거북이는 코만 단정하게, 강아지는 내민 혀, 고양이는 수염 추가)
          <group position={[0, -0.11, 0.54]}>
            {typeCode !== "ISTJ" && (
              <mesh scale={[1.24, 0.9, 0.76]}>
                <sphereGeometry args={[0.165, 16, 12]} />
                <meshStandardMaterial
                  color={typeCode === "ESFJ" ? "#FFF7FA" : palette.accent}
                  roughness={0.45}
                />
              </mesh>
            )}

            {/* 동글 코 */}
            <mesh
              position={[0, typeCode === "ISTJ" ? 0.04 : 0.06, typeCode === "ISTJ" ? 0.05 : 0.12]}
              scale={[1.2, 0.85, 0.8]}
            >
              <sphereGeometry args={[typeCode === "ISTJ" ? 0.032 : 0.048, 12, 10]} />
              <meshStandardMaterial color="#35241D" roughness={0.2} />
            </mesh>

            {/* 강아지(ENFJ) 전용: 귀여운 내민 혀 */}
            {typeCode === "ENFJ" && (
              <mesh position={[0, -0.08, 0.11]} rotation={[0.35, 0, 0]} scale={[1, 1, 0.5]}>
                <capsuleGeometry args={[0.045, 0.06, 4, 8]} />
                <meshStandardMaterial color="#FF7F9E" roughness={0.35} />
              </mesh>
            )}

            {/* 고양이(INTP) 전용: 양쪽 수염 3줄씩 */}
            {typeCode === "INTP" &&
              [-1, 1].map((side) =>
                [-0.14, 0, 0.14].map((tilt, idx) => (
                  <mesh
                    key={`${side}-${idx}`}
                    position={[side * 0.25, 0.01 + idx * -0.025, 0.04]}
                    rotation={[0, -side * 0.2, Math.PI / 2 + side * tilt]}
                  >
                    <capsuleGeometry args={[0.008, 0.19, 4, 6]} />
                    <meshStandardMaterial color="#3A4359" roughness={0.4} />
                  </mesh>
                ))
              )}
          </group>
        )}
      </group>

      {/* ======================== 2. 공통 통통한 몸통 + 등 특징 ======================== */}
      <group ref={bodyRef} position={[0, -0.36, 0]}>
        {/* 기본 통통한 몸통 */}
        <mesh scale={[1.08, 1.04, 0.95]}>
          <sphereGeometry args={[0.43, 20, 16]} />
          <meshStandardMaterial color={palette.body} roughness={0.42} metalness={0.02} />
        </mesh>

        {/* 배 중앙 밝은 무늬 (양은 몽글한 털을 두르므로 생략, 판다는 어깨 띠와 겹치지 않게 아래에 배치) */}
        {typeCode !== "ESFJ" && (
          <mesh
            position={[0, typeCode === "ISFP" ? -0.14 : -0.03, typeCode === "ISFP" ? 0.3 : 0.32]}
            scale={typeCode === "ISFP" ? [0.95, 0.9, 0.48] : [1, 1.15, 0.48]}
          >
            <sphereGeometry args={[typeCode === "ISFP" ? 0.21 : 0.25, 16, 14]} />
            <meshStandardMaterial color={palette.accent} roughness={0.48} />
          </mesh>
        )}

        {/* 판다(ISFP) 전용: 어깨를 두르는 검은 띠 */}
        {typeCode === "ISFP" && (
          <mesh position={[0, 0.21, 0]} scale={[1.09, 0.31, 0.97]}>
            <sphereGeometry args={[0.415, 20, 14]} />
            <meshStandardMaterial color={palette.detail} roughness={0.42} />
          </mesh>
        )}

        {/* 양(ESFJ) 전용: 몸통을 감싸는 몽글몽글한 양털 구 여러 개 */}
        {typeCode === "ESFJ" &&
          [
            [0, 0.04, 0.3],
            [-0.25, 0.05, 0.22],
            [0.25, 0.05, 0.22],
            [-0.32, -0.08, -0.04],
            [0.32, -0.08, -0.04],
            [-0.2, -0.08, -0.26],
            [0.2, -0.08, -0.26],
            [0, -0.02, -0.32],
            [0, -0.18, 0.22],
          ].map(([x, y, z], idx) => (
            <mesh key={idx} position={[x, y, z]}>
              <sphereGeometry args={[0.21, 12, 10]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.55} />
            </mesh>
          ))}

        {/* 거북이(ISTJ) 전용: 앞에서도 좌우로 또렷이 보이는 등딱지 + 크림 테두리 */}
        {typeCode === "ISTJ" && (
          <group position={[0, 0.02, -0.1]} rotation={[-0.18, 0, 0]}>
            <mesh scale={[1.34, 1.22, 0.92]}>
              <sphereGeometry args={[0.42, 18, 14]} />
              <meshStandardMaterial color={palette.detail} roughness={0.38} />
            </mesh>
            <mesh position={[0, 0, 0.07]} scale={[1.4, 1.28, 0.28]}>
              <sphereGeometry args={[0.41, 16, 14]} />
              <meshStandardMaterial color="#EBD8A8" roughness={0.45} />
            </mesh>
          </group>
        )}

        {/* 사슴(INFJ) 전용: 등 위와 앞옆구리에 드러나는 하얀 점 무늬 */}
        {typeCode === "INFJ" &&
          [
            [-0.14, 0.1, -0.36],
            [0.14, 0.1, -0.36],
            [0, -0.04, -0.4],
            [-0.16, -0.12, -0.34],
            [0.16, -0.12, -0.34],
            [-0.28, 0.15, 0.29],
            [0.28, 0.15, 0.29],
            [-0.33, -0.02, 0.28],
            [0.33, -0.02, 0.28],
          ].map(([x, y, z], idx) => (
            <mesh key={idx} position={[x, y, z]} scale={[1, 1, 0.55]}>
              <sphereGeometry args={[0.048, 10, 8]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.45} />
            </mesh>
          ))}

        {/* 고슴도치(ISTP) 전용: 앞에서도 윤곽이 살아나는 머리·어깨·등 가시 여러 개 */}
        {typeCode === "ISTP" &&
          [
            { pos: [0, 1.44, -0.16], rot: [-0.22, 0, 0] },
            { pos: [-0.46, 1.32, -0.16], rot: [-0.2, 0, 0.62] },
            { pos: [0.46, 1.32, -0.16], rot: [-0.2, 0, -0.62] },
            { pos: [-0.71, 0.98, -0.14], rot: [-0.18, 0, 1.22] },
            { pos: [0.71, 0.98, -0.14], rot: [-0.18, 0, -1.22] },
            { pos: [-0.63, 0.58, -0.14], rot: [-0.18, 0, 1.42] },
            { pos: [0.63, 0.58, -0.14], rot: [-0.18, 0, -1.42] },
            { pos: [0, 0.2, -0.36], rot: [-1.1, 0, 0] },
            { pos: [-0.2, 0.16, -0.32], rot: [-1.1, 0, 0.45] },
            { pos: [0.2, 0.16, -0.32], rot: [-1.1, 0, -0.45] },
            { pos: [-0.14, 0, -0.39], rot: [-1.45, 0, 0.3] },
            { pos: [0.14, 0, -0.39], rot: [-1.45, 0, -0.3] },
            { pos: [0, -0.15, -0.38], rot: [-1.75, 0, 0] },
            { pos: [-0.25, -0.08, -0.3], rot: [-1.45, 0, 0.65] },
            { pos: [0.25, -0.08, -0.3], rot: [-1.45, 0, -0.65] },
          ].map((spine, idx) => (
            <mesh
              key={idx}
              position={spine.pos as [number, number, number]}
              rotation={spine.rot as [number, number, number]}
            >
              <coneGeometry args={[0.095, 0.3, 10]} />
              <meshStandardMaterial color={palette.detail} roughness={0.45} />
            </mesh>
          ))}

        {/* ---------- 동물별 꼬리 특징 (정면에서도 오른쪽 옆으로 또렷이 보이게 배치) ---------- */}
        <group ref={tailRef} position={[0, -0.16, -0.32]}>
          {/* 고양이(INTP): 오른쪽 팔 옆으로 길게 솟은 꼬리 */}
          {typeCode === "INTP" && (
            <group position={[0.28, 0, 0.08]} rotation={[-0.08, 0.18, -0.82]}>
              <mesh position={[0, 0.2, -0.04]} rotation={[0.18, 0, 0]}>
                <capsuleGeometry args={[0.056, 0.42, 6, 10]} />
                <meshStandardMaterial color={palette.body} roughness={0.42} />
              </mesh>
              <mesh position={[0.04, 0.48, -0.04]} rotation={[-0.15, 0, -0.35]}>
                <capsuleGeometry args={[0.054, 0.22, 6, 10]} />
                <meshStandardMaterial color={palette.detail} roughness={0.42} />
              </mesh>
            </group>
          )}

          {/* 사자(ENTJ): 오른쪽 옆으로 뻗어 끝에 털 뭉치가 달린 꼬리 */}
          {typeCode === "ENTJ" && (
            <group position={[0.28, -0.02, 0.08]} rotation={[-0.08, 0.18, -0.9]}>
              <mesh position={[0, 0.2, -0.04]} rotation={[0.18, 0, 0]}>
                <capsuleGeometry args={[0.036, 0.42, 4, 8]} />
                <meshStandardMaterial color={palette.body} roughness={0.42} />
              </mesh>
              <mesh position={[0, 0.46, -0.06]}>
                <sphereGeometry args={[0.11, 12, 10]} />
                <meshStandardMaterial color={palette.detail} roughness={0.5} />
              </mesh>
            </group>
          )}

          {/* 여우(ENTP): 옆으로 풍성하게 드러나는 끝이 하얀 꼬리 */}
          {typeCode === "ENTP" && (
            <group position={[0.32, -0.02, 0.08]} rotation={[-0.1, 0.2, -0.78]}>
              <mesh position={[0, 0.18, -0.04]} rotation={[0.15, 0, 0]}>
                <capsuleGeometry args={[0.145, 0.36, 6, 12]} />
                <meshStandardMaterial color={palette.body} roughness={0.45} />
              </mesh>
              <mesh position={[0, 0.4, -0.06]}>
                <sphereGeometry args={[0.145, 12, 10]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.45} />
              </mesh>
            </group>
          )}

          {/* 다람쥐(ENFP): 왼쪽 옆으로 복슬복슬 S자로 말려 올라간 줄무늬 꼬리 */}
          {typeCode === "ENFP" && (
            <group position={[-0.25, -0.06, 0.12]} rotation={[0.04, -0.14, 0.12]}>
              {/* 1) 밤색 기본 꼬리 실루엣 (엉덩이→옆→위→안쪽으로 부드럽게 말리는 4단 곡선) */}
              <mesh position={[-0.06, 0.08, -0.02]} rotation={[0.05, 0, 0.72]}>
                <capsuleGeometry args={[0.125, 0.2, 8, 12]} />
                <meshStandardMaterial color={palette.body} roughness={0.52} />
              </mesh>
              <mesh position={[-0.21, 0.24, -0.04]} rotation={[0.05, 0, 0.3]}>
                <capsuleGeometry args={[0.158, 0.22, 8, 14]} />
                <meshStandardMaterial color={palette.body} roughness={0.52} />
              </mesh>
              <mesh position={[-0.26, 0.44, -0.02]} rotation={[0.08, 0, -0.18]}>
                <capsuleGeometry args={[0.165, 0.2, 8, 14]} />
                <meshStandardMaterial color={palette.body} roughness={0.52} />
              </mesh>
              <mesh position={[-0.2, 0.56, 0.03]} rotation={[0.14, 0, -0.62]}>
                <capsuleGeometry args={[0.135, 0.14, 8, 12]} />
                <meshStandardMaterial color={palette.body} roughness={0.52} />
              </mesh>

              {/* 2) 둥글게 감싸는 크림 베이지 줄무늬 결 */}
              <mesh position={[-0.04, 0.09, 0.025]} rotation={[0.05, 0, 0.72]}>
                <capsuleGeometry args={[0.105, 0.18, 8, 12]} />
                <meshStandardMaterial color={palette.accent} roughness={0.52} />
              </mesh>
              <mesh position={[-0.18, 0.25, 0.015]} rotation={[0.05, 0, 0.3]}>
                <capsuleGeometry args={[0.132, 0.2, 8, 12]} />
                <meshStandardMaterial color={palette.accent} roughness={0.52} />
              </mesh>
              <mesh position={[-0.23, 0.45, 0.035]} rotation={[0.08, 0, -0.18]}>
                <capsuleGeometry args={[0.138, 0.18, 8, 12]} />
                <meshStandardMaterial color={palette.accent} roughness={0.52} />
              </mesh>
              <mesh position={[-0.18, 0.56, 0.075]} rotation={[0.14, 0, -0.62]}>
                <capsuleGeometry args={[0.112, 0.12, 8, 12]} />
                <meshStandardMaterial color={palette.accent} roughness={0.52} />
              </mesh>

              {/* 3) 바깥·뒤쪽 입체감을 잡아주는 진한 초코 브라운 줄무늬 결 */}
              <mesh position={[-0.26, 0.24, -0.005]} rotation={[0.05, 0, 0.3]}>
                <capsuleGeometry args={[0.118, 0.19, 8, 12]} />
                <meshStandardMaterial color={palette.detail} roughness={0.52} />
              </mesh>
              <mesh position={[-0.31, 0.44, 0.01]} rotation={[0.08, 0, -0.18]}>
                <capsuleGeometry args={[0.122, 0.17, 8, 12]} />
                <meshStandardMaterial color={palette.detail} roughness={0.52} />
              </mesh>
              <mesh position={[-0.24, 0.56, 0.055]} rotation={[0.14, 0, -0.62]}>
                <capsuleGeometry args={[0.098, 0.11, 8, 12]} />
                <meshStandardMaterial color={palette.detail} roughness={0.52} />
              </mesh>
            </group>
          )}

          {/* 원숭이(ESTP): 옆으로 길게 S자로 말린 꼬리 */}
          {typeCode === "ESTP" && (
            <group position={[0.28, 0, 0.08]} rotation={[-0.08, 0.15, -0.82]}>
              <mesh position={[0, 0.2, -0.04]} rotation={[0.15, 0, 0]}>
                <capsuleGeometry args={[0.038, 0.4, 4, 8]} />
                <meshStandardMaterial color={palette.body} roughness={0.42} />
              </mesh>
              <mesh position={[0.06, 0.45, -0.06]} rotation={[0.1, 0, -0.5]}>
                <capsuleGeometry args={[0.036, 0.24, 4, 8]} />
                <meshStandardMaterial color={palette.body} roughness={0.42} />
              </mesh>
              <mesh position={[0.15, 0.56, -0.02]} rotation={[0, 0, 1.15]}>
                <capsuleGeometry args={[0.034, 0.16, 4, 8]} />
                <meshStandardMaterial color={palette.body} roughness={0.42} />
              </mesh>
            </group>
          )}

          {/* 강아지(ENFJ): 옆으로 살짝 삐죽 나와 흔드는 꼬리 */}
          {typeCode === "ENFJ" && (
            <mesh position={[0.38, 0.04, 0.12]} rotation={[-0.2, 0.12, -0.92]}>
              <capsuleGeometry args={[0.072, 0.28, 6, 10]} />
              <meshStandardMaterial color={palette.detail} roughness={0.45} />
            </mesh>
          )}

          {/* 토끼(INFP): 솜뭉치 꼬리 */}
          {typeCode === "INFP" && (
            <mesh position={[0, 0, -0.04]}>
              <sphereGeometry args={[0.17, 12, 10]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.55} />
            </mesh>
          )}

          {/* 곰(ISFJ), 사슴(INFJ), 판다(ISFP), 양(ESFJ): 작고 둥근 꼬리 */}
          {(typeCode === "ISFJ" ||
            typeCode === "INFJ" ||
            typeCode === "ISFP" ||
            typeCode === "ESFJ") && (
            <mesh position={[0, 0, -0.02]}>
              <sphereGeometry args={[0.12, 12, 10]} />
              <meshStandardMaterial
                color={typeCode === "ISFP" ? palette.detail : palette.accent}
                roughness={0.45}
              />
            </mesh>
          )}

          {/* 부엉이(INTJ): 옆으로 살짝 보이는 줄무늬 부채 꼬리 깃털 */}
          {typeCode === "INTJ" && (
            <group position={[-0.36, -0.05, 0.16]} rotation={[-0.22, -0.22, 0.88]}>
              <mesh position={[-0.04, 0.12, -0.04]} rotation={[0, 0, 0.18]} scale={[0.92, 1, 0.4]}>
                <capsuleGeometry args={[0.072, 0.24, 6, 10]} />
                <meshStandardMaterial color="#65496E" roughness={0.45} />
              </mesh>
              <mesh position={[0.05, 0.1, -0.05]} rotation={[0, 0, -0.14]} scale={[0.92, 1, 0.4]}>
                <capsuleGeometry args={[0.072, 0.24, 6, 10]} />
                <meshStandardMaterial color="#65496E" roughness={0.45} />
              </mesh>
              {/* 연보라빛 줄무늬 띠 */}
              <mesh position={[0, 0.11, -0.035]} scale={[1.15, 0.48, 0.48]}>
                <sphereGeometry args={[0.092, 10, 8]} />
                <meshStandardMaterial color="#C8B9E0" roughness={0.45} />
              </mesh>
            </group>
          )}

          {/* 앵무새(ESFP): 꼬리 깃털 */}
          {typeCode === "ESFP" && (
            <mesh position={[0, -0.05, -0.08]} rotation={[-0.95, 0, 0]} scale={[1.3, 1, 0.4]}>
              <capsuleGeometry args={[0.09, 0.2, 6, 10]} />
              <meshStandardMaterial color={palette.detail} roughness={0.42} />
            </mesh>
          )}
        </group>
      </group>

      {/* ======================== 3. 공통 팔(또는 날개) + 다리 ======================== */}
      {isBird ? (
        // 부엉이(INTJ), 펭귄(ESTJ), 앵무새(ESFP): 날개 / 지느러미
        <>
          <mesh
            ref={leftWingRef}
            position={[-0.46, -0.28, 0.04]}
            rotation={[0.12, 0, 0.55]}
            scale={[0.55, 1.15, 0.95]}
          >
            <capsuleGeometry args={[0.14, 0.24, 6, 12]} />
            <meshStandardMaterial
              color={typeCode === "ESFP" ? palette.detail : limbColor}
              roughness={0.42}
            />
          </mesh>
          <mesh
            ref={rightWingRef}
            position={[0.46, -0.28, 0.04]}
            rotation={[0.12, 0, -0.55]}
            scale={[0.55, 1.15, 0.95]}
          >
            <capsuleGeometry args={[0.14, 0.24, 6, 12]} />
            <meshStandardMaterial
              color={typeCode === "ESFP" ? palette.detail : limbColor}
              roughness={0.42}
            />
          </mesh>
        </>
      ) : (
        // 포유류 및 거북이: 짧은 팔 2개
        <>
          <mesh position={[-0.44, -0.26, 0.08]} rotation={[0.22, 0, 0.62]}>
            <capsuleGeometry args={[0.12, 0.2, 6, 12]} />
            <meshStandardMaterial color={limbColor} roughness={0.42} metalness={0.02} />
          </mesh>
          <mesh position={[0.44, -0.26, 0.08]} rotation={[0.22, 0, -0.62]}>
            <capsuleGeometry args={[0.12, 0.2, 6, 12]} />
            <meshStandardMaterial color={limbColor} roughness={0.42} metalness={0.02} />
          </mesh>
        </>
      )}

      {/* 짧은 다리 2개 */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.22, -0.8, 0.05]}
          rotation={[0.12, 0, -side * 0.06]}
        >
          <capsuleGeometry args={[0.145, 0.16, 6, 12]} />
          <meshStandardMaterial
            color={isBird ? "#F5AA3B" : limbColor}
            roughness={0.42}
            metalness={0.02}
          />
        </mesh>
      ))}
    </group>
  );
}
