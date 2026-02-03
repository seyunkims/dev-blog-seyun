// src/lib/firebase.ts

/**
 * Firebase 초기화 및 서비스 인스턴스 내보내기
 * 
 * 이 파일에서 Firebase 앱을 초기화하고,
 * 앱 전체에서 사용할 Firebase 서비스 인스턴스를 export합니다.
 * 
 * 📚 공식 문서: https://firebase.google.com/docs/web/setup
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase 설정 객체
 * 
 * 환경 변수에서 값을 가져옵니다.
 * import.meta.env는 Vite에서 환경 변수에 접근하는 방식입니다.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Firebase 앱 초기화
 * 
 * initializeApp()은 Firebase SDK를 초기화합니다.
 * 앱에서 단 한 번만 호출되어야 합니다.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication 인스턴스
 * 
 * 사용자 인증 관련 기능을 제공합니다.
 * - 회원가입, 로그인, 로그아웃
 * - 소셜 로그인 (Google 등)
 * - 인증 상태 감지
 * 
 * 📚 Auth 문서: https://firebase.google.com/docs/auth/web/start
 */
export const auth = getAuth(app);

/**
 * Cloud Firestore 인스턴스
 * 
 * NoSQL 데이터베이스 기능을 제공합니다.
 * - 문서 생성, 읽기, 수정, 삭제 (CRUD)
 * - 실시간 데이터 동기화
 * - 쿼리 및 필터링
 * 
 * 📚 Firestore 문서: https://firebase.google.com/docs/firestore/quickstart
 */
export const db = getFirestore(app);

/**
 * Firebase 앱 인스턴스 내보내기 (필요시 사용)
 */
export default app;