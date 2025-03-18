<template>
  <c-header title="提币" :show-back="false" />
  <c-container class="px-28rpx">
    <!-- 表单内容 -->
    <view class="form-container">
      <!-- 币种选择 -->
      <view class="form-item currency-select-item" @click="showCurrencyPicker = true">
        <view class="label">
          币种
        </view>
        <view class="input-wrapper">
          <view class="currency-value">
            {{ selectedCurrency.symbol_name || '请选择币种' }}
          </view>
          <u-icon name="arrow-down" size="28rpx" color="#666" class="down-arrow" />
        </view>
      </view>

      <!-- 可用余额 -->
      <view class="form-item">
        <view class="label">
          可用余额
        </view>
        <view class="input-wrapper">
          <view class="value">
            {{ balance }}
          </view>
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
            {{ withdrawFee }}
          </text>
        </view>
        <view class="fee-item">
          <text>实际到账：</text>
          <text class="fee-value">
            {{ actualAmount }}
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
  </c-container>

  <!-- 币种选择弹出层 -->
  <u-popup :show="showCurrencyPicker" mode="bottom" @close="showCurrencyPicker = false">
    <view class="currency-picker">
      <view class="currency-picker-header">
        <text>选择币种</text>
        <u-icon name="close" @click="showCurrencyPicker = false" />
      </view>
      <view class="currency-picker-body">
        <view
          v-for="item in currencyList"
          :key="item.symbol_id"
          class="currency-item"
          @click="selectCurrency(item)"
        >
          <text>{{ item.symbol_name }}</text>
          <text>可用: {{ item.amount }}</text>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { getCurrency, type MySymbol } from '@/api/my/index';
import { withdrawal, type WithdrawReq } from '@/api/withdraw/index';
import { computed, onMounted, ref } from 'vue';

// 响应式数据
const amount = ref('');
const confirmAmount = ref('');
const verificationCode = ref('');
const currencyList = ref<MySymbol[]>([]);
const selectedCurrency = ref<MySymbol>({} as MySymbol);
const showCurrencyPicker = ref(false);

// 计算余额
const balance = computed(() => {
  return selectedCurrency.value.amount || '0';
});

// 计算网络手续费
const withdrawFee = computed(() => {
  if (!amount.value) return '0';
  const amountNum = Number.parseFloat(amount.value);
  const feeRate = Number.parseFloat(selectedCurrency.value.withdraw_fee || '0');
  return (amountNum * feeRate).toFixed(2);
});

// 计算实际到账金额
const actualAmount = computed(() => {
  if (!amount.value) return '0';
  const amountNum = Number.parseFloat(amount.value);
  const feeRate = Number.parseFloat(selectedCurrency.value.withdraw_fee || '0');
  return (amountNum * (1 - feeRate)).toFixed(2);
});

// 选择币种
const selectCurrency = (currency: MySymbol) => {
  selectedCurrency.value = currency;
  showCurrencyPicker.value = false;
};

// 获取可用币种列表
const fetchCurrencyList = async () => {
  try {
    const res = await getCurrency();
    if (res) {
      currencyList.value = Array.isArray(res) ? res : [res];
      if (currencyList.value.length > 0) {
        selectCurrency(currencyList.value[0]);
      }
    }
  }
  catch (error) {
    console.error('获取币种列表失败', error);
    uni.showToast({
      title: '获取币种列表失败',
      icon: 'none',
    });
  }
};

// 处理确认提交
const handleConfirm = async () => {
  if (!selectedCurrency.value.symbol_id) {
    uni.showToast({
      title: '请选择币种',
      icon: 'none',
    });
    return;
  }

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

  if (Number.parseFloat(amount.value) > Number.parseFloat(balance.value)) {
    uni.showToast({
      title: '提币金额不能大于可用余额',
      icon: 'none',
    });
    return;
  }

  try {
    // 弹窗二次确认
    uni.showModal({
      title: '提币确认',
      content: `您确定要提取 ${amount.value} ${selectedCurrency.value.symbol_name} 吗？实际到账 ${actualAmount.value}`,
      confirmText: '确认',
      cancelText: '取消',
      success: async (res) => {
        if (res.confirm) {
          // 提交提币请求
          const data: WithdrawReq = {
            amount: amount.value,
            google_code: verificationCode.value,
            sign: '', // 这里可能需要从其他地方获取签名
            symbol_id: selectedCurrency.value.symbol_id,
            t: Date.now(),
          };

          // 显示加载中
          uni.showLoading({
            title: '提交中',
          });

          const res = await withdrawal(data);

          // 隐藏加载
          uni.hideLoading();

          if (res) {
            uni.showToast({
              title: '提币申请已提交',
              icon: 'success',
            });

            // 清空表单
            amount.value = '';
            confirmAmount.value = '';
            verificationCode.value = '';

            // 刷新币种列表
            fetchCurrencyList();
          }
        }
      },
    });
  }
  catch (error) {
    console.error('提币失败', error);
    uni.showToast({
      title: '提币失败，请稍后重试',
      icon: 'none',
    });
  }
};

// 跳转到提币历史页面
const goToHistory = () => {
  uni.navigateTo({
    url: '/pages/withdrawal-history/index',
  });
};

// 页面加载时获取币种列表
onMounted(() => {
  fetchCurrencyList();
});
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
  color: #E6302F;
  background-color: #FFE9E8;
  border: 1px solid #eee;
  border-radius: 45rpx;
}

.currency-picker {
  padding-bottom: 30rpx;
  background-color: #fff;
  border-radius: 16rpx 16rpx 0 0;
}

.currency-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.currency-picker-body {
  max-height: 600rpx;
  overflow-y: auto;
}

.currency-item {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.currency-item:active {
  background-color: #f5f5f5;
}

.currency-select-item {
  position: relative;
  background-color: #fff;
  border-radius: 10rpx;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 30rpx;
    right: 30rpx;
    height: 1px;
    background-color: #f5f5f5;
  }

  .input-wrapper {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
  }

  .currency-value {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  .down-arrow {
    margin-left: 10rpx;
  }
}
</style>
