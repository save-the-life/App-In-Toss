export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}
  
export async function generateToken(authorizationCode: string, referrer: string): Promise<TokenResponse> {
    const res = await fetch(`https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify({ authorizationCode, referrer }),
    });

    const payload = await res.json();
    if (payload.resultType !== "SUCCESS") {
        throw new Error(payload.error?.reason || "토큰 발급 실패");
    }
    return payload.success as TokenResponse;
}

export async function refreshToken(oldRefreshToken: string): Promise<TokenResponse> {
    const res = await fetch(`https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify({ refreshToken: oldRefreshToken }),
    });
    
    const payload = await res.json();
    if (payload.error) {
      throw new Error(payload.error_description || payload.error);
    }
    return payload.success as TokenResponse;
}