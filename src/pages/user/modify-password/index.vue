<template>
  <c-header title="修改密码" :show-back="true" @click="goBack" />
  <c-container>
    <view class="form-container">
      <view class="form-item">
        <view class="form-label">
          旧密码
        </view>
        <view class="input-container">
          <input
            v-model="oldPassword"
            class="form-input"
            :password="!oldPasswordVisible"
            placeholder="请输入旧密码"
            placeholder-class="placeholder"
            :maxlength="12"
          >
          <view class="eye-icon" @click="oldPasswordVisible = !oldPasswordVisible">
            <u-icon :name="oldPasswordVisible ? 'eye' : 'eye-off'" size="40rpx" color="#999" />
          </view>
        </view>
      </view>

      <view class="form-item">
        <view class="form-label">
          新密码
        </view>
        <view class="input-container">
          <input
            v-model="newPassword"
            class="form-input"
            :password="!newPasswordVisible"
            placeholder="请输入新密码(6-12位)"
            placeholder-class="placeholder"
            :maxlength="12"
          >
          <view class="eye-icon" @click="newPasswordVisible = !newPasswordVisible">
            <u-icon :name="newPasswordVisible ? 'eye' : 'eye-off'" size="40rpx" color="#999" />
          </view>
        </view>
      </view>

      <view class="form-item">
        <view class="form-label">
          重复新密码
        </view>
        <view class="input-container">
          <input
            v-model="confirmPassword"
            class="form-input"
            :password="!confirmPasswordVisible"
            placeholder="请再次输入新密码"
            placeholder-class="placeholder"
            :maxlength="12"
          >
          <view class="eye-icon" @click="confirmPasswordVisible = !confirmPasswordVisible">
            <u-icon :name="confirmPasswordVisible ? 'eye' : 'eye-off'" size="40rpx" color="#999" />
          </view>
        </view>
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
  </c-container>
</template>

<script setup lang="ts">
import { modifyPassword } from '@/api/my/index';
import { ref } from 'vue';

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const verifyCode = ref('');

// 密码可见性控制
const oldPasswordVisible = ref(false);
const newPasswordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const goBack = () => {
  uni.switchTab({ url: '/pages/tab/user/index' });
};

const handleSubmit = async () => {
  // 表单验证
  if (!oldPassword.value) {
    uni.showToast({ title: '请输入旧密码', icon: 'none' });
    return;
  }

  if (!newPassword.value) {
    uni.showToast({ title: '请输入新密码', icon: 'none' });
    return;
  }

  // 新增密码长度验证
  if (newPassword.value.length < 6 || newPassword.value.length > 12) {
    uni.showToast({ title: '新密码长度需在6-12位之间', icon: 'none' });
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

  try {
    await modifyPassword({
      old_pwd: oldPassword.value,
      new_pwd: newPassword.value,
      google_code: verifyCode.value,
    });

    uni.hideLoading();
    uni.showToast({ title: '密码修改成功', icon: 'success' });

    // 返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
  catch (error: any) {
    uni.hideLoading();
    uni.showToast({
      title: error.message || '密码修改失败',
      icon: 'none',
    });
  }
};
</script>

<style lang="scss" scoped>
.page-wrap {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-container {
  padding: 0 30rpx;
  padding-top: 20rpx;
}

.form-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 8rpx;
}

.form-label {
  width: 160rpx;
  font-size: 28rpx;
  color: #333;
}

.input-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.form-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
  color: #333;
}

.eye-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20rpx;
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
