/**
 * 게시글 작성/수정 폼 컴포넌트
 *
 * Day 1 컴포넌트 구조도: PostWritePage > PostForm
 * Day 1 기능명세서: FUNC-002 (게시글 작성)
 *
 * 재사용 가능한 폼:
 * - 새 글 작성 시: initialData 없음
 * - 글 수정 시: initialData 있음
 */

import { useState } from "react";
import type { PostInput, Category } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface PostFormProps {
    /** 수정 시 기존 데이터 */
    initialData?: PostInput;
    /** 제출 핸들러 */
    onSubmit: (data: PostInput) => Promise<void>;
    /** 제출 버튼 텍스트 */
    submitLabel?: string;
    /** 로딩 상태 */
    isLoading?: boolean;
}

function PostForm({
    initialData,
    onSubmit,
    submitLabel = "발행하기",
    isLoading = false,
}: PostFormProps) {
    // 폼 상태
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [category, setCategory] = useState<Category | null>(
        initialData?.category || null,
    );
    const [error, setError] = useState<string | null>(null);

    /**
     * 폼 제출 핸들러
     *
     * Day 1 기능명세서 FUNC-002 기본 흐름:
     * 5. 시스템이 입력값 유효성을 검사한다
     * 6. 시스템이 Firestore에 게시글을 저장한다
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 유효성 검사 (Day 1 기능명세서 입력 데이터 참고)
        if (!title.trim()) {
            setError("제목을 입력해주세요.");
            return;
        }

        if (title.length > 100) {
            setError("제목은 100자 이내로 입력해주세요.");
            return;
        }

        if (!content.trim()) {
            setError("내용을 입력해주세요.");
            return;
        }

        try {
            await onSubmit({
                title: title.trim(),
                content: content.trim(),
                category,
            });
        } catch (err) {
            setError("저장에 실패했습니다. 다시 시도해주세요.");
            console.error("PostForm handleSubmit error:", err);
        }
    };

    // 카테고리 목록 (Day 1 데이터 모델 참고)
    const categories: Category[] = [
        "javascript",
        "typescript",
        "react",
        "firebase",
        "etc",
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* 제목 입력 */}
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    제목
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="게시글 제목을 입력하세요"
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500 text-right">
                    {title.length}/100
                </p>
            </div>

            {/* 카테고리 선택 */}
            <div>
                <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    카테고리 (선택)
                </label>
                <select
                    id="category"
                    value={category || ""}
                    onChange={(e) =>
                        setCategory(
                            e.target.value
                                ? (e.target.value as Category)
                                : null,
                        )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">카테고리 선택</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {CATEGORY_LABELS[cat]}
                        </option>
                    ))}
                </select>
            </div>

            {/* 내용 입력 */}
            <div>
                <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    내용
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="게시글 내용을 입력하세요"
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   resize-y min-h-75"
                />
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:bg-blue-300 disabled:cursor-not-allowed
                   transition-colors"
                >
                    {isLoading ? "저장 중..." : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default PostForm;
