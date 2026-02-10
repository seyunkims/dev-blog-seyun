import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Loader2,
} from "lucide-react";
import { uploadImage, validateFile } from "@/lib/storage";
import { toast } from "sonner";

/** 최대 업로드 파일 개수 */
const MAX_FILES = 10;

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  userId: string;
  placeholder?: string;
  disabled?: boolean;
}

interface UploadState {
  isUploading: boolean;
  currentIndex: number;
  totalFiles: number;
  currentProgress: number;
}

function RichEditor({
  content,
  onChange,
  userId,
  placeholder = "내용을 입력하세요...",
  disabled = false,
}: RichEditorProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    currentIndex: 0,
    totalFiles: 0,
    currentProgress: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Link는 별도로 추가하므로 비활성화
        link: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  /**
   * 여러 파일 유효성 검사
   */
  const validateFiles = useCallback((files: File[]): File[] => {
    if (files.length > MAX_FILES) {
      toast.error(`한 번에 ${MAX_FILES}개까지만 업로드할 수 있습니다.`);
      return [];
    }

    const validFiles: File[] = [];
    for (const file of files) {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        toast.error(`${file.name}: ${validation.error}`);
      }
    }

    return validFiles;
  }, []);

  /**
   * 다중 이미지 업로드
   */
  const handleMultipleImageUpload = useCallback(
    async (files: File[]) => {
      if (!editor) return;

      const validFiles = validateFiles(files);
      if (validFiles.length === 0) return;

      setUploadState({
        isUploading: true,
        currentIndex: 0,
        totalFiles: validFiles.length,
        currentProgress: 0,
      });

      let successCount = 0;

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];

        setUploadState((prev) => ({
          ...prev,
          currentIndex: i + 1,
          currentProgress: 0,
        }));

        try {
          const attachment = await uploadImage(file, userId, (progress) => {
            setUploadState((prev) => ({
              ...prev,
              currentProgress: progress,
            }));
          });

          // insertContent를 사용하여 커서가 이미지 뒤로 이동하도록 함
          editor
            .chain()
            .focus()
            .insertContent([
              {
                type: "image",
                attrs: { src: attachment.url, alt: attachment.name },
              },
              { type: "paragraph" }, // 이미지 후 새 줄 추가
            ])
            .run();

          successCount++;
        } catch (error) {
          toast.error(
            `${file.name}: ${
              error instanceof Error ? error.message : "업로드 실패"
            }`,
          );
        }
      }

      setUploadState({
        isUploading: false,
        currentIndex: 0,
        totalFiles: 0,
        currentProgress: 0,
      });

      if (successCount > 0) {
        toast.success(
          successCount === 1
            ? "이미지가 업로드되었습니다."
            : `${successCount}개 이미지가 업로드되었습니다.`,
        );
      }
    },
    [editor, userId, validateFiles],
  );

  /**
   * 파일 선택 핸들러
   */
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleMultipleImageUpload(Array.from(files));
      }
      e.target.value = "";
    },
    [handleMultipleImageUpload],
  );

  /**
   * 드래그앤드롭 핸들러
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (files.length > 0) {
        handleMultipleImageUpload(files);
      }
    },
    [handleMultipleImageUpload],
  );

  /**
   * 붙여넣기 핸들러
   */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      const imageFiles: File[] = [];

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        handleMultipleImageUpload(imageFiles);
      }
    },
    [handleMultipleImageUpload],
  );

  /**
   * 링크 추가
   */
  const addLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL을 입력하세요:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const { isUploading, currentIndex, totalFiles, currentProgress } =
    uploadState;

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* 툴바 */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        {/* 헤딩 */}
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={disabled}
          title="제목 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={disabled}
          title="제목 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={disabled}
          title="제목 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* 텍스트 스타일 */}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          title="굵게"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          title="기울임"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled}
          title="취소선"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("code") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={disabled}
          title="인라인 코드"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* 리스트 */}
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          title="글머리 기호"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          title="번호 매기기"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          title="인용"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* 링크 & 이미지 */}
        <Button
          type="button"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          size="sm"
          onClick={addLink}
          disabled={disabled}
          title="링크"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          title="이미지 업로드 (최대 10개)"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* 실행 취소/다시 실행 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          title="실행 취소"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          title="다시 실행"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* 업로드 진행률 */}
      {isUploading && (
        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950 border-b">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>
              이미지 업로드 중... ({currentIndex}/{totalFiles}){" "}
              {currentProgress}%
            </span>
          </div>
          <div className="mt-1 h-1 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 에디터 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-75 focus:outline-none [&_.ProseMirror]:min-h-70 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
        />
      </div>

      {/* 숨겨진 파일 입력 (다중 선택 가능) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

export default RichEditor;
