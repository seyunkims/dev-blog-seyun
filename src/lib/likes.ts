import {
  doc,
  getDoc,
  runTransaction,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "@/types";

/**
 * 좋아요 문서 ID 생성 (postId_userId)
 */
function getLikeDocId(postId: string, userId: string): string {
  return `${postId}_${userId}`;
}

/**
 * 좋아요 토글 (트랜잭션으로 원자적 처리)
 * - 좋아요가 없으면 추가 + likeCount 증가
 * - 좋아요가 있으면 삭제 + likeCount 감소
 */
export async function toggleLike(
  postId: string,
  user: User,
): Promise<{ liked: boolean }> {
  const likeDocId = getLikeDocId(postId, user.uid);
  const likeRef = doc(db, "likes", likeDocId);
  const postRef = doc(db, "posts", postId);

  return runTransaction(db, async (transaction) => {
    const likeSnap = await transaction.get(likeRef);

    if (likeSnap.exists()) {
      // 좋아요 취소
      transaction.delete(likeRef);
      transaction.update(postRef, { likeCount: increment(-1) });
      return { liked: false };
    } else {
      // 좋아요 추가
      transaction.set(likeRef, {
        postId,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });
      transaction.update(postRef, { likeCount: increment(1) });
      return { liked: true };
    }
  });
}

/**
 * 좋아요 여부 확인
 */
export async function getLikeStatus(
  postId: string,
  userId: string,
): Promise<boolean> {
  const likeDocId = getLikeDocId(postId, userId);
  const likeRef = doc(db, "likes", likeDocId);
  const likeSnap = await getDoc(likeRef);
  return likeSnap.exists();
}
