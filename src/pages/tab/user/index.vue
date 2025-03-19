<template>
  <view
    class="absolute left-0 right-0 top-0 h-[300rpx] w-full"
    :style="{ backgroundImage: `url(${background_banner})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
  />
  <c-container>
    <c-header :show-back="false" has-background title="我的" class="relative z-10" />
    <view class="page-wrap relative">
      <up-loading-page :loading="loading" />
      <view v-if="!loading">
        <!-- 资产卡片 -->
        <view class="asset-card mx-20rpx mt-20rpx p-30rpx">
          <view class="flex items-center justify-between">
            <view class="font-size-32rpx text-[#333] font-bold">
              总资产估值
            </view>
            <view class="transaction-btn" @click="goToTransactionPassword">
              交易密码
            </view>
          </view>

          <view class="asset-value font-weight-Medium mt-10rpx flex font-size-64rpx">
            {{ currencyAmount.total_value || '0.00' }} <view class="ml-20rpx flex items-end font-size-32rpx font-bold">
              <view class="currency-selector" @click="chooseCurrency">
                {{ selectedCurrency }} <up-icon class="up-icon" name="arrow-down-fill" color="#333333" size="24rpx" />
              </view>
            </view>
          </view>

          <!-- <view class="btc-value mt-10rpx font-size-24rpx text-[#999999]">
            ≈{{ '0.00000000' }} BTC
          </view> -->

          <view class="mt-20rpx flex justify-between">
            <view class="flex items-center font-size-24rpx">
              <view class="flex text-[#333]">
                提现手续费:<view class="ml-10rpx text-[#E6302F]">
                  {{ currencyAmount.withdraw_fee || '0' }}
                </view>
              </view>
            </view>
            <view class="flex items-center font-size-24rpx">
              <view class="flex items-center text-[#333]">
                交易手续费: <view class="ml-10rpx text-[#E6302F]">
                  {{ currencyAmount.trade_fee || '0' }}
                </view>
              </view>
            </view>
            <view class="modify-btn" @click="goToModifyPassword">
              修改密码
            </view>
          </view>
        </view>

        <!-- 加密货币列表 -->
        <view class="">
          <view
            v-for="(asset, index) in currencyAmount.assets" :key="asset.symbol"
            class="crypto-item m-24rpx flex flex-col rounded-20rpx bg-white p-30rpx" :class="[index > 0 ? 'border-top' : '']"
          >
            <view class="flex items-center justify-between">
              <view class="flex items-center">
                <image
                  v-if="asset.icon"
                  :src="asset.icon"
                  class="crypto-icon mr-20rpx"
                />
                <view
                  v-else
                  class="crypto-icon mr-20rpx"
                  :class="[getCryptoIconClass(asset.symbol)]"
                >
                  {{ asset.symbol ? asset.symbol.charAt(0) : 'C' }}
                </view>
                <view class="font-weight-500 max-w-40 font-size-32rpx">
                  {{ asset.symbol }} <text class="ml-10rpx font-size-24rpx text-gray">
                    <!-- {{ asset.symbol_name || '' }} -->
                  </text>
                </view>
              </view>
              <view class="font-weight-500 max-w-60 flex flex-wrap justify-end font-size-32rpx">
                <view class="text-right">
                  {{ asset.amount || '0' }}
                </view>
                <view v-if="asset.amount_value && asset.amount_value !== '0'" class="w-full text-right font-size-24rpx text-gray">
                  ≈{{ asset.amount_value }} USD
                </view>
              </view>
            </view>
            <view class="mt-10rpx flex justify-between">
              <view class="font-size-24rpx text-gray">
                '最新价'({{ selectedCurrency }})
              </view>
              <view class="mt-5rpx flex justify-between">
                <view class="font-size-28rpx">
                  {{ asset.price || '--' }}
                </view>
              </view>
            </view>
          </view>

          <!-- 如果没有资产，显示空状态 -->
          <view
            v-if="!currencyAmount.assets || currencyAmount.assets.length === 0"
            class="empty-state p-30rpx text-center"
          >
            <view class="font-size-28rpx text-gray">
              暂无资产数据
            </view>
          </view>
        </view>
      </view>
    </view>
  </c-container>

  <!-- 货币选择弹出层 -->
  <u-popup :show="showCurrencyPicker" mode="bottom" @close="showCurrencyPicker = false">
    <view class="currency-picker">
      <view class="currency-picker-header">
        <text>选择货币</text>
        <u-icon name="close" @click="showCurrencyPicker = false" />
      </view>
      <view class="currency-picker-body">
        <view
          v-for="currency in currencies" :key="currency.code" class="currency-item"
          @click="selectCurrency(currency.code)"
        >
          <text>{{ currency.code }}</text>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import type { PriceSymbol, UserAssetData } from '@/api/my';
import { getCurrencyAmount, getPriceSymbol } from '@/api/my';
import { usePermission } from '@/hooks';
import background_banner from '@/static/images/home/background_banner.png';
import { ref } from 'vue';
// useClipboard,
// const { setClipboardData, getClipboardData } = useClipboard();

// 复制
// const toCopy = async () => {
//   await setClipboardData({ data: '1234567890' });
//   const data = await getClipboardData();
//   console.log('[ data ] >', data);
// };

// 跳转到修改密码页面
const goToModifyPassword = () => {
  uni.navigateTo({
    url: '/pages/user/modify-password/index',
  });
};

// 跳转到交易密码设置页面
const goToTransactionPassword = () => {
  uni.navigateTo({
    url: '/pages/user/transaction-password/index',
  });
};
// 货币选择相关
const showCurrencyPicker = ref(false);
const selectedCurrency = ref('USD');
const loading = ref(true);
// 币种列表
const currencies = ref<Array<{ code: string }>>([]);
// 根据币种获取货币数量
const currencyAmount = ref<UserAssetData>({
  assets: [],
  total_value: '',
  trade_fee: '',
  withdraw_fee: '',
});

// 获取货币数量
const getCurrencyAmountFn = async () => {
  try {
    const res = await getCurrencyAmount({ symbol: selectedCurrency.value });
    currencyAmount.value = res;
    console.log('[ currencyAmount ] >', currencyAmount.value);
  }
  catch (error) {
    console.error('获取货币数据失败', error);
    uni.showToast({
      title: '获取数据失败',
      icon: 'none',
    });
  }
  finally {
    loading.value = false;
  }
};

// 获取币种
const getCurrencyList = async () => {
  try {
    const res = await getPriceSymbol();
    currencies.value = res.map((item: PriceSymbol) => ({
      code: item.symbol,
    }));

    // 获取本地存储的币种，如果没有则使用第一个币种或USD
    const savedCurrency = uni.getStorageSync('selectedCurrency');
    if (savedCurrency && currencies.value.some(c => c.code === savedCurrency)) {
      selectedCurrency.value = savedCurrency;
    }
    else {
      selectedCurrency.value = currencies.value[0]?.code || 'USD';
    }

    // 获取货币数量
    await getCurrencyAmountFn();
  }
  catch (error) {
    console.error('获取币种列表失败', error);
    uni.showToast({
      title: '获取币种列表失败',
      icon: 'none',
    });
  }
};

// 登录鉴权，微信小程序端点击tabbar的底层逻辑不触发uni.switchTab，需要在页面onShow生命周期中校验权限
onMounted(async () => {
  const hasPermission = await usePermission();
  if (hasPermission) {
    await getCurrencyList(); // getCurrencyList内部会关闭loading
  }
});

// 选择币种
const chooseCurrency = () => {
  showCurrencyPicker.value = true;
};

// 确认选中币种
const selectCurrency = (currency: string) => {
  selectedCurrency.value = currency;
  showCurrencyPicker.value = false;

  // 保存选择到本地存储
  uni.setStorageSync('selectedCurrency', currency);

  // 切换货币后重新获取数据
  loading.value = true; // 重新加载数据时显示loading
  getCurrencyAmountFn().finally(() => {
    loading.value = false; // 数据加载完成后关闭loading
  });

  // 可以添加一个提示
  uni.showToast({
    title: `已切换到${currency}`,
    icon: 'none',
    duration: 2000,
  });
};

// 获取加密货币图标的类名
const getCryptoIconClass = (symbol: string) => {
  if (!symbol) return 'form-icon';

  const symbolLower = symbol.toLowerCase();
  if (symbolLower.includes('usdc')) return 'usdc-icon';
  if (symbolLower.includes('usdt')) return 'usdt-icon';
  if (symbolLower.includes('form')) return 'form-icon';

  // 为其他币种返回默认样式
  return 'form-icon';
};
</script>

<style lang="scss" scoped>
.asset-card {
  background: linear-gradient(270deg, #F2E6BC 0%, #FFF5D2 100%);
  border: 2rpx solid #FFF;
  border-radius: 16rpx;
}

.transaction-btn,
.modify-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 20rpx;
  font-size: 24rpx;
  line-height: 1;
  color: #6B4425;
  background-color: transparent;
  border: 1px solid #6B4425;
  border-radius: 30rpx;
}

.text-orange {
  color: #e86f1c;
}

.text-gray {
  color: #999;
}

.crypto-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  overflow: hidden;
  font-size: 24rpx;
  font-weight: bold;
  color: white;
  border-radius: 50%;
}

image.crypto-icon {
  object-fit: cover;
}

.form-icon {
  background-color: #333;
}

.usdc-icon {
  background-color: #2775ca;
}

.usdt-icon {
  background-color: #26a17b;
}

.font-weight-500 {
  font-weight: 500;
}

.border-top {
  border-top: 1px solid #f5f5f5;
}

.currency-selector {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.currency-selector .up-icon {
  position: relative;
  top: 2rpx;
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

.max-w-40 {
  max-width: 40%;
}

.max-w-60 {
  max-width: 60%;
}

.text-right {
  text-align: right;
}

.w-full {
  width: 100%;
}
</style>
