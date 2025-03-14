<template>
  <view class="page-wrap">
    <u-navbar title="设置交易密码" left-icon="arrow-left" @left-click="goBack" />

    <view class="form-container">
      <view class="switch-item">
        <view class="switch-label">
          是否开启交易密码
        </view>
        <u-switch v-model="isEnabled" active-color="#4cd964" />
      </view>

      <view v-if="isEnabled">
        <view class="password-container">
          <view class="password-label">
            旧密码
          </view>
          <view class="password-input-group">
            <view
              v-for="(item, index) in 6"
              :key="index"
              class="password-input"
              :class="{ active: oldPassword.length > index }"
            >
              <text v-if="oldPassword.length > index">
                •
              </text>
            </view>
          </view>
        </view>

        <view class="password-container">
          <view class="password-label">
            新密码
          </view>
          <view class="password-input-group">
            <view
              v-for="(item, index) in 6"
              :key="index"
              class="password-input"
              :class="{ active: newPassword.length > index }"
            >
              <text v-if="newPassword.length > index">
                •
              </text>
            </view>
          </view>
        </view>

        <view class="password-container">
          <view class="password-label">
            重复新密码
          </view>
          <view class="password-input-group">
            <view
              v-for="(item, index) in 6"
              :key="index"
              class="password-input"
              :class="{ active: confirmPassword.length > index }"
            >
              <text v-if="confirmPassword.length > index">
                •
              </text>
            </view>
          </view>
        </view>

        <view class="password-container">
          <view class="password-label">
            验证码
          </view>
          <view class="password-input-group">
            <view
              v-for="(item, index) in 6"
              :key="index"
              class="password-input"
              :class="{ active: verifyCode.length > index }"
            >
              <text v-if="verifyCode.length > index">
                •
              </text>
            </view>
          </view>
        </view>
      </view>

      <button class="submit-btn" @click="handleSubmit">
        确认
      </button>
    </view>

    <!-- 数字键盘 -->
    <view v-if="showKeyboard" class="keyboard">
      <view class="keyboard-row">
        <view class="keyboard-key" @click="inputNumber('1')">
          1
        </view>
        <view class="keyboard-key" @click="inputNumber('2')">
          2
        </view>
        <view class="keyboard-key" @click="inputNumber('3')">
          3
        </view>
      </view>
      <view class="keyboard-row">
        <view class="keyboard-key" @click="inputNumber('4')">
          4
        </view>
        <view class="keyboard-key" @click="inputNumber('5')">
          5
        </view>
        <view class="keyboard-key" @click="inputNumber('6')">
          6
        </view>
      </view>
      <view class="keyboard-row">
        <view class="keyboard-key" @click="inputNumber('7')">
          7
        </view>
        <view class="keyboard-key" @click="inputNumber('8')">
          8
        </view>
        <view class="keyboard-key" @click="inputNumber('9')">
          9
        </view>
      </view>
      <view class="keyboard-row">
        <view class="keyboard-key empty" />
        <view class="keyboard-key" @click="inputNumber('0')">
          0
        </view>
        <view class="keyboard-key" @click="deleteNumber">
          <u-icon name="backspace" size="40" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const isEnabled = ref(true);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const verifyCode = ref('');
const currentInput = ref('oldPassword');
const showKeyboard = ref(true);

const goBack = () => {
  uni.navigateBack();
};

const inputNumber = (num: string) => {
  if (currentInput.value === 'oldPassword' && oldPassword.value.length < 6) {
    oldPassword.value += num;
    if (oldPassword.value.length === 6) {
      currentInput.value = 'newPassword';
    }
  }
  else if (currentInput.value === 'newPassword' && newPassword.value.length < 6) {
    newPassword.value += num;
    if (newPassword.value.length === 6) {
      currentInput.value = 'confirmPassword';
    }
  }
  else if (currentInput.value === 'confirmPassword' && confirmPassword.value.length < 6) {
    confirmPassword.value += num;
    if (confirmPassword.value.length === 6) {
      currentInput.value = 'verifyCode';
    }
  }
  else if (currentInput.value === 'verifyCode' && verifyCode.value.length < 6) {
    verifyCode.value += num;
  }
};

const deleteNumber = () => {
  if (currentInput.value === 'oldPassword' && oldPassword.value.length > 0) {
    oldPassword.value = oldPassword.value.slice(0, -1);
  }
  else if (currentInput.value === 'newPassword' && newPassword.value.length > 0) {
    newPassword.value = newPassword.value.slice(0, -1);
  }
  else if (currentInput.value === 'confirmPassword' && confirmPassword.value.length > 0) {
    confirmPassword.value = confirmPassword.value.slice(0, -1);
  }
  else if (currentInput.value === 'verifyCode' && verifyCode.value.length > 0) {
    verifyCode.value = verifyCode.value.slice(0, -1);
  }
  else if (currentInput.value === 'newPassword' && newPassword.value.length === 0) {
    currentInput.value = 'oldPassword';
  }
  else if (currentInput.value === 'confirmPassword' && confirmPassword.value.length === 0) {
    currentInput.value = 'newPassword';
  }
  else if (currentInput.value === 'verifyCode' && verifyCode.value.length === 0) {
    currentInput.value = 'confirmPassword';
  }
};

const handleSubmit = () => {
  if (!isEnabled.value) {
    uni.showToast({ title: '已关闭交易密码', icon: 'success' });
    return;
  }

  // 表单验证
  if (oldPassword.value.length !== 6) {
    uni.showToast({ title: '请输入6位旧密码', icon: 'none' });
    return;
  }

  if (newPassword.value.length !== 6) {
    uni.showToast({ title: '请输入6位新密码', icon: 'none' });
    return;
  }

  if (confirmPassword.value.length !== 6) {
    uni.showToast({ title: '请再次输入6位新密码', icon: 'none' });
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    uni.showToast({ title: '两次输入的新密码不一致', icon: 'none' });
    return;
  }

  if (verifyCode.value.length !== 6) {
    uni.showToast({ title: '请输入6位验证码', icon: 'none' });
    return;
  }

  // 提交设置交易密码请求
  uni.showLoading({ title: '提交中...' });

  // 模拟请求
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '交易密码设置成功', icon: 'success' });

    // 返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1000);
};

// 监听开关状态
watch(isEnabled, (newVal) => {
  if (!newVal) {
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    verifyCode.value = '';
    currentInput.value = 'oldPassword';
  }
});
</script>

<style lang="scss" scoped>
.page-wrap {
  min-height: 100vh;
  padding-bottom: 300rpx;
  background-color: #f5f5f5;
}

.form-container {
  padding: 0 30rpx;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 8rpx;
}

.switch-label {
  font-size: 28rpx;
  color: #333;
}

.password-container {
  margin-bottom: 20rpx;
}

.password-label {
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.password-input-group {
  display: flex;
  justify-content: space-between;
}

.password-input {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  font-size: 40rpx;
  background-color: #fff;
  border: 1px solid #eee;
}

.password-input.active {
  border-color: #ddd;
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

.keyboard {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  padding: 20rpx 0;
  background-color: #f7f7f7;
}

.keyboard-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20rpx;
}

.keyboard-key {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 220rpx;
  height: 100rpx;
  font-size: 36rpx;
  font-weight: bold;
  background-color: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 4rpx rgb(0 0 0 / 10%);
}

.keyboard-key.empty {
  background-color: transparent;
  box-shadow: none;
}
</style>
