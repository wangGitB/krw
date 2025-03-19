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

      <view class="form-content">
        <view class="input-item">
          <input v-model="login_name" type="text" placeholder="手机号/邮箱" placeholder-class="placeholder">
        </view>

        <view class="input-item">
          <input
            v-model="password"
            password
            type="text"
            placeholder="密码"
            placeholder-class="placeholder"
          >
        </view>

        <!-- 只有密码错误次数大于0时才显示验证码 -->
        <view v-if="showCaptcha" class="input-item captcha-container">
          <input v-model="captcha" type="text" placeholder="请输入验证码" placeholder-class="placeholder">
          <image class="captcha-img" :src="captchaUrl" @tap="refreshCaptcha" />
        </view>

        <button class="login-btn" @tap="submit">
          登录
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { login, loginByCode } from '@/api/user';
// import { LOGIN_PATH, removeQueryString } from '@/router';
import { setToken } from '@/utils/auth';
import { SHA256 } from 'crypto-js';

const login_name = ref<string>('');
const captcha = ref<string>('');
const password = ref<string>('');
const showCaptcha = ref<boolean>(false);
const captchaUrl = ref<string>('');
// let redirect = HOME_PATH;

// 刷新验证码
async function refreshCaptcha() {
  // 添加时间戳参数避免缓存
  // captchaUrl.value = `${baseUrl}/user/captcha?t=${new Date().getTime()}`;
  const res = await loginByCode();
  captchaUrl.value = res.code;
}

async function submit() {
  try {
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
    if (showCaptcha.value && !captcha.value) {
      uni.showToast({
        title: '请输入验证码',
        icon: 'none',
      });
      return;
    }
    const res = await login({
      login_name: login_name.value,
      password: SHA256(password.value).toString(),
      captcha: captcha.value,
    });
    // 登录成功后跳转
    uni.showToast({
      title: '登录成功',
      icon: 'success',
    });
    setToken(res.token);
    setTimeout(() => {
      uni.$u.route({
        type: 'redirectTo',
        url: '/pages/common/google-code/index',
      });
    }, 800);
  }
  catch (error: any) {
    if (error.code === 3000) {
      showCaptcha.value = true;
      refreshCaptcha();
    }
  }
}

// onLoad(async (options: any) => {
//   if (options.redirect && removeQueryString(options.redirect) !== LOGIN_PATH) {
//     redirect = decodeURIComponent(options.redirect);
//   }
// });
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

  .form-content {
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
