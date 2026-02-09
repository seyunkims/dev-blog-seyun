import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({
  title = "오류가 발생했습니다",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <Card className="p-8 text-center">
      <CardContent className="p-0">
        <div className="text-4xl mb-4">😕</div>
        <h3 className="text-lg font-semibold text-default mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            다시 시도
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default ErrorMessage;
