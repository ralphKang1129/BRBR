# 배드민턴 코트 예약 시스템

배드민턴 코트를 쉽고 빠르게 예약할 수 있는 웹 애플리케이션입니다. 

## 주요 기능

- 코트 검색 및 필터링 (지역, 가격대별)
- 구글 캘린더 스타일의 예약 캘린더
- 예약 관리 (확정, 대기중, 취소)
- 반응형 디자인 (모바일, 태블릿, 데스크톱)

## 기술 스택

- **Frontend**: Next.js, TypeScript, Tailwind CSS, React Hooks
- **Dependencies**: date-fns, Heroicons
- **Styling**: Tailwind CSS

## 시작하기

다음 명령어를 실행하여 개발 서버를 시작합니다:

```bash
npm install    # 의존성 설치
npm run dev    # 개발 서버 실행
```

브라우저에서 http://localhost:3000 으로 접속하면 애플리케이션을 확인할 수 있습니다.

## 프로젝트 구조

```
/src
  /app                   # Next.js 앱 라우터
    /courts              # 코트 목록 페이지
      /[id]              # 코트 상세 페이지
        /reservation     # 예약 페이지
    /my-bookings         # 내 예약 관리 페이지
  /types                 # 타입 정의 및 더미 데이터
```

## 개발자 정보

이 프로젝트는 배드민턴 애호가들을 위해 개발되었습니다.

## 라이센스

MIT License
# BRBR
