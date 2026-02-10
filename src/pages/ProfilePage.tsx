import { useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUserProfile } from "@/hooks/queries";
import { useUpdateProfile, useUpdatePassword } from "@/hooks/mutations";
import { uploadProfileImage } from "@/lib/storage";
import { PASSWORD_MIN_LENGTH } from "@/constants";
import { formatDateTime, getDisplayName } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/ErrorMessage";
import { toast } from "sonner";

function ProfilePage() {
    const { uid } = useParams<{ uid: string }>();
    const user = useAuthStore((state) => state.user);
    const { data: profile, isLoading, error, refetch } = useUserProfile(uid);
    const updateProfileMutation = useUpdateProfile();
    const updatePasswordMutation = useUpdatePassword();

    const isOwner = user?.uid === uid;
    const isGoogleUser = profile?.provider === "google";

    // 이름 수정
    const [isEditingName, setIsEditingName] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState("");

    // 비밀번호 변경
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    // 이미지 업로드
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditName = useCallback(() => {
        if (!profile) return;
        setNewDisplayName(profile.displayName || profile.email.split("@")[0]);
        setIsEditingName(true);
    }, [profile]);

    const handleSaveName = useCallback(() => {
        if (!uid || !newDisplayName.trim()) return;

        updateProfileMutation.mutate(
            { uid, displayName: newDisplayName.trim() },
            { onSuccess: () => setIsEditingName(false) },
        );
    }, [uid, newDisplayName, updateProfileMutation]);

    const handleSavePassword = useCallback(() => {
        if (!currentPassword || !newPassword || !newPasswordConfirm) return;

        if (newPassword.length < PASSWORD_MIN_LENGTH) {
            toast.error(
                `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
            );
            return;
        }

        if (newPassword !== newPasswordConfirm) {
            toast.error("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        updatePasswordMutation.mutate(
            { currentPassword, newPassword },
            {
                onSuccess: () => {
                    setIsEditingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setNewPasswordConfirm("");
                },
            },
        );
    }, [
        currentPassword,
        newPassword,
        newPasswordConfirm,
        updatePasswordMutation,
    ]);

    const handleImageUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file || !uid) return;

            setIsUploadingImage(true);
            try {
                const photoURL = await uploadProfileImage(file, uid);
                updateProfileMutation.mutate({ uid, photoURL });
            } catch (err) {
                toast.error(
                    err instanceof Error
                        ? err.message
                        : "이미지 업로드에 실패했습니다",
                );
            } finally {
                setIsUploadingImage(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        },
        [uid, updateProfileMutation],
    );

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="items-center space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-60" />
                </CardHeader>
            </Card>
        );
    }

    if (error || !profile) {
        return (
            <ErrorMessage
                title="프로필을 찾을 수 없습니다"
                message="요청하신 사용자 정보가 존재하지 않습니다."
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* 프로필 기본 정보 */}
            <Card>
                <CardHeader className="items-center text-center">
                    <div className="relative">
                        {profile.photoURL ? (
                            <img
                                src={profile.photoURL}
                                alt="프로필"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <UserCircle className="w-24 h-24 text-muted-foreground" />
                        )}
                        {isOwner && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={isUploadingImage}
                                >
                                    {isUploadingImage
                                        ? "업로드 중..."
                                        : "사진 변경"}
                                </Button>
                            </>
                        )}
                    </div>

                    <CardTitle className="text-xl mt-4">
                        {getDisplayName(profile.email, profile.displayName)}
                    </CardTitle>
                    <CardDescription>{profile.email}</CardDescription>

                    {isGoogleUser && (
                        <Badge variant="secondary">
                            구글 계정으로 로그인한 사용자입니다
                        </Badge>
                    )}
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground text-center">
                        가입일: {formatDateTime(profile.createdAt)}
                    </div>
                </CardContent>
            </Card>

            {/* 이름 수정 (본인만) */}
            {isOwner && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">이름 변경</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEditingName ? (
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">새 이름</Label>
                                    <Input
                                        id="displayName"
                                        value={newDisplayName}
                                        onChange={(e) =>
                                            setNewDisplayName(e.target.value)
                                        }
                                        placeholder="표시할 이름을 입력하세요"
                                        disabled={
                                            updateProfileMutation.isPending
                                        }
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleSaveName}
                                        disabled={
                                            updateProfileMutation.isPending ||
                                            !newDisplayName.trim()
                                        }
                                    >
                                        {updateProfileMutation.isPending
                                            ? "저장 중..."
                                            : "저장"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditingName(false)}
                                        disabled={
                                            updateProfileMutation.isPending
                                        }
                                    >
                                        취소
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-sm">
                                    {getDisplayName(
                                        profile.email,
                                        profile.displayName,
                                    )}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEditName}
                                >
                                    수정
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* 비밀번호 변경 (이메일 계정 본인만) */}
            {isOwner && !isGoogleUser && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">비밀번호 변경</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEditingPassword ? (
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">
                                        현재 비밀번호
                                    </Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                        disabled={
                                            updatePasswordMutation.isPending
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">
                                        새 비밀번호
                                    </Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        placeholder={`${PASSWORD_MIN_LENGTH}자 이상`}
                                        disabled={
                                            updatePasswordMutation.isPending
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPasswordConfirm">
                                        새 비밀번호 확인
                                    </Label>
                                    <Input
                                        id="newPasswordConfirm"
                                        type="password"
                                        value={newPasswordConfirm}
                                        onChange={(e) =>
                                            setNewPasswordConfirm(
                                                e.target.value,
                                            )
                                        }
                                        disabled={
                                            updatePasswordMutation.isPending
                                        }
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleSavePassword}
                                        disabled={
                                            updatePasswordMutation.isPending ||
                                            !currentPassword ||
                                            !newPassword ||
                                            !newPasswordConfirm
                                        }
                                    >
                                        {updatePasswordMutation.isPending
                                            ? "변경 중..."
                                            : "비밀번호 변경"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setIsEditingPassword(false);
                                            setCurrentPassword("");
                                            setNewPassword("");
                                            setNewPasswordConfirm("");
                                        }}
                                        disabled={
                                            updatePasswordMutation.isPending
                                        }
                                    >
                                        취소
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-sm">••••••••</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditingPassword(true)}
                                >
                                    변경
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default ProfilePage;
