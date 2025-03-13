<template>
  <view class="flex flex-col items-center justify-center">
    <view class="flex justify-center">
      <text class="font-size-36rpx color-gray-700">
        行情页面
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';

// const title = ref<string>();
// title.value = import.meta.env.VITE_APP_TITLE;
const userStore = useUserStore();
console.log('userStore.user_name', userStore.user_name);
</script>
