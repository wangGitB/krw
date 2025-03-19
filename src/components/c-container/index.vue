<template>
  <view class="container">
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const containerHeight = ref('100vh');

onMounted(() => {
  // 获取 tabbar 元素
  const tabbarElem = document.querySelector('.uni-tabbar-bottom');
  if (tabbarElem) {
    // 获取 tabbar 高度
    const tabbarHeight = tabbarElem.getBoundingClientRect().height;
    // 设置容器高度为 100vh 减去 tabbar 高度
    containerHeight.value = `calc(100vh - ${tabbarHeight}px)`;
  }
});
</script>

<style lang="scss" scoped>
.container {
  flex: 1;
  height: v-bind(containerHeight);
  overflow-y: auto;
}
</style>
