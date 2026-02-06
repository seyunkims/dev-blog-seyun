// src/lib/posts.ts

/**
 * 게시글 관리 서비스
 *
 * Day 1 기능명세서: FUNC-002, FUNC-003
 * Day 1 데이터 모델: Post, PostInput
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  limit,
  where,
  startAfter,
  onSnapshot,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";

import { db } from "./firebase";
import type { Post, PostInput, PostSummary, User, Category } from "@/types";

const POSTS_COLLECTION = "posts";
const postsCollection = collection(db, POSTS_COLLECTION);

/**
 * Firestore 문서를 Post 타입으로 변환
 */
const formatPost = (docSnapshot: QueryDocumentSnapshot<DocumentData>): Post => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    // Firestore Timestamp를 JS Date로 변환하려면 추가 처리 필요할 수 있음
    // 여기서는 data에 이미 Timestamp가 들어있다고 가정
  } as Post;
};

/**
 * 모든 게시글 조회 (최신순)
 * Day 1: 단순 목록 조회 (내용 제외)
 */
export async function getPosts(): Promise<PostSummary[]> {
  const q = query(postsCollection, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      category: data.category,
      createdAt: data.createdAt,
      authorId: data.authorId,
      authorEmail: data.authorEmail,
      authorDisplayName: data.authorDisplayName,
      viewCount: data.viewCount,
      thumbnailUrl: data.thumbnailUrl,
    } as PostSummary;
  });
}

/**
 * 단일 게시글 조회
 */
export async function getPost(id: string): Promise<Post | null> {
  const docRef = doc(db, POSTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  // getDoc 결과는 QueryDocumentSnapshot이 아니라 DocumentSnapshot이라 타입이 달라서
  // 안전하게 data를 직접 조립하거나, formatPost를 확장해서 써도 됨.
  // 여기서는 기존 로직을 유지하면서 cast 처리
  return formatPost(docSnap as unknown as QueryDocumentSnapshot<DocumentData>);
}

/**
 * 게시글 작성
 */
export async function createPost(
  postInput: PostInput,
  user: User
): Promise<string> {
  const newPost = {
    ...postInput,
    authorId: user.uid,
    authorEmail: user.email,
    authorDisplayName: user.displayName || null,
    authorPhotoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    viewCount: 0,
    thumbnailUrl: null, // Day 1: 썸네일 미지원
  };

  const docRef = await addDoc(postsCollection, newPost);
  return docRef.id;
}

/**
 * 게시글 수정
 */
export async function updatePost(id: string, postInput: PostInput): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, id);

  await updateDoc(docRef, {
    ...postInput,
    updatedAt: serverTimestamp(),
  });
}

/**
 * 게시글 삭제
 */
export async function deletePost(id: string): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/* -------------------------------------------------------------------------- */
/* ✅ 추가 기능: 필터링 + 페이지네이션 지원 getPostsWithOptions                  */
/* -------------------------------------------------------------------------- */

/**
 * 게시글 목록 조회 (필터링 옵션 지원)
 *
 * Day 1 요구사항: POST-002, POST-006
 * - POST-002: 최신순 정렬
 * - POST-006: 카테고리별 필터링
 */
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

  // Firestore query 조건들
  const constraints: QueryConstraint[] = [];

  // 카테고리 필터 (Day 1 POST-006)
  if (category) {
    constraints.push(where("category", "==", category));
  }

  // 정렬 (Day 1 POST-002: 최신순)
  constraints.push(orderBy("createdAt", "desc"));

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
      // 필요하면 기존 getPosts처럼 authorId/viewCount/thumbnailUrl도 추가 가능
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
  options: { category?: Category | null; limitCount?: number } = {}
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
  });
}