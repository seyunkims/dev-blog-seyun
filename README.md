# 📝 My Dev Blog

개발자들을 위한 기술 블로그 플랫폼입니다.

[![Deploy with Vercel](https://vercel.com/button)](https://dev-blog-seyun.web.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🌐 Demo

**Live Demo**: [https://dev-blog-seyun.web.app/](https://dev-blog-seyun.web.app/)

## 📸 Screenshots

| 홈 (라이트) | 홈 (다크) |
|------------|----------|
| ![Home Light](screenshots/home-light.png) | ![Home Dark](screenshots/home-dark.png) |

| 글쓰기 | 로그인 |
|--------|--------|
| ![Write](screenshots/write.png) | ![Login](screenshots/login.png) |

## ✨ Features

### 사용자 인증
- ✅ 이메일/비밀번호 회원가입 및 로그인
- ✅ Google 소셜 로그인
- ✅ 로그인 상태 유지

### 게시글 관리
- ✅ 게시글 작성, 수정, 삭제 (CRUD)
- ✅ 카테고리별 필터링
- ✅ 무한 스크롤 페이지네이션

### UI/UX
- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ 다크모드 지원
- ✅ 토스트 알림
- ✅ 스켈레톤 로딩

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI 라이브러리 |
| TypeScript | 타입 안정성 |
| Vite | 빌드 도구 |
| React Router | 라우팅 |
| TanStack Query | 서버 상태 관리 |
| Zustand | 클라이언트 상태 관리 |
| Tailwind CSS | 스타일링 |
| shadcn/ui | UI 컴포넌트 |

### Backend
| Technology | Purpose |
|------------|---------|
| Firebase Auth | 사용자 인증 |
| Cloud Firestore | NoSQL 데이터베이스 |

### DevOps
| Technology | Purpose |
|------------|---------|
|  firebase hosting | 호스팅 & 배포 |
| GitHub Actions | CI/CD |

## 📁 Project Structure
```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/          # 공통 (Loading, Error, etc.)
│   ├── layout/          # 레이아웃 (Header, Footer)
│   ├── post/            # 게시글 관련
│   └── ui/              # shadcn/ui 컴포넌트
├── hooks/               # 커스텀 훅
│   ├── mutations/       # useMutation 훅
│   └── queries/         # useQuery 훅
├── lib/                 # 외부 라이브러리 설정
├── pages/               # 페이지 컴포넌트
├── store/               # Zustand 스토어
├── types/               # TypeScript 타입 정의
└── utils/               # 유틸리티 함수
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase 프로젝트

### Installation

1. **저장소 클론**
```bash
git clone https://github.com/seyunkims/dev-blog-seyun.git
cd dev-blog-seyun
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp .env.example .env
```

`.env` 파일을 열고 Firebase 설정값을 입력하세요:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **브라우저에서 확인**
```
http://localhost:5173
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint 검사 |
| `npm run type-check` | TypeScript 타입 검사 |

## 🔐 Firebase Setup

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Authentication 활성화 (이메일/비밀번호, Google)
3. Firestore Database 생성
4. 보안 규칙 설정 (아래 참고)

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.authorId == request.auth.uid;
      allow update, delete: if request.auth != null
                            && resource.data.authorId == request.auth.uid;
    }
  }
}
```

## 🎯 Future Improvements

- [ ] 댓글 기능
- [ ] 좋아요/북마크
- [ ] 이미지 업로드 (Firebase Storage)
- [ ] 마크다운 에디터
- [ ] 검색 기능
- [ ] 사용자 프로필 페이지
- [ ] 팔로우/팔로잉

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@seyunkims](https://github.com/seyunkims)
- Email: rtd0203@gmail.com

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/)