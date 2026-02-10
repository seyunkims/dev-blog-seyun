import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    uploadBytesResumable,
    type UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "./firebase";
import {
    ALLOWED_IMAGE_TYPES,
    MAX_FILE_SIZE,
    ERROR_MESSAGES,
    STORAGE_PATH_PREFIX,
} from "@/constants";

/**
 * 첨부파일 정보 타입
 */
export interface Attachment {
    /** 파일 이름 */
    name: string;
    /** 다운로드 URL */
    url: string;
    /** 파일 크기 (bytes) */
    size: number;
    /** MIME 타입 */
    type: string;
    /** Storage 경로 */
    path: string;
}

/**
 * 파일 유효성 검사
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: ERROR_MESSAGES.INVALID_FILE_TYPE,
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: ERROR_MESSAGES.FILE_TOO_LARGE,
        };
    }

    return { valid: true };
}

/**
 * 고유 파일명 생성
 */
function generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split(".").pop() || "";
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    return `${baseName}_${timestamp}_${randomStr}.${extension}`;
}

/**
 * 이미지 업로드 (진행률 콜백 포함)
 *
 * @param file 업로드할 파일
 * @param userId 사용자 ID (폴더 구분용)
 * @param onProgress 진행률 콜백 (0-100)
 * @returns 업로드된 파일 정보
 */
export async function uploadImage(
    file: File,
    userId: string,
    onProgress?: (progress: number) => void,
): Promise<Attachment> {
    // 유효성 검사
    const validation = validateFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    // 고유 파일명 생성
    const uniqueFileName = generateUniqueFileName(file.name);
    const storagePath = `${STORAGE_PATH_PREFIX}/${userId}/${uniqueFileName}`;
    const storageRef = ref(storage, storagePath);

    // 진행률 추적이 필요한 경우
    if (onProgress) {
        return new Promise((resolve, reject) => {
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot: UploadTaskSnapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress(Math.round(progress));
                },
                (error) => {
                    reject(
                        new Error(
                            `${ERROR_MESSAGES.UPLOAD_FAILED}: ${error.message}`,
                        ),
                    );
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(
                            uploadTask.snapshot.ref,
                        );
                        resolve({
                            name: file.name,
                            url: downloadURL,
                            size: file.size,
                            type: file.type,
                            path: storagePath,
                        });
                    } catch (error) {
                        reject(new Error(ERROR_MESSAGES.DOWNLOAD_URL_FAILED));
                        console.log(error);
                    }
                },
            );
        });
    }

    // 진행 추적 없이 단순 업로드
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return {
        name: file.name,
        url: downloadURL,
        size: file.size,
        type: file.type,
        path: storagePath,
    };
}

/**
 * 파일 삭제
 *
 * @param storagePath Storage 경로
 */
export async function deleteFile(storagePath: string): Promise<void> {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
}

/**
 * 여러 파일 삭제
 *
 * @param storagePaths Storage 경로 배열
 */
export async function deleteFiles(storagePaths: string[]): Promise<void> {
    await Promise.all(storagePaths.map((path) => deleteFile(path)));
}

/**
 * 프로필 이미지 업로드
 *
 * @param file 업로드할 이미지 파일
 * @param userId 사용자 ID
 * @returns 업로드된 이미지 다운로드 URL
 */
export async function uploadProfileImage(
    file: File,
    userId: string,
): Promise<string> {
    const validation = validateFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    const extension = file.name.split(".").pop() || "jpg";
    const storagePath = `profile-images/${userId}/avatar.${extension}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}
