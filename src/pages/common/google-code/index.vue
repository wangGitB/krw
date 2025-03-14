<template>
  <c-header show-back has-background title="谷歌验证码" class="fixed left-0 right-0 top-0 z-10" @back="handleBack" />
  <c-container>
    <view
      class="absolute left-0 right-0 top-0 h-[300rpx] w-full"
      :style="{ backgroundImage: `url(${background_banner})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
    />
    <view v-if="isLoading" class="relative mt-[138rpx] flex items-center justify-center">
      <u-loading-page :loading="isLoading" icon-size="36" loading-text="正在获取验证信息..." loading-mode="semicircle" bg-color="rgba(255, 255, 255, 0.9)" />
    </view>
    <view v-else-if="!isBoundGoogleCode" class="relative mt-[138rpx] p-x-[32rpx]">
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
    <view v-else-if="isBoundGoogleCode" class="relative mt-[62rpx] p-x-[32rpx]">
      <view class="mb-[24rpx] rounded-[16rpx] bg-white p-[32rpx] text-size-[24rpx] text-[#666] font-500 line-height-[40rpx]">
        谷歌验证器是一款动态口令工具，工作原理类似短信动态验证。绑定后每30s生成一个动态验证码，验证码可用于登录、提现、修改安全设置等操作的安全验证。
      </view>
      <view class="mb-[24rpx] rounded-[16rpx] bg-white p-[32rpx]">
        <view class="mb-[16rpx] font-size-[30rpx] text-[#333] font-bold line-height-[35rpx]">
          下载谷歌验证器APP
        </view>
        <view class="text-size-[24rpx] text-[#666] font-500 line-height-[40rpx]">
          谷歌验证器是一款动态口令工具，工作原理类似短信动态验证。绑定后每30s生成一个动态验证码，验证码可用于登录、提现、修改安全设置等操作的安全验证。
        </view>
      </view>
      <view class="mb-[24rpx] flex flex-col items-center justify-center rounded-[16rpx] bg-white p-[32rpx] text-size-[24rpx] text-[#666] font-500 line-height-[40rpx]">
        <view class="mb-[16rpx] text-size-[24rpx] text-[#666] font-500 line-height-[40rpx]">
          打开谷敏验证器，扫挡下方二维码或手动输入下述密钥添加验证令牌 <br> 保存二维码到手机或复制密钥到剪贴板可能会有安全风险，请您妥善保存。
        </view>
        <img :src="googleCode" class="h-[258rpx] w-[258rpx]" alt="" srcset="">
        <view class="mb-[44rpx] mt-[22rpx] text-size-[24rpx] text-[#666] font-500 line-height-[40rpx]">
          {{ googleCodeKey }}
        </view>
        <u-code-input
          v-model="verificationCode"
          :maxlength="6"
          :dot="false"
          mode="box"
          :space="10"
          font-size="24px"
          class="verification-code-input mb-[20rpx] w-full"
          :size="boxSize"
          @finish="onCodeFinish"
        />
      </view>
      <u-button
        class="mt-[56rpx]"
        text="下一步"
        color="#E53935" :custom-style="{ width: '100%', height: '88rpx', borderRadius: '8rpx', fontSize: '32rpx' }"
        @tap="handleClick"
      />
    </view>
  </c-container>
</template>

<script lang="ts" setup>
import { bindGoogleCode, getGoogleCode, verifyGoogleCode } from '@/api/user';
import background_banner from '@/static/images/home/background_banner.png';
import { computed, onMounted, ref } from 'vue';

const verificationCode = ref('');
const isCodeComplete = computed(() => verificationCode.value.length === 6);
const boxSize = ref(0);
const googleCode = ref('');
const isBoundGoogleCode = ref(false);
const googleCodeKey = ref('');
const isLoading = ref(false);
const bindGoogleCodeFn = async () => {
  await bindGoogleCode();
};
const getGoogleCodeFn = async () => {
  isLoading.value = true;
  try {
    const res = await getGoogleCode();
    if (res.code) {
      googleCode.value = res.code;
      isBoundGoogleCode.value = true;
      googleCodeKey.value = res.id;
      bindGoogleCodeFn();
    }
  }
  catch (error) {
    console.error('获取谷歌验证码失败:', error);
    uni.showToast({
      title: '获取谷歌验证码失败',
      icon: 'none',
    });
  }
  finally {
    isLoading.value = false;
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

const handleClick = async () => {
  // 校验google验证码并跳转home
  await verifyGoogleCode({
    code: verificationCode.value,
  });
};
const onCodeFinish = (code: string) => {
  console.log('验证码输入完成:', code);
};
const handleBack = () => {
  uni.navigateTo({
    url: '/pages/common/login/index',
  });
};
const onConfirm = async () => {
  if (isCodeComplete.value) {
    await verifyGoogleCode({
      code: verificationCode.value,
    });
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
    background-color: #F8F9FA !important; // 添加背景色
    border: none !important; // 移除边框
  }
}
</style>
