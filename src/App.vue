<script setup lang="ts">
// import { LOGIN_PATH } from '@/router';
// import { isLogin } from '@/utils/auth';
import { mpUpdate } from '@/utils/index';
// import { onMounted, onUnmounted } from 'vue';

onLaunch(() => {
  console.log('App Launch');
  // #ifdef MP-WEIXIN
  mpUpdate();
  // #endif
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});

// TODO: 后面需要取消注释
// #ifdef H5
// 在H5环境下监听路由变化
// onMounted(() => {
//   // 初始检查登录状态
//   checkLoginStatus();
//   // 监听路由变化
//   window.addEventListener('popstate', checkLoginStatus);
//   // 监听hashchange事件（对于hash路由模式）
//   window.addEventListener('hashchange', checkLoginStatus);
// });

// // 在组件卸载时移除事件监听
// onUnmounted(() => {
//   window.removeEventListener('popstate', checkLoginStatus);
//   window.removeEventListener('hashchange', checkLoginStatus);
// });

// // 检查登录状态
// function checkLoginStatus() {
//   // 获取当前路径
//   const currentPath = window.location.pathname + window.location.hash;
//   // 如果当前路径不是登录页且未登录，则重定向到登录页
//   if (!currentPath.includes(LOGIN_PATH) && !isLogin()) {
//     // 保存当前路径，以便登录后返回
//     const redirectPath = encodeURIComponent(currentPath);
//     uni.redirectTo({
//       url: `${LOGIN_PATH}?redirect=${redirectPath}`,
//     });
//   }
// }
// #endif
</script>

<style lang="scss">
/* 每个页面公共css */
@import 'uview-plus/index.scss';
@import '@/static/styles/common.scss';
</style>
