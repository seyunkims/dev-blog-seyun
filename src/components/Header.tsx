// src/components/Header.tsx

/**
 * 헤더 컴포넌트
 *
 * props 대신 Zustand 스토어에서 직접 user 정보를 가져옵니다.
 * 이제 어디서든 useAuthStore()로 인증 상태에 접근할 수 있습니다!
 */

import { Link } from "react-router-dom";
import { logout } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

function Header() {
    // Zustand 스토어에서 user 가져오기
    const user = useAuthStore((state) => state.user);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* 로고 */}
                    <Link to="/" className="text-xl font-bold text-gray-900">
                        📝 My Dev Blog
                    </Link>

                    {/* 네비게이션 & 인증 버튼 */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            // 로그인 상태
                            <>
                                <span className="text-sm text-gray-600">
                                    {user.displayName || user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900
                           transition-colors"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            // 비로그인 상태
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900
                           transition-colors"
                                >
                                    로그인
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700 transition-colors"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
