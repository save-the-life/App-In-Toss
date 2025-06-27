export async function requestAuthorizationCode(scopes: string[]) {
  // 예: apps-in-toss-sdk 가 설치되어 있다면
  const { authorizationCode, referrer } = await (window as any).AppsInTossModule.authenticate({
    scope: scopes.join(" "),
  });
  return { authorizationCode, referrer };
}