# CS-Xit

CS-Xit은 고객 문의 응대 흐름을 하나의 Next.js 앱으로 통합한 프로젝트입니다.

현재 실행 기준 앱은 `dashboard` 폴더입니다.  
기존 `onboarding`, `tickets` 폴더는 참고용 원본으로 남아 있고, 실제 통합 화면은 `dashboard` 안에서 동작합니다.

## 현재 페이지 흐름

1. `/`
온보딩 화면

2. `/dashboard`
문의 현황 대시보드

3. `/tickets/[id]`
대시보드의 문의 항목을 클릭했을 때 이동하는 티켓 상세 화면

## 실행 방법

프로젝트 루트에서 아래 순서로 실행합니다.

```bash
cd dashboard
npm install
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```

포트가 이미 사용 중이면:

```bash
npm run dev -- --port 3001
```

## 빌드

```bash
cd dashboard
npm run build
```

## 주요 폴더

- `dashboard/app`
  Next.js App Router 페이지
- `dashboard/components`
  온보딩, 대시보드, 티켓 UI 컴포넌트
- `dashboard/lib/inquiries.ts`
  문의 목록 및 티켓 상세에 사용하는 공용 목업 데이터
- `onboarding`
  분리되어 있던 기존 온보딩 앱 원본
- `tickets`
  분리되어 있던 기존 티켓 앱 원본

## 팀원과 공유하는 방법

이 프로젝트는 보통 Git 저장소로 공유하는 방식이 가장 깔끔합니다.

팀원은 저장소를 받은 뒤 아래만 실행하면 됩니다.

```bash
cd dashboard
npm install
npm run dev
```

공유할 때는 `node_modules`는 포함하지 않고 소스 코드만 전달하면 됩니다.

## 참고

- 통합 앱의 시작 페이지는 `dashboard/app/page.tsx`입니다.
- 온보딩 완료 버튼은 `/dashboard`로 이동합니다.
- 대시보드의 문의 테이블에서 항목을 클릭하면 `/tickets/[id]`로 이동합니다.
