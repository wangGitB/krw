const TokenKey = 'admin-token';
const TokenPrefix = 'Bearer ';
const GoogleTokenKey = 'google_token';
function isLogin() {
  return !!uni.getStorageSync(TokenKey);
}
function getToken() {
  return uni.getStorageSync(TokenKey);
}
function setToken(token: string) {
  uni.setStorageSync(TokenKey, token);
}
function clearToken() {
  uni.removeStorageSync(TokenKey);
}

function getGoogleToken() {
  return uni.getStorageSync(GoogleTokenKey);
}
export { clearToken, getGoogleToken, getToken, isLogin, setToken, TokenPrefix };
