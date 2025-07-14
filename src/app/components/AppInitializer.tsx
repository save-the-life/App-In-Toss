import React, { useState } from "react";
import SplashScreen from "./SplashScreen";
import { appLogin } from '@apps-in-toss/web-framework';

// 앱 초기화 페이지 -> 토스 로그인 및 회원 가입 진행
interface AppInitializerProps {
    onInitialized: () => void;  
}

const AppInitializer: React.FC<AppInitializerProps> = ({ onInitialized }) => {
    const [showSplash, setShowSplash] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("토스 인증 시작");
            const { authorizationCode, referrer } = await appLogin();
            console.log("토스 인증 성공:", { authorizationCode, referrer });
            // 이후 authorizationCode, referrer를 서버에 전달하거나 추가 로직 실행
            onInitialized();
        } catch (err: any) {
            console.error("토스 인증 실패:", err);
            setError(err.message || "알 수 없는 에러");
        } finally {
            setIsLoading(false);
        }
    };

    // if (showSplash) {
    //     return <SplashScreen />;
    // }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
            <button onClick={handleLogin} disabled={isLoading} style={{ padding: '12px 24px', fontSize: 18 }}>
                {isLoading ? '인증 중...' : '토스 인증으로 로그인'}
            </button>
            {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
        </div>
    );
};

export default AppInitializer;