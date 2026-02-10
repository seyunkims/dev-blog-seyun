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
    limit,
    where,
    Timestamp,
    startAfter,
    onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Post, PostInput, PostSummary, User, Category } from "@/types";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { extractFirstImageUrl } from "@/utils/formatters"; // 추가

const postsCollection = collection(db, "posts");

export async function createPost(
    input: PostInput,
    user: User,
): Promise<string> {
    const now = Timestamp.now();
    const thumbnailUrl = extractFirstImageUrl(input.content); // 썸네일 URL 추출

    const postData = {
        title: input.title,
        content: input.content,
        category: input.category,
        authorId: user.uid,
        authorEmail: user.email,
        authorDisplayName: user.displayName,
        createdAt: now,
        updatedAt: now,
        ...(thumbnailUrl && { thumbnailUrl }), // 썸네일 URL이 있을 때만 추가
        likeCount: 0,
    };

    const docRef = await addDoc(postsCollection, postData);
    return docRef.id;
}

export async function getPosts(limitCount: number = 5): Promise<PostSummary[]> {
    const q = query(
        postsCollection,
        orderBy("createdAt", "desc"),
        limit(limitCount),
        // where('category', '==', 'react')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            category: data.category,
            authorId: data.authorId,
            authorEmail: data.authorEmail,
            authorDisplayName: data.authorDisplayName,
            createdAt: data.createdAt,
            thumbnailUrl: data.thumbnailUrl,
            likeCount: data.likeCount ?? 0,
        };
    });
}

export async function getPost(postId: string): Promise<Post | null> {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        likeCount: data.likeCount ?? 0,
    } as Post;
}

export async function updatePost(
    postId: string,
    input: PostInput,
): Promise<void> {
    const docRef = doc(db, "posts", postId);
    const thumbnailUrl = extractFirstImageUrl(input.content); // 썸네일 URL 추출

    await updateDoc(docRef, {
        title: input.title,
        content: input.content,
        category: input.category,
        updatedAt: Timestamp.now(),
        thumbnailUrl: thumbnailUrl || null, // 썸네일 URL 업데이트 (없으면 null로 설정)
    });
}

export async function deletePost(postId: string): Promise<void> {
    const docRef = doc(db, "posts", postId);
    await deleteDoc(docRef);
}

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
            authorId: data.authorId,
            authorEmail: data.authorEmail,
            authorDisplayName: data.authorDisplayName,
            createdAt: data.createdAt,
            thumbnailUrl: data.thumbnailUrl,
            likeCount: data.likeCount ?? 0,
        };
    });
}

export interface GetPostsOptions {
    category?: Category | null;
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}

export interface GetPostsResult {
    posts: PostSummary[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
}

export async function getPostsWithOptions(
    options: GetPostsOptions = {},
): Promise<GetPostsResult> {
    const { category = null, limitCount = 5, lastDoc = null } = options;
    const constraints = [];

    if (category) {
        constraints.push(where("category", "==", category));
    }

    constraints.push(orderBy("createdAt", "desc"));

    if (lastDoc) {
        constraints.push(startAfter(lastDoc));
    }

    constraints.push(limit(limitCount + 1));
    const q = query(postsCollection, ...constraints);
    const snapshot = await getDocs(q);
    const hasMore = snapshot.docs.length > limitCount;
    const docs = hasMore ? snapshot.docs.slice(0, limitCount) : snapshot.docs;

    const posts = docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            category: data.category,
            authorId: data.authorId,
            authorEmail: data.authorEmail,
            authorDisplayName: data.authorDisplayName,
            createdAt: data.createdAt,
            thumbnailUrl: data.thumbnailUrl,
            likeCount: data.likeCount ?? 0,
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
    options: { category?: Category | null; limitCount?: number } = {},
    onError?: (error: Error) => void,
): () => void {
    const { category = null, limitCount = 20 } = options;

    const constraints = [];

    if (category) {
        constraints.push(where("category", "==", category));
    }

    constraints.push(orderBy("createdAt", "desc"));
    constraints.push(limit(limitCount));

    const q = query(postsCollection, ...constraints);

    return onSnapshot(
        q,
        (snapshot) => {
            const posts = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    category: data.category,
                    authorId: data.authorId,
                    authorEmail: data.authorEmail,
                    authorDisplayName: data.authorDisplayName,
                    createdAt: data.createdAt,
                    thumbnailUrl: data.thumbnailUrl,
                    likeCount: data.likeCount ?? 0,
                };
            });

            callback(posts);
        },
        (error) => {
            if (onError) {
                onError(error);
            }
        },
    );
}
