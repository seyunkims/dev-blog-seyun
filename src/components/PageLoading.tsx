import { Spinner } from "./ui/spinner";

interface PageLoadingProps {
  message?: string;
}

function PageLoading({ message = "로딩 중..." }: PageLoadingProps) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <Spinner className="size-8" />
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
}

export default PageLoading;
