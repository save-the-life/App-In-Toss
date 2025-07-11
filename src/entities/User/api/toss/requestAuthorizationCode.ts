export async function requestAuthorizationCode(scopes: string[]) {
  // 예: apps-in-toss-sdk 가 설치되어 있다면
  const { authorizationCode, referrer } = await (window as any).AppsInTossModule.authenticate({
    scope: scopes.join(" "),
  });
  console.log("사용자 인증 코드 확인 for Real: ", authorizationCode);
  console.log("사용자 인증 확인 for Real: ", referrer);
  return { authorizationCode, referrer };
}