<template>
  <c-header title="交易密码" class="relative z-10" @back="handleBack" />
  <c-container class="h-[calc(100vh-190rpx)] bg-white">
    <view class="px-30rpx py-20rpx">
      <view class="mb-24rpx flex items-center justify-between rounded-md bg-#f8f9fa p-24rpx">
        <text class="text-28rpx text-gray-800">
          是否开启交易密码
        </text>
        <up-switch v-model="isEnabled" size="20" active-color="#5ac725" />
      </view>
      <c-line />
      <view class="flex items-center justify-between py-30rpx">
        <text class="text-28rpx text-gray-800">
          旧密码
        </text>
        <view class="code-container w-70%" @click="focusInput('old')">
          <u-code-input
            v-model="oldPassword"
            :maxlength="6"
            :size="boxSize"
            mode="box"
            hairline
            :space="10"
            @change="codeChange"
          />
        </view>
      </view>

      <view class="flex items-center justify-between py-30rpx">
        <text class="text-28rpx text-gray-800">
          新密码
        </text>
        <view class="code-container w-70%" @click="focusInput('new')">
          <u-code-input
            v-model="newPassword"
            :maxlength="6"
            :size="boxSize"
            mode="box"
            hairline
            :space="10"
            @change="codeChange"
          />
        </view>
      </view>

      <view class="flex items-center justify-between py-30rpx">
        <text class="text-28rpx text-gray-800">
          重复新密码
        </text>
        <view class="code-container w-70%" @click="focusInput('confirm')">
          <u-code-input
            v-model="confirmPassword"
            :maxlength="6"
            :size="boxSize"
            mode="box"
            hairline
            :space="10"
            @change="codeChange"
          />
        </view>
      </view>

      <view class="flex items-center justify-between py-30rpx">
        <text class="text-28rpx text-gray-800">
          验证码
        </text>
        <view class="code-container w-70%" @click="focusInput('verification')">
          <u-code-input
            v-model="verificationCode"
            :maxlength="6"
            :size="boxSize"
            mode="box"
            hairline
            :space="10"
            @change="codeChange"
          />
        </view>
      </view>

      <button class="mt-60rpx h-80rpx w-full rounded-40rpx bg-[#e63946] text-30rpx text-white leading-80rpx" @click="handleConfirm">
        确认
      </button>
    </view>
  </c-container>
</template>

<script lang="ts" setup>
import { resetTradePwd } from '@/api/my';
import { onMounted, ref } from 'vue';

const isEnabled = ref(true);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const verificationCode = ref('');
const boxSize = ref(0);
const currentFocus = ref('');

const calculateBoxSize = () => {
  setTimeout(() => {
    const query = uni.createSelectorQuery();
    query.selectAll('.code-container').boundingClientRect((data) => {
      if (data && Array.isArray(data) && data.length > 0 && data[0] && typeof data[0].width === 'number') {
        const containerWidth = data[0].width;
        const totalSpacing = 10 * 5;
        boxSize.value = Math.floor((containerWidth - totalSpacing) / 6);
      }
    }).exec();
  }, 100);
};

onMounted(() => {
  calculateBoxSize();
});

const handleBack = () => {
  setTimeout(() => {
    uni.$u.route({
      type: 'switchTab',
      url: '/pages/tab/user/index',
    });
  }, 800);
};

const focusInput = (type: string) => {
  currentFocus.value = type;
};

const codeChange = () => {
  // 处理验证码输入变化
};

const handleConfirm = () => {
  // 验证输入
  if (!isEnabled.value) {
    // 处理关闭交易密码的逻辑
    uni.showToast({
      title: '已关闭交易密码',
      icon: 'none',
    });
    return;
  }

  if (!oldPassword.value || oldPassword.value.length < 6) {
    uni.showToast({
      title: '请输入完整的旧密码',
      icon: 'none',
    });
    return;
  }

  if (!newPassword.value || newPassword.value.length < 6) {
    uni.showToast({
      title: '请输入完整的新密码',
      icon: 'none',
    });
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none',
    });
    return;
  }

  if (!verificationCode.value || verificationCode.value.length < 6) {
    uni.showToast({
      title: '请输入完整的验证码',
      icon: 'none',
    });
    return;
  }

  // 提交表单
  uni.showLoading({
    title: '提交中',
  });

  // 调用API接口
  resetTradePwd({
    old_pwd: oldPassword.value,
    new_pwd: newPassword.value,
    google_code: verificationCode.value,
    status: isEnabled.value,
  })
    .then(() => {
      uni.hideLoading();
      uni.showToast({
        title: '设置成功',
        icon: 'success',
      });
      // 成功后返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    })
    .catch((err) => {
      uni.hideLoading();
      uni.showToast({
        title: err.message || '设置失败，请重试',
        icon: 'none',
      });
    });
};
</script>

<style lang="scss" scoped>
.code-container {
/* stylelint-disable selector-class-pattern */
:deep(.u-code-input__item) {
    // height: 80rpx !important; // 减小输入框高度
    // line-height: 80rpx !important; // 调整内部文字垂直居中
    background-color: #F8F9FA !important; // 添加背景色
    border: none !important; // 移除边框
  }
}
</style>
