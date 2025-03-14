<template>
  <z-paging
    ref="pagingRef" v-model="dataList" fixed
    language="zh-cn"
    empty-view-text="暂无数据"
    loading-more-no-more-text="没有更多数据了"
    no-more-data-text="没有更多数据了"
    loading-more-loading-text="加载中..."
    loading-more-failed-text="加载失败，点击重试"
    refresher-default-text="下拉刷新"
    refresher-pulling-text="松开刷新"
    refresher-refreshing-text="刷新中..."
    @query="queryList"
  >
    <!-- 顶部筛选栏 -->
    <view class="flex items-center border-b border-gray-100 bg-white p-30rpx">
      <view class="mr-30rpx flex items-center text-28rpx text-gray-800" @click="togglePriceTypePopup">
        {{ currentPriceType }}
        <view class="ml-20rpx flex items-center">
          <u-icon name="arrow-down-fill" size="14" color="#999" />
        </view>
      </view>
      <view class="mx-20rpx text-gray-300">
        |
      </view>
      <view class="mr-30rpx flex items-center text-28rpx text-gray-800" @click="toggleDirectionPopup">
        {{ currentDirection }}
        <view class="ml-20rpx flex items-center">
          <u-icon name="arrow-down-fill" size="14" color="#999" />
        </view>
      </view>
      <view class="mr-30rpx flex items-center text-28rpx text-gray-800" @click="showDateRangePicker">
        {{ currentTime }}
        <view class="ml-20rpx flex items-center">
          <u-icon name="arrow-down-fill" size="14" color="#999" />
        </view>
      </view>
      <view class="ml-auto">
        <u-icon name="list" size="24" color="#333" />
      </view>
    </view>

    <!-- 价格类型选择弹出层 -->
    <view v-if="showPriceTypePopup" class="absolute left-0 top-90rpx z-100 w-240rpx bg-white shadow-md">
      <view class="border-b border-gray-100 px-30rpx py-24rpx text-28rpx" @click="selectPriceType('市价')">
        市价
      </view>
      <view class="px-30rpx py-24rpx text-28rpx" @click="selectPriceType('限价')">
        限价
      </view>
    </view>

    <!-- 方向选择弹出层 -->
    <view v-if="showDirectionPopup" class="absolute left-240rpx top-90rpx z-100 w-240rpx bg-white shadow-md">
      <view class="border-b border-gray-100 px-30rpx py-24rpx text-28rpx" @click="selectDirection('买入')">
        买入
      </view>
      <view class="px-30rpx py-24rpx text-28rpx" @click="selectDirection('卖出')">
        卖出
      </view>
    </view>

    <!-- 日期范围选择器 -->
    <u-calendar
      :show="showDatePickerPopup"
      mode="range"
      :month-num="12"
      :show-month="true"
      :show-subtitle="true"
      :show-month-btn="true"
      start-text="开始"
      end-text="结束"
      color="#2979ff"
      @confirm="confirmDateRange"
      @close="cancelDate"
    />

    <!-- 订单列表 -->
    <view
      v-for="(item, index) in dataList"
      :key="index"
      class="m-20rpx overflow-hidden rounded-16rpx bg-white shadow-sm"
      @click="goToOrderDetail(item)"
    >
      <view class="flex items-center border-b border-gray-50 p-24rpx">
        <view class="text-32rpx text-gray-800 font-bold">
          {{ item.symbol }}
        </view>
        <view
          class="ml-20rpx rounded-8rpx px-16rpx py-4rpx text-24rpx"
          :class="item.type === 'BUY' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'"
        >
          {{ item.type === 'BUY' ? '买入' : '卖出' }}
        </view>
        <view class="ml-20rpx rounded-8rpx bg-orange-50 px-16rpx py-4rpx text-24rpx text-orange-500">
          {{ item.orderType }}
        </view>
        <view class="ml-auto text-24rpx text-gray-500">
          {{ item.time }}
        </view>
      </view>

      <view class="flex border-b border-gray-50 p-30rpx">
        <view class="flex flex-1 flex-col">
          <view class="mb-10rpx text-36rpx text-gray-800 font-bold">
            {{ item.price }}
          </view>
          <view class="text-24rpx text-gray-500">
            委托价格(USDT)
          </view>
        </view>
        <view class="flex flex-1 flex-col">
          <view class="mb-10rpx text-36rpx text-gray-800 font-bold">
            {{ item.avgPrice }}
          </view>
          <view class="text-24rpx text-gray-500">
            成交均价
          </view>
        </view>
        <view class="flex flex-1 flex-col">
          <view class="mb-10rpx text-36rpx text-gray-800 font-bold">
            {{ item.amount }}
          </view>
          <view class="text-24rpx text-gray-500">
            成交/委托数量(HSK)
          </view>
        </view>
      </view>

      <view class="flex items-center p-24rpx">
        <view class="mr-30rpx text-24rpx text-gray-600">
          交易手续费: {{ item.fee }}
        </view>
        <view class="text-24rpx text-gray-600">
          手续费抵扣: {{ item.feeProfit }}
        </view>
        <view class="ml-auto flex items-center text-28rpx text-red-500">
          {{ item.status }} <u-icon name="arrow-right" color="#ff0000" size="14" />
        </view>
      </view>
    </view>

    <!-- 自定义底部 -->
    <template #loadingMoreNoMoreLine>
      <view class="py-30rpx text-center text-28rpx text-gray-500">
        没有更多数据了
      </view>
    </template>
  </z-paging>
</template>

<script setup lang="ts">
import type { OrderItem } from './types';
import { ref } from 'vue';

const pagingRef = ref<InstanceType<typeof zPaging> | null>(null);
const dataList = ref<OrderItem[]>([]);
const showPriceTypePopup = ref(false);
const showDirectionPopup = ref(false);
const showDatePickerPopup = ref(false);
const currentPriceType = ref('市价委托');
const currentDirection = ref('方向');
const currentTime = ref('时间');
const startDate = ref('');
const endDate = ref('');

// 切换价格类型弹出层
function togglePriceTypePopup() {
  showPriceTypePopup.value = !showPriceTypePopup.value;
  if (showPriceTypePopup.value) {
    showDirectionPopup.value = false;
  }
}

// 选择价格类型
function selectPriceType(type: string) {
  currentPriceType.value = `${type}委托`;
  showPriceTypePopup.value = false;
  // 重新加载数据
  pagingRef.value?.reload();
}

// 切换方向弹出层
function toggleDirectionPopup() {
  showDirectionPopup.value = !showDirectionPopup.value;
  if (showDirectionPopup.value) {
    showPriceTypePopup.value = false;
  }
}

// 选择方向
function selectDirection(direction: string) {
  currentDirection.value = direction;
  showDirectionPopup.value = false;
  // 重新加载数据
  pagingRef.value?.reload();
}

// 显示日期范围选择器
function showDateRangePicker() {
  showDatePickerPopup.value = true;
  showPriceTypePopup.value = false;
  showDirectionPopup.value = false;
}

// 确认日期范围选择
function confirmDateRange(e: { startDate: string; endDate: string }) {
  // 格式化日期
  const start = new Date(e.startDate);
  const end = new Date(e.endDate);

  startDate.value = formatDate(start);
  endDate.value = formatDate(end);

  // 更新显示的时间范围
  updateTimeDisplay();
  showDatePickerPopup.value = false;

  // 重新加载数据
  pagingRef.value?.reload();
}

// 取消日期选择
function cancelDate() {
  showDatePickerPopup.value = false;
}

// 格式化日期
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

// 更新时间显示
function updateTimeDisplay() {
  if (startDate.value && endDate.value) {
    currentTime.value = `${startDate.value}-${endDate.value}`;
  }
  else {
    currentTime.value = '时间';
  }
}

// 模拟订单数据
function getMockOrders(): OrderItem[] {
  // 根据当前选择的方向和时间筛选数据
  const allOrders: OrderItem[] = [
    {
      symbol: 'HSK/USDT',
      type: 'SELL',
      orderType: '限价',
      time: '2025-02-28 16:26:22',
      price: '0.7288',
      avgPrice: '0.7288',
      amount: '1.372.12/1.372.12',
      fee: '1,000',
      feeProfit: '1,000',
      status: '完全成交',
    },
    {
      symbol: 'HSK/USDT',
      type: 'BUY',
      orderType: '限价',
      time: '2025-02-28 16:26:22',
      price: '0.7288',
      avgPrice: '0.7288',
      amount: '1.372.12/1.372.12',
      fee: '1,000',
      feeProfit: '1,000',
      status: '完全成交',
    },
    {
      symbol: 'HSK/USDT',
      type: 'SELL',
      orderType: '限价',
      time: '2025-02-28 16:26:22',
      price: '0.7288',
      avgPrice: '0.7288',
      amount: '1.372.12/1.372.12',
      fee: '1,000',
      feeProfit: '1,000',
      status: '完全成交',
    },
  ];

  // 先按方向筛选
  let filteredOrders = allOrders;
  if (currentDirection.value !== '方向') {
    const directionType = currentDirection.value === '买入' ? 'BUY' : 'SELL';
    filteredOrders = allOrders.filter(order => order.type === directionType);
  }

  // 再按时间筛选
  if (startDate.value || endDate.value) {
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = order.time.replace(/[- :]/g, '').substring(0, 8);

      if (startDate.value && endDate.value) {
        return orderDate >= startDate.value && orderDate <= endDate.value;
      }
      else if (startDate.value) {
        return orderDate >= startDate.value;
      }
      else if (endDate.value) {
        return orderDate <= endDate.value;
      }

      return true;
    });
  }

  return filteredOrders;
}

function queryList(pageNo: number, pageSize: number) {
  console.log('[ pageNo ] >', pageNo);
  console.log('[ pageSize ] >', pageSize);

  // 模拟网络请求
  setTimeout(() => {
    const mockData = getMockOrders();
    pagingRef.value?.complete(mockData);
  }, 1000);
}

function goToOrderDetail(item: OrderItem) {
  // 将订单数据转为字符串，通过 URL 参数传递
  const orderData = encodeURIComponent(JSON.stringify(item));
  uni.navigateTo({
    url: `/pages/order/detail/index?orderData=${orderData}`,
  });
}

const language = uni.getSystemInfoSync().language;
console.log('[ language ] >', language);
</script>

<style lang="scss" scoped>
/* 移除所有旧样式，使用UnoCSS原子类替代 */
</style>
