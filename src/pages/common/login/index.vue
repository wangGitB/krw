<template>
  <view class="login-container">
    <view class="header">
      <view class="hello">
        HELLO
      </view>
      <view class="welcome">
        欢迎登录~
      </view>
    </view>

    <view class="login-form-wrap">
      <view class="title">
        登录
      </view>

      <view class="input-item">
        <input v-model="login_name" type="number" placeholder="手机号/邮箱" placeholder-class="placeholder">
      </view>

      <view class="input-item">
        <input v-model="password" password placeholder="密码" placeholder-class="placeholder">
      </view>

      <!-- 只有密码错误次数大于0时才显示验证码 -->
      <view v-if="passwordErrorCount > 0" class="input-item captcha-container">
        <input v-model="captcha" type="text" placeholder="请输入验证码" placeholder-class="placeholder">
        <image class="captcha-img" :src="captchaUrl" @tap="refreshCaptcha" />
      </view>

      <button class="login-btn" @tap="submit">
        登录
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { login } from '@/api/user';
import { HOME_PATH, isTabBarPath, LOGIN_PATH, removeQueryString } from '@/router';
import { setToken } from '@/utils/auth';

const login_name = ref<string>('18502811111');
const captcha = ref<string>('');
const password = ref<string>('');
const passwordErrorCount = ref<number>(0);
const captchaUrl = ref<string>('');
let redirect = HOME_PATH;
const baseUrl = import.meta.env.VITE_API_BASE_URL;
// 刷新验证码
function refreshCaptcha() {
  // 添加时间戳参数避免缓存
  captchaUrl.value = `${baseUrl}/user/captcha?t=${new Date().getTime()}`;
}

async function submit() {
  // 表单验证
  if (!login_name.value) {
    uni.showToast({
      title: '请输入手机号/邮箱',
      icon: 'none',
    });
    return;
  }

  if (!password.value) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none',
    });
    return;
  }

  // 如果已经显示验证码，则验证验证码
  if (passwordErrorCount.value > 0 && !captcha.value) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none',
    });
    return;
  }

  try {
    const res = await login({
      login_name: login_name.value,
      password: password.value,
      captcha: passwordErrorCount.value > 0 ? captcha.value : undefined,
    });

    setToken(res.token);

    // 登录成功后跳转
    uni.showToast({
      title: '登录成功',
      icon: 'success',
    });

    setTimeout(() => {
      uni.redirectTo({
        url: redirect,
      });
    }, 1500);
  }
  catch {
    // 密码错误，增加错误计数
    passwordErrorCount.value++;

    // 如果是第一次密码错误，显示验证码
    if (passwordErrorCount.value === 1) {
      refreshCaptcha();
    }
    else {
      // 如果已经显示验证码，则刷新验证码
      if (passwordErrorCount.value > 1) {
        refreshCaptcha();
      }
    }

    uni.showToast({
      title: '用户名或密码错误',
      icon: 'none',
    });
  }
}

onLoad(async (options: any) => {
  if (options.redirect && removeQueryString(options.redirect) !== LOGIN_PATH) {
    redirect = decodeURIComponent(options.redirect);
  }
});
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background-image: url('@/static/images/login/login_bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.header {
  padding: 80rpx 40rpx;

  .hello {
    font-size: 60rpx;
    font-weight: bold;
    color: #e53935;
    font-style: italic;
  }

  .welcome {
    font-size: 60rpx;
    font-weight: bold;
    color: #333;
    font-style: italic;
  }
}

.login-form-wrap {
  margin: 0 40rpx;
  padding: 40rpx;
  border-radius: 20rpx;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.05);

  .title {
    font-size: 40rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 60rpx;
  }

  .input-item {
    border-bottom: 1px solid #eee;
    margin-bottom: 40rpx;
    position: relative;

    input {
      height: 90rpx;
      font-size: 32rpx;
    }
  }

  .captcha-container {
    display: flex;
    align-items: center;

    input {
      flex: 1;
    }

    .captcha-img {
      width: 200rpx;
      height: 80rpx;
      margin-left: 20rpx;
    }
  }

  .placeholder {
    color: #999;
  }

  .login-btn {
    margin-top: 60rpx;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #e53935;
    color: #fff;
    font-size: 32rpx;
    border-radius: 45rpx;
  }
}

.hint {
  position: absolute;
  bottom: 40rpx;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 24rpx;
  color: #999;
  padding: 0 40rpx;

  .link {
    color: #e53935;
  }
}
</style>
