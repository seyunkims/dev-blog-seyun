/// <reference types="vite/client" />

/**
 * Vite 환경 변수 타입 정의
 */
interface ImportMetaEnv {
  /** Firebase API Key */
  readonly VITE_FIREBASE_API_KEY: string;
  
  /** Firebase Auth Domain */
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  
  /** Firebase Project ID */
  readonly VITE_FIREBASE_PROJECT_ID: string;
  
  /** Firebase Storage Bucket */
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  
  /** Firebase Messaging Sender ID */
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  
  /** Firebase App ID */
  readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}