<template>
  <!-- 顶部导航和币种选择 -->
  <c-header show-back has-background title="行情" class="fixed left-0 right-0 top-0 z-10" />
  <!-- container -->
  <c-container>
    <view
      class="absolute left-0 right-0 top-0 h-[300rpx] w-full"
      :style="{ backgroundImage: `url(${background_banner})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
    />
    <!-- 币种选择器 -->
    <view class="mb-[20rpx] mt-[24rpx] p-l-[28rpx] p-r-[18rpx]">
      <view
        class="h-[108rpx] flex items-center justify-between border rounded-[10rpx] p-x-[20rpx]"
        :style="{ backgroundImage: `url(${currency_bg})` }"
      >
        <text class="text-[32rpx] text-[#333]">
          FDUSD/USDT
        </text>
        <view class="flex items-center" @click="handleCurrency">
          <image :src="icon_right" class="h-[48rpx] w-[48rpx]" />
        </view>
      </view>
    </view>

    <!-- 价格指标区域 -->
    <view class="mb-[20rpx] flex justify-around p-0">
      <view class="rounded-[8rpx] bg-red-100 p-[10rpx] text-center">
        <text class="text-[28rpx] text-red-600 font-medium">
          1,440.8
        </text>
      </view>
      <view class="rounded-[8rpx] bg-red-100 p-[10rpx] text-center">
        <text class="text-[28rpx] text-red-600 font-medium">
          1,441.1
        </text>
      </view>
      <view class="rounded-[8rpx] bg-red-100 p-[10rpx] text-center">
        <text class="text-[28rpx] text-red-600 font-medium">
          1,456.2
        </text>
      </view>
    </view>

    <!-- 买入卖出按钮 -->
    <view class="mb-[20rpx] flex p-0">
      <button class="mx-[10rpx] flex-1 rounded-[8rpx] bg-red-500 p-[15rpx] text-[32rpx] text-white">
        买入
      </button>
      <button class="mx-[10rpx] flex-1 rounded-[8rpx] bg-green-500 p-[15rpx] text-[32rpx] text-white">
        卖出
      </button>
    </view>

    <!-- 价格信息表格 -->
    <view class="mx-[30rpx] mb-[20rpx] rounded-[16rpx] bg-white p-[20rpx]">
      <view class="flex justify-between border-b border-gray-200 p-[10rpx] text-[24rpx] text-gray-500">
        <text>价格(USDT)</text>
        <text>数量(P)</text>
      </view>

      <!-- 卖出订单列表 -->
      <view>
        <view class="flex justify-between p-[10rpx] text-[26rpx]">
          <text class="text-red-600">
            5.39412
          </text>
          <text class="text-[#666]">
            2.03
          </text>
        </view>
        <view class="flex justify-between p-[10rpx] text-[26rpx]">
          <text class="text-red-600">
            5.39410
          </text>
          <text class="text-[#666]">
            9.05
          </text>
        </view>
        <view class="flex justify-between p-[10rpx] text-[26rpx]">
          <text class="text-red-600">
            5.39462
          </text>
          <text class="text-[#666]">
            1.04
          </text>
        </view>
        <view class="flex justify-between p-[10rpx] text-[26rpx]">
          <text class="text-red-600">
            5.39428
          </text>
          <text class="text-[#666]">
            5.04
          </text>
        </view>
      </view>

      <!-- 当前价格 -->
      <view class="relative p-[20rpx]">
        <view class="relative h-[4rpx]">
          <view class="line absolute left-0 top-0 h-full w-[60%] bg-green-500" />
        </view>
        <view class="mt-[10rpx] flex justify-between text-[28rpx] font-medium">
          <text class="text-green-500">
            5.38193
          </text>
          <text class="text-[24rpx] text-green-500">
            +0.01%
          </text>
        </view>
      </view>

      <!-- 买入订单列表 -->
      <view>
        <view class="flex justify-between p-[10rpx] text-[26rpx]">
          <text class="text-green-600">
            5.38412
          </text>
          <text class="text-[#666]">
            56.89
          </text>
        </view>
        <view class="flex justify-between p-[10rpx] text-[26rpx]">
          <text class="text-green-600">
            5.38410
          </text>
          <text class="text-[#666]">
            2.03
          </text>
        </view>
        <view class="flex justify-between p-[10rpx] text-[26rpx]">
          <text class="text-green-600">
            5.38412
          </text>
          <text class="text-[#666]">
            9.05
          </text>
        </view>
        <view class="flex justify-between p-[10rpx] text-[26rpx]">
          <text class="text-green-600">
            5.38482
          </text>
          <text class="text-[#666]">
            1.04
          </text>
        </view>
        <view class="flex justify-between p-[10rpx] text-[26rpx]">
          <text class="text-green-600">
            5.38428
          </text>
          <text class="text-[#666]">
            5.04
          </text>
        </view>
      </view>
    </view>
  </c-container>
</template>

<script setup lang="ts">
import icon_right from '@/static/images/home/back_icon.png';
import background_banner from '@/static/images/home/background_banner.png';
import currency_bg from '@/static/images/home/currency_bg.png';
import { useUserStore } from '@/store';
import { onMounted } from 'vue';

const userStore = useUserStore();
console.log('userStore.user_name', userStore.user_name);

// TODO: 币种选择
const handleCurrency = () => {
  console.log('handleCurrency');
};

// 动态设置页面标题
onMounted(() => {
  uni.setNavigationBarTitle({
    title: '行情',
  });
});

// 这里可以添加行情数据的获取和处理逻辑
</script>
