<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 희희 MBTI 프로젝트 작업 규칙

## 서비스 소개
- **서비스 이름**: 희희 MBTI
- **핵심 기능**: 25개 질문에 답하면 16가지 성격 유형 중 하나를 알려주는 검사 서비스
- **캐릭터 요소**: 각 성격 유형마다 3D 동물 캐릭터 제공
- **회원 기능**: 회원은 검사 결과를 저장하고 마이페이지에서 다시 조회 가능

## 기술 규칙
- **기본 스택**: Next.js(App Router) + TypeScript + Tailwind CSS
- **추가 예정 패키지**: 3D 캐릭터는 React Three Fiber, 데이터베이스와 로그인은 Supabase로 구현할 예정이며, 사용자가 요청하기 전에는 미리 설치하지 않는다.
- **언어**: 화면에 표시되는 모든 텍스트는 한국어로 작성한다.
- **반응형 기준**: 모바일 퍼스트(가로 `375px` 기준)로 먼저 보기 좋게 설계하고 구현한다.

## 작업 방식
- **작업 범위 준수**: 사용자가 요청한 범위만 작업한다. 요청하지 않은 기능이나 페이지는 임의로 만들지 않는다.
- **코드 주석**: 초보자도 이해할 수 있도록 코드에 친절한 한국어 주석을 작성한다.
- **빌드 검증**: 코드를 수정한 작업을 마친 뒤에는 `npm run build`를 실행해 오류가 없는지 확인한다.
- **화면 및 동작 검증**: 화면을 변경한 작업을 마친 뒤에는 개발 서버가 실행 중인지 확인하고, 내장 브라우저로 변경된 페이지를 열어 직접 클릭·조작해 본 뒤 화면 캡처를 보여준다.
- **결과 보고 형식**: 작업 완료 후 마지막에는 **"바뀐 점"**과 **"사용자가 브라우저에서 확인할 방법"**을 짧고 명확하게 안내한다.
