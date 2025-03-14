<template>
  <view class="page-wrap">
    <u-navbar title="我的" placeholder left-icon="" />

    <!-- 资产卡片 -->
    <view class="asset-card mx-20rpx mt-20rpx p-30rpx">
      <view class="flex items-center justify-between">
        <view class="font-size-28rpx">
          总资产估值
        </view>
        <view class="transaction-btn" @click="goToTransactionPassword">
          交易密码
        </view>
      </view>

      <view class="asset-value font-weight-bold mt-10rpx font-size-48rpx">
        1,070.81 <text class="font-size-28rpx">
          USD
        </text>
      </view>

      <view class="btc-value mt-10rpx font-size-24rpx text-gray">
        ≈0.01328734 BTC
      </view>

      <view class="mt-20rpx flex justify-between">
        <view class="font-size-24rpx">
          <text class="text-orange">
            提现手续费: 99,000
          </text>
        </view>
        <view class="font-size-24rpx">
          <text class="text-orange">
            交易手续费: 1,000
          </text>
        </view>
        <view class="modify-btn" @click="goToModifyPassword">
          修改密码
        </view>
      </view>
    </view>

    <!-- 加密货币列表 -->
    <view class="mt-20rpx bg-white">
      <view class="crypto-item flex items-center p-30rpx">
        <view class="crypto-icon form-icon mr-20rpx">
          F
        </view>
        <view class="flex-1">
          <view class="flex justify-between">
            <view class="font-size-32rpx">
              FORM1 <text class="font-size-24rpx text-gray">
                Form
              </text>
            </view>
            <view class="font-size-32rpx">
              408.577
            </view>
          </view>
          <view class="mt-10rpx flex justify-between">
            <view class="font-size-24rpx text-gray">
              最新价(USD)
            </view>
            <view class="font-size-24rpx text-gray">
              ≈2.06 USD
            </view>
          </view>
          <view class="flex justify-between">
            <view class="font-size-24rpx">
              0.005038
            </view>
            <view />
          </view>
        </view>
      </view>

      <view class="crypto-item border-top flex items-center p-30rpx">
        <view class="crypto-icon usdc-icon mr-20rpx">
          U
        </view>
        <view class="flex-1">
          <view class="flex justify-between">
            <view class="font-size-32rpx">
              USDC <text class="font-size-24rpx text-gray">
                USDCoin
              </text>
            </view>
            <view class="font-size-32rpx">
              1
            </view>
          </view>
          <view class="mt-10rpx flex justify-between">
            <view class="font-size-24rpx text-gray">
              最新价(USD)
            </view>
            <view />
          </view>
          <view class="flex justify-between">
            <view class="font-size-24rpx">
              0.005038
            </view>
            <view />
          </view>
        </view>
      </view>

      <view class="crypto-item border-top flex items-center p-30rpx">
        <view class="crypto-icon usdt-icon mr-20rpx">
          T
        </view>
        <view class="flex-1">
          <view class="flex justify-between">
            <view class="font-size-32rpx">
              USDT <text class="font-size-24rpx text-gray">
                Tether
              </text>
            </view>
            <view class="font-size-32rpx">
              0.03254267
            </view>
          </view>
          <view class="mt-10rpx flex justify-between">
            <view class="font-size-24rpx text-gray">
              平均成本价(USD)
            </view>
            <view class="font-size-24rpx text-gray">
              ≈0.03 USD
            </view>
          </view>
          <view class="flex justify-between">
            <view class="font-size-24rpx">
              --
            </view>
            <view />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { usePermission } from '@/hooks';
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

// 登录鉴权，微信小程序端点击tabbar的底层逻辑不触发uni.switchTab，需要在页面onShow生命周期中校验权限
onShow(async () => {
  const hasPermission = await usePermission();
  console.log(hasPermission ? '已登录' : '未登录，拦截跳转');
});
</script>

<style lang="scss" scoped>
.asset-card {
  background-color: #fffbeb;
  border-radius: 12rpx;
}

.transaction-btn, .modify-btn {
  padding: 6rpx 20rpx;
  font-size: 24rpx;
  color: #8b6e47;
  background-color: #f5f5f5;
  border: 1px solid #d4b675;
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
  width: 60rpx;
  height: 60rpx;
  font-weight: bold;
  color: white;
  border-radius: 50%;
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

.border-top {
  border-top: 1px solid #f5f5f5;
}
</style>
