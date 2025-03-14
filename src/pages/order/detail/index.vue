<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <view class="flex items-center border-b border-gray-100 bg-white p-30rpx">
      <view class="flex items-center" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#333" />
      </view>
      <view class="mx-auto text-32rpx font-bold">
        订单详情
      </view>
      <view class="flex items-center" @click="goToTrade">
        <text class="text-28rpx text-red-500">
          去交易
        </text>
        <u-icon name="arrow-right" size="14" color="#ff0000" />
      </view>
    </view>

    <!-- 交易对信息 -->
    <view class="flex items-center bg-white p-30rpx">
      <view class="text-36rpx font-bold">
        {{ orderDetail.symbol }}
      </view>
      <view
        class="ml-20rpx rounded-8rpx px-16rpx py-4rpx text-24rpx"
        :class="orderDetail.type === 'BUY' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'"
      >
        {{ orderDetail.type === 'BUY' ? '买入' : '卖出' }}
      </view>
      <view class="ml-20rpx rounded-8rpx bg-orange-50 px-16rpx py-4rpx text-24rpx text-orange-500">
        {{ orderDetail.orderType }}
      </view>
      <view class="ml-auto rounded-8rpx bg-green-50 px-16rpx py-4rpx text-24rpx text-green-500">
        全部完成
      </view>
    </view>

    <!-- 订单详情信息 -->
    <view class="mt-20rpx bg-white p-30rpx">
      <view class="border-b border-gray-50 pb-20rpx">
        <view class="mb-10rpx text-28rpx text-gray-500">
          委托价格(USDT)
        </view>
        <view class="text-36rpx font-bold">
          {{ orderDetail.price }}
        </view>
      </view>

      <view class="border-b border-gray-50 py-20rpx">
        <view class="mb-10rpx text-28rpx text-gray-500">
          成交均价(USDT)
        </view>
        <view class="text-36rpx font-bold">
          {{ orderDetail.avgPrice }}
        </view>
      </view>

      <view class="border-b border-gray-50 py-20rpx">
        <view class="mb-10rpx text-28rpx text-gray-500">
          委托数量(HSK)
        </view>
        <view class="text-36rpx font-bold">
          {{ orderDetail.amount.split('/')[1] }}
        </view>
      </view>

      <view class="border-b border-gray-50 py-20rpx">
        <view class="mb-10rpx text-28rpx text-gray-500">
          成交数量(HSK)
        </view>
        <view class="text-36rpx font-bold">
          {{ orderDetail.amount.split('/')[0] }}
        </view>
      </view>

      <view class="border-b border-gray-50 py-20rpx">
        <view class="mb-10rpx text-28rpx text-gray-500">
          成交额(USDT)
        </view>
        <view class="text-36rpx font-bold">
          {{ calculateTotal() }}
        </view>
      </view>

      <!-- 进度条 -->
      <view class="py-20rpx">
        <view class="relative h-8rpx w-full overflow-hidden rounded-full bg-gray-200">
          <view class="absolute left-0 top-0 h-full bg-red-500" :style="{ width: '98%' }" />
        </view>
        <view class="mt-8rpx flex justify-end">
          <text class="text-24rpx text-red-500">
            98%
          </text>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="mt-20rpx bg-white p-30rpx">
      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          订单号
        </text>
        <view class="flex items-center">
          <text class="text-28rpx">
            799175624317
          </text>
          <view class="ml-10rpx" @click="copyOrderId">
            <u-icon name="file-copy" size="20" color="#999" />
          </view>
        </view>
      </view>

      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          创建时间
        </text>
        <text class="text-28rpx">
          {{ orderDetail.time }}
        </text>
      </view>

      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          结束时间
        </text>
        <text class="text-28rpx">
          {{ orderDetail.time }}
        </text>
      </view>

      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          手续费(HSK)
        </text>
        <text class="text-28rpx">
          {{ orderDetail.fee }}
        </text>
      </view>

      <view class="flex items-center justify-between py-20rpx">
        <text class="text-28rpx text-gray-600">
          以点卡抵扣手续费
        </text>
        <text class="text-28rpx">
          {{ orderDetail.feeProfit }}
        </text>
      </view>
    </view>

    <!-- 成交记录 -->
    <view class="mt-20rpx bg-white">
      <view class="border-b border-gray-100 p-30rpx">
        <text class="text-32rpx font-bold">
          成交记录
        </text>
      </view>

      <view v-for="(record, index) in tradeRecords" :key="index" class="border-b border-gray-50 p-30rpx">
        <view class="mb-20rpx flex items-center justify-between">
          <text class="text-28rpx text-gray-600">
            日期
          </text>
          <text class="text-28rpx">
            {{ record.date }}
          </text>
        </view>

        <view class="mb-20rpx flex items-center justify-between">
          <text class="text-28rpx text-gray-600">
            角色/订单ID
          </text>
          <view class="flex items-center">
            <text class="text-28rpx">
              {{ record.role }}
            </text>
            <u-icon name="info-circle" size="16" color="#999" class="ml-10rpx" />
          </view>
        </view>

        <view class="mb-20rpx flex items-center justify-between">
          <text class="text-28rpx text-gray-600">
            价格(USDT)
          </text>
          <text class="text-28rpx">
            {{ record.price }}
          </text>
        </view>

        <view class="mb-20rpx flex items-center justify-between">
          <text class="text-28rpx text-gray-600">
            成交量(HSK)
          </text>
          <text class="text-28rpx">
            {{ record.amount }}
          </text>
        </view>

        <view class="mb-20rpx flex items-center justify-between">
          <text class="text-28rpx text-gray-600">
            成交额(USDT)
          </text>
          <text class="text-28rpx">
            {{ record.total }}
          </text>
        </view>

        <view class="flex items-center justify-between">
          <text class="text-28rpx text-gray-600">
            手续费(HSK)
          </text>
          <text class="text-28rpx">
            {{ record.fee }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { OrderItem } from '../../tab/list/types';
import { onMounted, ref } from 'vue';

// 获取路由参数
const orderDetail = ref<OrderItem>({} as OrderItem);
const tradeRecords = ref([
  {
    date: '2025-02-25 08:56:28',
    role: 'Maker/1346090479',
    price: '0.7288',
    amount: '1,269.18',
    total: '924.978384',
    fee: '1.26918',
  },
  {
    date: '2025-02-25 08:56:28',
    role: 'Maker/1346090479',
    price: '0.7288',
    amount: '1,269.18',
    total: '924.978384',
    fee: '1.26918',
  },
]);

onMounted(() => {
  // const eventChannel = getOpenerEventChannel();
  const query = uni.getSystemInfoSync().platform === 'devtools'
    ? { orderData: '' }
    : uni.$u.route.query;

  if (query && query.orderData) {
    try {
      orderDetail.value = JSON.parse(decodeURIComponent(query.orderData));
    }
    catch (e) {
      console.error('解析订单数据失败', e);
    }
  }
});

// 计算成交总额
function calculateTotal() {
  const amount = Number.parseFloat(orderDetail.value.amount.split('/')[0].replace(/,/g, ''));
  const price = Number.parseFloat(orderDetail.value.avgPrice);
  return (amount * price).toFixed(6);
}

// 返回上一页
function goBack() {
  uni.navigateBack();
}

// 跳转到交易页面
function goToTrade() {
  uni.switchTab({
    url: '/pages/tab/trade/index',
  });
}

// 复制订单ID
function copyOrderId() {
  uni.setClipboardData({
    data: '799175624317',
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'none',
      });
    },
  });
}
</script>
