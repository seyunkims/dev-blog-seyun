// src/components/FirebaseStatus.tsx

/**
 * Firebase 연동 상태 확인 컴포넌트
 *
 * Firebase가 제대로 초기화되었는지 확인합니다.
 * 개발 중에만 사용하고, 배포 시에는 제거하거나 숨깁니다.
 */

import { useEffect, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import StatusItem from "./StatusItem";

interface ConnectionStatus {
    firebase: boolean;
    auth: boolean;
    firestore: boolean;
}

function FirebaseStatus() {
    const [status, setStatus] = useState<ConnectionStatus>({
        firebase: false,
        auth: false,
        firestore: false,
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                // Firebase App 확인 (객체 존재 여부)
                const firebaseOk = auth.app !== null;

                // Auth 서비스 확인 (객체 존재 여부)
                const authOk = auth !== null;

                // Firestore 실제 연결 확인 - 서버에 쿼리 시도
                let firestoreOk = false;
                try {
                    await getDocs(query(collection(db, "posts"), limit(1)));
                    firestoreOk = true;
                } catch (e) {
                    // 권한 오류(permission-denied)는 "연결은 됨"으로 간주
                    if (e instanceof Error && e.message.includes("permission")) {
                        firestoreOk = true;
                    }
                }

                setStatus({
                    firebase: firebaseOk,
                    auth: authOk,
                    firestore: firestoreOk,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            }
        };

        checkConnection();
    }, []);

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">
                    ❌ Firebase 연결 오류
                </h3>
                <p className="text-sm text-red-600">{error}</p>
                <p className="text-xs text-red-500 mt-2">
                    .env 파일의 Firebase 설정을 확인해주세요.
                </p>
            </div>
        );
    }

    const allConnected = status.firebase && status.auth && status.firestore;

    return (
        <div
            className={`p-4 rounded-lg border ${
                allConnected
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
            }`}
        >
            <h3
                className={`font-semibold mb-3 ${
                    allConnected ? "text-green-800" : "text-yellow-800"
                }`}
            >
                {allConnected
                    ? "✅ Firebase 연동 완료!"
                    : "⏳ Firebase 연동 확인 중..."}
            </h3>

            <div className="space-y-2">
                {/* 반복되서 컨포넌트로 구성했어요 */}
                {/* <div className="flex items-center gap-2">
                    <span
                        className={`w-3 h-3 rounded-full ${
                            isConnected ? "bg-green-500" : "bg-red-500"
                        }`}
                    />
                    <span className="text-sm">
                        {label}: {isConnected ? "연결됨" : "연결 안됨"}
                    </span>
                </div> */}
                <StatusItem
                    label="Firebase App"
                    isConnected={status.firebase}
                />
                <StatusItem label="Authentication" isConnected={status.auth} />
                <StatusItem label="Firestore" isConnected={status.firestore} />
            </div>

            {allConnected && (
                <p className="text-xs text-green-600 mt-3">
                    모든 Firebase 서비스가 정상적으로 연결되었습니다.
                </p>
            )}

            {/* 환경 변수 확인 (개발용) */}
            <details className="mt-4">
                <summary className="text-xs text-gray-500 cursor-pointer">
                    환경 변수 확인 (개발용)
                </summary>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                    <p>
                        Project ID:{" "}
                        {import.meta.env.VITE_FIREBASE_PROJECT_ID || "(없음)"}
                    </p>
                    <p>
                        Auth Domain:{" "}
                        {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "(없음)"}
                    </p>
                </div>
            </details>
        </div>
    );
}

export default FirebaseStatus;
