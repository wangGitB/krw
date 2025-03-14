<template>
  <view class="page-wrap">
    <u-navbar title="修改密码" left-icon="arrow-left" @left-click="goBack" />

    <view class="form-container">
      <view class="form-item">
        <view class="form-label">
          旧密码
        </view>
        <input
          v-model="oldPassword"
          class="form-input"
          type="password"
          placeholder="请输入旧密码"
          placeholder-class="placeholder"
        >
      </view>

      <view class="form-item">
        <view class="form-label">
          新密码
        </view>
        <input
          v-model="newPassword"
          class="form-input"
          type="password"
          placeholder="请输入新密码"
          placeholder-class="placeholder"
        >
      </view>

      <view class="form-item">
        <view class="form-label">
          重复新密码
        </view>
        <input
          v-model="confirmPassword"
          class="form-input"
          type="password"
          placeholder="请再次输入新密码"
          placeholder-class="placeholder"
        >
      </view>

      <view class="form-item">
        <view class="form-label">
          验证码
        </view>
        <input
          v-model="verifyCode"
          class="form-input"
          type="text"
          placeholder="请输入验证码"
          placeholder-class="placeholder"
        >
      </view>

      <button class="submit-btn" @click="handleSubmit">
        确认
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const verifyCode = ref('');

const goBack = () => {
  uni.navigateBack();
};

const handleSubmit = () => {
  // 表单验证
  if (!oldPassword.value) {
    uni.showToast({ title: '请输入旧密码', icon: 'none' });
    return;
  }

  if (!newPassword.value) {
    uni.showToast({ title: '请输入新密码', icon: 'none' });
    return;
  }

  if (!confirmPassword.value) {
    uni.showToast({ title: '请再次输入新密码', icon: 'none' });
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    uni.showToast({ title: '两次输入的新密码不一致', icon: 'none' });
    return;
  }

  if (!verifyCode.value) {
    uni.showToast({ title: '请输入验证码', icon: 'none' });
    return;
  }

  // 提交修改密码请求
  uni.showLoading({ title: '提交中...' });

  // 模拟请求
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '密码修改成功', icon: 'success' });

    // 返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1000);
};
</script>

<style lang="scss" scoped>
.page-wrap {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-container {
  padding: 0 30rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 8rpx;
}

.form-label {
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #333;
}

.form-input {
  height: 80rpx;
  font-size: 28rpx;
  color: #333;
}

.placeholder {
  font-size: 28rpx;
  color: #999;
}

.submit-btn {
  height: 90rpx;
  margin-top: 60rpx;
  font-size: 32rpx;
  line-height: 90rpx;
  color: #fff;
  background-color: #e54d42;
  border-radius: 45rpx;
}
</style>
