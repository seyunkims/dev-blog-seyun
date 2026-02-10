import { type SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, getAuthErrorMessage } from "@/lib/auth";
import { ROUTES, PASSWORD_MIN_LENGTH } from "@/constants";
import { isFirebaseError } from "@/utils/typeGuards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      toast.error(`비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`);
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      toast.success("회원가입이 완료되었습니다");
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      if (isFirebaseError(err)) {
        toast.error(getAuthErrorMessage(err.code));
      } else {
        toast.error("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg py-12 px-4">
        <CardHeader className="text-center">
          <Link to={ROUTES.HOME} className="text-3xl font-bold mb-4 block">
            📝 My Dev Blog
          </Link>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>계정을 만들어 블로그를 시작하세요</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`${PASSWORD_MIN_LENGTH}자 이상 입력하세요`}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
              <Input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "가입 중..." : "가입하기"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="text-primary hover:underline font-medium"
              >
                로그인
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default SignUpPage;
