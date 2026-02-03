interface StatusItemProps {
    label: string;
    isConnected: boolean;
}

function StatusItem({ label, isConnected }: StatusItemProps) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                }`}
            />
            <span className="text-sm">
                {label}: {isConnected ? "연결됨" : "연결 안됨"}
            </span>
        </div>
    );
}

export default StatusItem;
