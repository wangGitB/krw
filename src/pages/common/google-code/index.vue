<template>
  <c-header show-back has-background title="谷歌验证码" class="fixed left-0 right-0 top-0 z-10" @back="handleBack" />
  <c-container>
    <view
      class="absolute left-0 right-0 top-0 h-[300rpx] w-full"
      :style="{ backgroundImage: `url(${background_banner})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
    />
    <view class="relative mt-[138rpx] p-x-[32rpx]">
      <view class="rounded-[16rpx] bg-white p-[32rpx]">
        <view class="w-full">
          <u-code-input
            v-model="verificationCode"
            :maxlength="6"
            :dot="false"
            mode="box"
            :space="10"
            font-size="24px"
            class="verification-code-input w-full"
            :size="boxSize"
            @finish="onCodeFinish"
          />
        </view>
        <view class="mt-[50rpx]">
          <u-button type="primary" text="确认" color="#e6302f" :disabled="!isCodeComplete" @click="onConfirm" />
        </view>
      </view>
    </view>
  </c-container>
</template>

<script lang="ts" setup>
import { getGoogleCode } from '@/api/user';
import background_banner from '@/static/images/home/background_banner.png';
import { computed, onMounted, ref } from 'vue';

const verificationCode = ref('');
const isCodeComplete = computed(() => verificationCode.value.length === 6);
const boxSize = ref(0);
const getGoogleCodeFn = async () => {
  try {
    const res = await getGoogleCode();
  }
  catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  getGoogleCodeFn();
  // 计算每个输入框的大小，使它们撑满容器
  const query = uni.createSelectorQuery();
  query.select('.w-full').boundingClientRect((data) => {
    if (data && typeof data === 'object' && 'width' in data) {
      // 计算每个输入框的大小 (总宽度减去间距) / 输入框数量
      const containerWidth = data.width as number;
      const totalSpacing = 10 * 5; // 5个间隔 (6个输入框之间)
      boxSize.value = Math.floor((containerWidth - totalSpacing) / 6);
    }
  }).exec();
});

const onCodeFinish = (code: string) => {
  console.log('验证码输入完成:', code);
};
const handleBack = () => {
  uni.navigateTo({
    url: '/pages/common/login/index',
  });
};
const onConfirm = () => {
  if (isCodeComplete.value) {
    uni.showToast({
      title: '验证码提交成功',
      icon: 'success',
    });
  }
};
</script>

<style lang="scss" scoped>
.verification-code-input {
  :deep(.u-code-input__item) {
    height: 80rpx !important; // 减小输入框高度
    line-height: 80rpx !important; // 调整内部文字垂直居中
  }
}
</style>
