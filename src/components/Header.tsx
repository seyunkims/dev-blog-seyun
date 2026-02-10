import { Link } from "react-router-dom";
import { logout } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import { ROUTES, getProfilePath } from "@/constants";
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
          <Link to={ROUTES.HOME} className="text-xl font-bold">
            📝 My Dev Blog
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={getProfilePath(user.uid)}
                  className="text-sm hover:underline"
                >
                  {user.displayName || user.email}
                </Link>
                <button onClick={handleLogout} className="btn-ghost">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="btn-ghost">
                  로그인
                </Link>
                <Link to={ROUTES.SIGNUP} className="btn-primary">
                  회원가입
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
