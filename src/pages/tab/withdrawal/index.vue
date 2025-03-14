<template>
  <view class="withdrawal-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-icon">
        <text class="iconfont icon-left" />
      </view>
      <view class="title">
        提币
      </view>
    </view>

    <!-- 表单内容 -->
    <view class="form-container">
      <!-- 币种选择 -->
      <view class="form-item">
        <view class="label">
          币种
        </view>
        <view class="input-wrapper">
          <view class="value">
            KRW
          </view>
          <text class="iconfont icon-right" />
        </view>
      </view>

      <!-- 数量输入 -->
      <view class="form-item">
        <view class="label">
          数量
        </view>
        <view class="input-wrapper">
          <input v-model="amount" type="number" placeholder="最小值1" class="input">
        </view>
      </view>

      <!-- 确认数量 -->
      <view class="form-item">
        <view class="label">
          确认数量
        </view>
        <view class="input-wrapper">
          <input v-model="confirmAmount" type="number" placeholder="请再次输入数量" class="input">
        </view>
      </view>

      <!-- 验证码 -->
      <view class="form-item">
        <view class="label">
          验证码
        </view>
        <view class="input-wrapper">
          <input v-model="verificationCode" type="text" placeholder="请输入验证码" class="input">
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="fee-info">
        <view class="fee-item">
          <text>网络手续费：</text>
          <text class="fee-value">
            1,000
          </text>
        </view>
        <view class="fee-item">
          <text>实际到账：</text>
          <text class="fee-value">
            99,000
          </text>
        </view>
      </view>

      <!-- 确认按钮 -->
      <view class="confirm-btn" @click="handleConfirm">
        确认
      </view>

      <!-- 提币历史 -->
      <view class="history-btn" @click="goToHistory">
        提币历史
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// const userStore = useUserStore();
const amount = ref('');
const confirmAmount = ref('');
const verificationCode = ref('');

// 处理确认提交
const handleConfirm = () => {
  if (!amount.value) {
    uni.showToast({
      title: '请输入提币数量',
      icon: 'none',
    });
    return;
  }

  if (amount.value !== confirmAmount.value) {
    uni.showToast({
      title: '两次输入的数量不一致',
      icon: 'none',
    });
    return;
  }

  if (!verificationCode.value) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none',
    });
    return;
  }

  // 提交提币请求
  console.log('提交提币请求', {
    currency: 'KRW',
    amount: amount.value,
    verificationCode: verificationCode.value,
  });
};

// 跳转到提币历史页面
const goToHistory = () => {
  uni.navigateTo({
    url: '/pages/tab/withdrawal/history',
  });
};
</script>

<style lang="scss" scoped>
.withdrawal-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  position: relative;
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 30rpx;
  background-color: #fff;

  .back-icon {
    position: absolute;
    left: 30rpx;
  }

  .title {
    flex: 1;
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
  }
}

.form-container {
  padding: 30rpx;
}

.form-item {
  display: flex;
  padding: 30rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;

  .label {
    width: 150rpx;
    font-size: 28rpx;
    color: #333;
  }

  .input-wrapper {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;

    .value {
      font-size: 28rpx;
    }

    .input {
      width: 100%;
      font-size: 28rpx;
      text-align: right;
    }
  }
}

.fee-info {
  margin: 30rpx 0;

  .fee-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10rpx;
    font-size: 28rpx;

    .fee-value {
      color: #ff3b30;
    }
  }
}

.confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90rpx;
  margin-bottom: 20rpx;
  font-size: 32rpx;
  color: #fff;
  background-color: #e63946;
  border-radius: 45rpx;
}

.history-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90rpx;
  font-size: 32rpx;
  color: #333;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 45rpx;
}
</style>
