<template>
  <view class="box-border h-[88rpx] w-full flex items-center border-b border-gray-200 bg-white p-2" :class="{ '!bg-transparent': hasBackground }">
    <view v-if="showBack" class="ml-[20rpx] h-full flex items-center" @click="handleBack">
      <image :src="backIcon" class="h-[48rpx] w-[48rpx] rotate-180" />
    </view>
    <view class="flex flex-1 justify-center">
      <text class="text-center text-[36rpx] text-[#333333] font-bold">
        {{ title }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import backIcon from '@/static/images/home/back_icon.png';

defineProps({
  title: {
    type: String,
    required: true,
  },
  showBack: {
    type: Boolean,
    default: true,
  },
  hasBackground: {
    type: Boolean,
    default: false,
  },
});

const handleBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};
</script>
