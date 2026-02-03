# shadcn/ui 설치 가이드

## 환경

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- pnpm 패키지 매니저

## 설치 순서

### 1. shadcn/ui CLI 실행

```bash
pnpm dlx shadcn@latest init
```

### 2. 초기화 설정 선택

| 질문          | 선택             |
| ------------- | ---------------- |
| Style         | `new-york`       |
| Base color    | 원하는 색상 선택 |
| CSS variables | `yes`            |

### 3. 컴포넌트 추가

```bash
# 개별 추가
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card

# 여러 개 한번에 추가
pnpm dlx shadcn@latest add button card input dialog textarea label select alert-dialog sonner skeleton dropdown-menu badge

```

---

## 설치 중 발생한 오류 및 해결

### 오류 1: npm ECOMPROMISED / Lock compromised

**증상:**

```
npm error code ECOMPROMISED
npm error Lock compromised
```

**원인:** npm 패키지 서명 검증 문제

**해결 방법:**

```bash
# 방법 1: pnpm 사용 (권장)
npm install -g pnpm
pnpm dlx shadcn@latest init

# 방법 2: npm 서명 검증 비활성화
npm config set verify-signatures false
npx shadcn@latest init
```

---

### 오류 2: No import alias found in tsconfig.json

**증상:**

```
✗ Validating import alias.
No import alias found in your tsconfig.json file.
```

**원인:** tsconfig.json에 path alias 설정 누락

**해결 방법:**

`tsconfig.json` 수정:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    },
    "files": [],
    "references": [
        { "path": "./tsconfig.app.json" },
        { "path": "./tsconfig.node.json" }
    ]
}
```

`vite.config.ts` 확인 (alias 설정 필요):

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
```

---

### 오류 3: CSS가 잘못된 파일에 생성됨

**증상:** shadcn이 `index copy.css`에 CSS를 생성하고, 기존 `index.css`는 그대로 유지됨

**해결 방법:**

1. `index copy.css`의 shadcn 스타일을 `index.css`에 병합
2. 기존 커스텀 스타일 유지
3. `index copy.css` 삭제

```bash
rm "src/index copy.css"
```

---

## 설치 후 생성되는 파일

```
src/
├── components/
│   └── ui/          # shadcn/ui 컴포넌트
├── utils/
│   └── shadcn_utils.ts  # cn() 유틸리티 함수 (lib/utils.ts에서 이동)
└── index.css        # CSS 변수 및 테마 설정

components.json      # shadcn/ui 설정 파일
```

> **참고:** 기본 생성 경로는 `src/lib/utils.ts`이지만, 프로젝트 구조에 맞게 `src/utils/shadcn_utils.ts`로 이동함. `components.json`의 `aliases.utils` 경로도 함께 수정 필요.

---

## 설치된 의존성

```json
{
    "dependencies": {
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "lucide-react": "^0.563.0",
        "tailwind-merge": "^3.4.0"
    },
    "devDependencies": {
        "tw-animate-css": "^1.4.0"
    }
}
```

---

## 참고 링크

- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [Vite 설치 가이드](https://ui.shadcn.com/docs/installation/vite)
