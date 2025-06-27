import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "./SplashScreen";
import { requestAuthorizationCode } from "@/entities/User/api/toss/requestAuthorizationCode";
import { generateToken, refreshToken } from "@/entities/User/api/toss/generateToken";
import { fetchUserInfo, UserInfo } from "@/entities/User/api/toss/fetchUserInfo";


// 앱 초기화 페이지 -> 토스 로그인 및 회원 가입 진행
interface AppInitializerProps {
    onInitialized: () => void;  
}

const SCOPES = [
    "user_name",
    "user_phone",
    "user_birthday",
    "user_ci",
    "user_gender",
    "user_nationality",
    // email 은 가입 시 없을 수도 있으니 옵션
];

const AppInitializer: React.FC<AppInitializerProps> = ({ onInitialized }) => {
    const navigate = useNavigate();
    const [showSplash, setShowSplash] = useState(true);
    // const { setTokens, setUserInfo } = useUserStore();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Check Toss Login");
        (async () => {
          try {
            const { authorizationCode, referrer } = await requestAuthorizationCode(SCOPES);
            const { access_token, refresh_token } = await generateToken(authorizationCode, referrer);
            // setTokens({ accessToken: access_token, refreshToken: refresh_token, /*…*/ });
            const userInfo = await fetchUserInfo(access_token);
            // setUserInfo(userInfo);
            onInitialized();
        } catch (err: any) {
            setError(err.message);
          }
        })();
    }, []);


    
    if (showSplash) {
        return <SplashScreen />;
    }
    
    return null;
};

export default AppInitializer;