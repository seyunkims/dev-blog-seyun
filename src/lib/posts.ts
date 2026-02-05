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
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Post, PostInput, PostSummary, User } from '@/types';

const POSTS_COLLECTION = 'posts';

/**
* Firestore 문서를 Post 타입으로 변환
*/
const formatPost = (docSnapshot: QueryDocumentSnapshot): Post => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    // Firestore Timestamp를 JS Date와 호환되게 처리하려면 추가 변환이 필요할 수 있음
    // 여기서는 data에 이미 Timestamp가 들어있다고 가정
  } as Post;
};

/**
* 모든 게시글 조회 (최신순)
*/
export async function getPosts(): Promise<PostSummary[]> {
  // Day 1: 단순 목록 조회 (내용 제외)
  const q = query(
    collection(db, POSTS_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
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

  if (docSnap.exists()) {
    return formatPost(docSnap);
  } else {
    return null;
  }
}

/**
* 게시글 작성
*/
export async function createPost(postInput: PostInput, user: User): Promise<string> {
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

  const docRef = await addDoc(collection(db, POSTS_COLLECTION), newPost);
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
