import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-10 pb-8 space-y-6">
          <div className="flex justify-center">
            <AlertTriangle className="size-16 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-lg text-muted-foreground">잘못된 접근입니다.</p>
          </div>
          <Button asChild>
            <Link to="/">홈으로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotFoundPage;
