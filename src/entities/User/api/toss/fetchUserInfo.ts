export interface UserInfo {
    userKey: number;
    scope: string;
    agreedTerms: string[];
    policy: string;
    certTxId?: string;
    name?: string;
    phone?: string;
    birthday?: string;
    ci?: string;
    di?: string | null;
    gender?: string;
    nationality?: string;
    email?: string | null;
}
  
export async function fetchUserInfo(accessToken: string): Promise<UserInfo> {
  const res = await fetch(`https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  const payload = await res.json();
  if (payload.resultType !== "SUCCESS") {
    throw new Error(payload.error?.reason || "유저 정보 조회 실패");
  }
  
  console.log("사용자 정보 확인: ", payload);
  return payload.success as UserInfo;
}