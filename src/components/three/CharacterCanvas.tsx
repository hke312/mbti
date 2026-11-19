"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import AnimalCharacter from "@/components/three/AnimalCharacter";
import { MBTI_TYPES, type MbtiTypeCode } from "@/data/types";

/**
 * 3D 캐릭터를 실제로 그리는 WebGL 캔버스 컴포넌트입니다.
 * - 배경은 투명(alpha: true)으로 두어 부모 영역의 파스텔 배경이 비치도록 합니다.
 * - 외부 HDR 환경맵 없이 코드로 작성한 부드러운 조명과 바닥 그림자만 사용합니다.
 * - OrbitControls로 회전만 허용하고 확대/축소와 이동은 막아 두었습니다.
 */
export default function CharacterCanvas({
  typeCode = "ISFJ",
}: {
  typeCode?: MbtiTypeCode;
}) {
  const typeInfo = MBTI_TYPES[typeCode];

  return (
    <div
      role="img"
      aria-label={`${typeInfo.code} ${typeInfo.character.name} (${typeInfo.character.animal}) 3D 캐릭터. 드래그해서 돌리거나 눌러서 점프시킬 수 있어요.`}
      className="h-full w-full cursor-grab active:cursor-grabbing"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.2, 3.38], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        {/* 코드로 만든 부드러운 스튜디오 조명 (HDR 환경맵 미사용) */}
        <ambientLight intensity={0.85} color="#fff8f2" />
        <hemisphereLight args={["#ffffff", "#e5d4c5", 0.75]} />
        <directionalLight position={[3, 5, 4]} intensity={1.3} color="#fffaf5" />
        <directionalLight position={[-3, 2.5, -2]} intensity={0.45} color="#dfd3ff" />

        {/* 전달받은 유형 코드에 맞는 3D 동물 캐릭터 */}
        <AnimalCharacter typeCode={typeCode} />

        {/* 캐릭터 발아래의 부드러운 바닥 그림자 (캔버스당 1회만 구워 전환 시에도 버벅임 없음) */}
        <ContactShadows
          position={[0, -1.04, 0]}
          opacity={0.32}
          scale={4}
          blur={2.4}
          far={2.4}
          resolution={128}
          frames={1}
          color="#6b5244"
        />

        {/* 마우스 드래그 및 터치 스와이프로 회전만 가능하도록 설정 */}
        <OrbitControls
          target={[0, 0.14, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI * 0.22}
          maxPolarAngle={Math.PI * 0.64}
        />
      </Canvas>
    </div>
  );
}
