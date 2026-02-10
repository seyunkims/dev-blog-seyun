/**
 * Firestore 게시글 서비스 함수 모음
 *
 * Day 1 API 명세서에서 정의한 게시글 관련 함수들을 구현합니다.
 * - POST-001: 게시글 작성 (createPost)
 * - POST-002: 게시글 목록 조회 (getPosts)
 * - POST-003: 게시글 상세 조회 (getPost)
 * - POST-004: 게시글 수정 (updatePost)
 * - POST-005: 게시글 삭제 (deletePost)
 *
 * 📚 공식 문서: https://firebase.google.com/docs/firestore/manage-data/add-data
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp,
    limit,
    where,
    startAfter,
    onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Post, PostInput, PostSummary, User, Category } from "../types";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

/**
 * 컬렉션 참조
 *
 * Firestore의 'posts' 컬렉션에 대한 참조입니다.
 * 모든 게시글 관련 작업은 이 컬렉션에서 이루어집니다.
 */
const postsCollection = collection(db, "posts");

/**
 * 게시글 작성
 *
 * Day 1 요구사항: POST-001
 * Day 1 기능명세서: FUNC-002 (게시글 작성)
 *
 * @param input - 게시글 입력 데이터 (title, content, category)
 * @param user - 현재 로그인한 사용자
 * @returns 생성된 게시글 ID
 */
export async function createPost(
    input: PostInput,
    user: User,
): Promise<string> {
    const now = Timestamp.now();

    // Day 1 기능명세서 FUNC-002 저장 데이터 구조 참고
    const postData = {
        title: input.title,
        content: input.content,
        category: input.category,
        authorId: user.uid,
        authorEmail: user.email,
        authorDisplayName: user.displayName,
        createdAt: now,
        updatedAt: now,
    };

    const docRef = await addDoc(postsCollection, postData);
    return docRef.id;
}

/**
 * 게시글 목록 조회
 *
 * Day 1 요구사항: POST-002
 * "시스템은 게시글 목록을 최신순으로 표시한다"
 *
 * @param limitCount - 조회할 게시글 수 (기본값: 20)
 * @returns 게시글 요약 목록
 */
export async function getPosts(
    limitCount: number = 20,
): Promise<PostSummary[]> {
    // 최신순 정렬 쿼리
    const q = query(
        postsCollection,
        orderBy("createdAt", "desc"),
        limit(limitCount),
        // where("category", "==", "react"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            category: data.category,
            authorEmail: data.authorEmail,
            authorDisplayName: data.authorDisplayName,
            createdAt: data.createdAt,
        };
    });
}

/**
 * 게시글 상세 조회
 *
 * Day 1 요구사항: POST-003
 * "사용자는 게시글 상세 내용을 조회할 수 있다"
 *
 * @param postId - 게시글 ID
 * @returns 게시글 전체 데이터 (없으면 null)
 */
export async function getPost(postId: string): Promise<Post | null> {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...docSnap.data(),
    } as Post;
}

/**
 * 게시글 수정
 *
 * Day 1 요구사항: POST-004
 * "작성자는 자신의 게시글을 수정할 수 있다"
 *
 * @param postId - 수정할 게시글 ID
 * @param input - 수정할 내용
 */
export async function updatePost(
    postId: string,
    input: PostInput,
): Promise<void> {
    const docRef = doc(db, "posts", postId);

    await updateDoc(docRef, {
        title: input.title,
        content: input.content,
        category: input.category,
        updatedAt: Timestamp.now(),
    });
}

/**
 * 게시글 삭제
 *
 * Day 1 요구사항: POST-005
 * "작성자는 자신의 게시글을 삭제할 수 있다"
 *
 * @param postId - 삭제할 게시글 ID
 */
export async function deletePost(postId: string): Promise<void> {
    const docRef = doc(db, "posts", postId);
    await deleteDoc(docRef);
}

/**
 * 카테고리별 게시글 조회
 *
 * Day 1 요구사항: POST-006 (선택)
 * "사용자는 게시글을 카테고리별로 필터링할 수 있다"
 *
 * @param category - 카테고리
 * @param limitCount - 조회할 게시글 수
 * @returns 해당 카테고리의 게시글 목록
 */
export async function getPostsByCategory(
    category: Category,
    limitCount: number = 20,
): Promise<PostSummary[]> {
    const q = query(
        postsCollection,
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(limitCount),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            category: data.category,
            authorEmail: data.authorEmail,
            authorDisplayName: data.authorDisplayName,
            createdAt: data.createdAt,
        };
    });
}

export interface GetPostsOptions {
  /** 카테고리 필터 (null이면 전체) */
  category?: Category | null;
  /** 조회할 개수 */
  limitCount?: number;
  /** 페이지네이션 커서 (이전 쿼리의 마지막 문서) */
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}

export interface GetPostsResult {
  posts: PostSummary[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export async function getPostsWithOptions(
  options: GetPostsOptions = {}
): Promise<GetPostsResult> {
  const { category = null, limitCount = 5, lastDoc = null } = options;

  // 쿼리 조건들을 배열로 구성
  const constraints = [];

  // 카테고리 필터 (Day 1 POST-006)
  if (category) {
    constraints.push(where('category', '==', category));
  }

  // 정렬 (Day 1 POST-002: 최신순)
  constraints.push(orderBy('createdAt', 'desc'));

  // 페이지네이션: 이전 페이지의 마지막 문서 이후부터
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  // 개수 제한 (+1로 다음 페이지 존재 여부 확인)
  constraints.push(limit(limitCount + 1));

  // 쿼리 실행
  const q = query(postsCollection, ...constraints);
  const snapshot = await getDocs(q);

  // hasMore 판단: limitCount + 1개를 요청했으므로
  const hasMore = snapshot.docs.length > limitCount;
  
  // 실제 반환할 문서들 (limitCount개만)
  const docs = hasMore ? snapshot.docs.slice(0, limitCount) : snapshot.docs;

  const posts = docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      category: data.category,
      authorEmail: data.authorEmail,
      authorDisplayName: data.authorDisplayName,
      createdAt: data.createdAt,
    };
  });

  return {
    posts,
    lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
    hasMore,
  };
}

export function subscribeToPostsRealtime(
  callback: (posts: PostSummary[]) => void,
  options: { category?: Category | null; limitCount?: number; } = {},
  onError?: (error: Error) => void
): () => void {
  const { category = null, limitCount = 20 } = options;

  const constraints = [];

  if (category) {
    constraints.push(where('category', '==', category));
  }

  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(limitCount));

  const q = query(postsCollection, ...constraints);

  // onSnapshot은 구독 해제 함수를 반환
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        category: data.category,
        authorEmail: data.authorEmail,
        authorDisplayName: data.authorDisplayName,
        createdAt: data.createdAt,
      };
    });

    callback(posts);
  }, onError);
}

/**
 * 단일 게시글 실시간 구독
 * 
 * @param postId - 게시글 ID
 * @param callback - 데이터 변경 시 호출될 함수
 * @returns 구독 해제 함수
 */
export function subscribeToPostRealtime(
  postId: string,
  callback: (post: Post | null) => void
): () => void {
  const docRef = doc(db, 'posts', postId);

  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({
        id: snapshot.id,
        ...snapshot.data(),
      } as Post);
    } else {
      callback(null);
    }
  });
}