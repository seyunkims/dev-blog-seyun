import { Link } from "react-router-dom";
import { logout } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/constants";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="header">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to={ROUTES.HOME} className="text-xl font-bold">
            📝 My Dev Blog
          </Link>

          {/* 네비게이션 & 인증 버튼 */}
          <div className="flex items-center gap-4">
            {user ? (
              // 로그인 상태
              <>
                <span className="text-sm">
                  {user.displayName || user.email}
                </span>
                <button onClick={handleLogout} className="btn-ghost">
                  로그아웃
                </button>
              </>
            ) : (
              // 비로그인 상태
              <>
                <Link to={ROUTES.LOGIN} className="btn-ghost">
                  로그인
                </Link>
                <Link to={ROUTES.SIGNUP} className="btn-primary">
                  회원가입
                </Link>
              </>
            )}
            {/* 테마 토글 */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
