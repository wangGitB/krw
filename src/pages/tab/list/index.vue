<template>
  <c-header title="历史订单" :show-back="false" class="fixed left-0 right-0 top-0 z-10" />
  <z-paging
    ref="pagingRef" v-model="dataList"
    :auto-height="true"
    language="zh-cn"
    empty-view-text="暂无数据"
    loading-more-no-more-text="没有更多数据了"
    no-more-data-text="没有更多数据了"
    loading-more-loading-text="加载中..."
    loading-more-failed-text="加载失败，点击重试"
    refresher-default-text="下拉刷新"
    refresher-pulling-text="松开刷新"
    refresher-refreshing-text="刷新中..."
    class="bg-white"
    @query="queryList"
  >
    <!-- 顶部筛选栏 -->
    <view class="fixed-filter-bar flex items-center border-b border-gray-100 bg-white p-30rpx">
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

    <!-- 为筛选栏添加占位 -->
    <view class="h-200rpx" />

    <!-- 价格类型选择弹出层 -->
    <u-popup
      :show="showPriceTypePopup"
      mode="top"
      :mask="true"
      :safe-area-inset-top="false"
      :z-index="20"
      @close="showPriceTypePopup = false"
    >
      <view class="mt-[88rpx] bg-white">
        <view class="border-b border-gray-100 px-30rpx py-24rpx text-28rpx" @click="selectPriceType('市价')">
          市价
        </view>
        <view class="px-30rpx py-24rpx text-28rpx" @click="selectPriceType('限价')">
          限价
        </view>
      </view>
    </u-popup>

    <!-- 方向选择弹出层 -->
    <u-popup
      :show="showDirectionPopup"
      mode="top"
      :mask="true"
      :safe-area-inset-top="false"
      :z-index="20"
      @close="showDirectionPopup = false"
    >
      <view class="mt-[88rpx] bg-white">
        <view class="border-b border-gray-100 px-30rpx py-24rpx text-28rpx" @click="selectDirection('买入')">
          买入
        </view>
        <view class="px-30rpx py-24rpx text-28rpx" @click="selectDirection('卖出')">
          卖出
        </view>
      </view>
    </u-popup>

    <!-- 日期范围选择器 -->
    <u-calendar
      :show="showDatePickerPopup"
      mode="range"
      :z-index="20"
      :top="88"
      :safe-area-inset-top="false"
      :month-num="12"
      :show-month="true"
      :show-subtitle="true"
      :show-month-btn="true"
      start-text="开始"
      end-text="结束"
      color="#2979ff"
      :week-text="['日', '一', '二', '三', '四', '五', '六']"
      @confirm="confirmDateRange"
      @close="cancelDate"
    />

    <!-- 订单列表 -->
    <view
      v-for="(item, index) in dataList"
      :key="index"
      class="m-20rpx overflow-hidden rounded-16rpx bg-#f8f9fa shadow-sm"
      @click="goToOrderDetail(item)"
    >
      <view class="flex items-center border-b border-gray-50 p-24rpx">
        <view class="text-32rpx text-gray-800 font-bold">
          {{ item.symbol }}
        </view>
        <view
          class="ml-20rpx rounded-8rpx px-16rpx py-4rpx text-size-24rpx"
          :style="{
            color: item.order_side === 'BUY' ? '#E6302F' : '#40AE36',
            border: item.order_side === 'BUY' ? '1px solid #E6302F' : '1px solid #40AE36',
          }"
        >
          {{ item.order_side === 'BUY' ? '买入' : '卖出' }}
        </view>
        <view
          class="ml-20rpx rounded-8rpx px-16rpx py-4rpx text-24rpx"
          :style="{
            color: item.make_type === 'MARKET' ? '#E6302F' : '#F7B966',
            border: item.make_type === 'MARKET' ? '1px solid #E6302F' : '1px solid #F7B966',
          }"
        >
          {{ item.make_type === 'MARKET' ? '市价' : '限价' }}
        </view>
        <view class="ml-auto text-24rpx text-gray-500">
          {{ item.create_at }}
        </view>
      </view>

      <view class="flex border-b border-gray-50 p-30rpx">
        <view class="flex flex-1 flex-col items-center">
          <view class="mb-10rpx text-36rpx text-gray-800 font-bold">
            {{ item.price || '--' }}
          </view>
          <view class="text-24rpx text-gray-500">
            {{ item.make_type === 'MARKET' ? '市价委托' : '委托价格 (USDT)' }}
          </view>
        </view>
        <view class="flex flex-1 flex-col items-center">
          <view class="mb-10rpx text-36rpx text-gray-800 font-bold">
            {{ item.avg_price || '--' }}
          </view>
          <view class="text-24rpx text-gray-500">
            成交均价 (USDT)
          </view>
        </view>
        <view class="flex flex-1 flex-col items-center">
          <view class="mb-10rpx flex items-center text-36rpx text-gray-800 font-bold">
            <text class="shrink-0">
              {{ item.deal_amount || '0' }}
            </text>
            <text class="shrink-0">
              /
            </text>
            <text class="shrink-0">
              {{ item.amount || '0' }}
            </text>
          </view>
          <view class="whitespace-nowrap text-24rpx text-gray-500">
            成交/委托数量 ({{ item.symbol.split('/')[1] }})
          </view>
        </view>
      </view>

      <view class="flex items-center justify-between p-24rpx">
        <view class="w-[30%] truncate text-24rpx text-gray-600">
          <text class="whitespace-nowrap">
            交易手续费: {{ formatNumber(item.fee) }}
          </text>
        </view>
        <!-- TODO: 手续费利润 -->
        <view class="no-scrollbar w-[35%] overflow-x-auto text-center text-24rpx text-gray-600">
          <text class="whitespace-nowrap">
            手续费利润: {{ item.volume ? formatNumber(item.volume) : '0.00' }}
          </text>
        </view>
        <view class="w-[30%] text-right">
          <text :class="getStatusClass(item.status)" class="inline-block whitespace-nowrap rounded-md px-16rpx py-4rpx text-24rpx">
            {{ getStatusText(item.status) }}
          </text>
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
import { getOrderList } from '@/api/list';
import { ref } from 'vue';
import { OrderStatus } from './types';
import { formatNumber } from './utils';

const pagingRef = ref<InstanceType<typeof zPaging> | null>(null);
const dataList = ref<OrderItem[]>([]);
const showPriceTypePopup = ref(false);
const showDirectionPopup = ref(false);
const showDatePickerPopup = ref(false);
const currentPriceType = ref('市价 | 委托');
const currentDirection = ref('方向');
const currentTime = ref('时间');
const startDate = ref('');
const endDate = ref('');

// 修改查询参数的类型定义
interface QueryParams {
  order_side?: string;
  make_type?: string;
  create_begin?: string;
  create_end?: string;
  pageSize: number;
  current: number;
  status?: number;
}

const queryParams = ref<QueryParams>({
  pageSize: 10,
  current: 1,
  status: 2, // 默认查询所有订单
});

// 切换价格类型弹出层
function togglePriceTypePopup() {
  showPriceTypePopup.value = !showPriceTypePopup.value;
  if (showPriceTypePopup.value) {
    showDirectionPopup.value = false;
  }
}

// 选择价格类型
function selectPriceType(type: string) {
  currentPriceType.value = `${type} | 委托`;
  showPriceTypePopup.value = false;
  queryParams.value.make_type = type === '市价' ? 'MARKET' : 'LIMIT';
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
  queryParams.value.order_side = direction === '买入' ? 'BUY' : 'SELL';
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
  const start = new Date(e.startDate);
  const end = new Date(e.endDate);

  queryParams.value.create_begin = formatDate(start);
  queryParams.value.create_end = formatDate(end);

  startDate.value = queryParams.value.create_begin;
  endDate.value = queryParams.value.create_end;

  updateTimeDisplay();
  showDatePickerPopup.value = false;
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

async function queryList(pageNo: number, pageSize: number) {
  queryParams.value.current = pageNo;
  queryParams.value.pageSize = pageSize;

  try {
    const res = await getOrderList(queryParams.value);
    if (res?.records) {
      pagingRef.value?.complete(res.records);
    }
    else {
      pagingRef.value?.complete([]);
    }
  }
  catch (error) {
    console.error('获取订单列表失败:', error);
    pagingRef.value?.complete(false);
  }
}

function goToOrderDetail(item: OrderItem) {
  uni.navigateTo({
    url: `/pages/order/detail/index?id=${item.id}`,
  });
}

// 修改状态样式处理函数
function getStatusClass(status: OrderStatus) {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.INIT]: 'bg-blue-50 text-blue-600',
    [OrderStatus.MAKE_ORDER || OrderStatus.MAKE_ORDER]: 'bg-blue-50 text-blue-600',
    [OrderStatus.ORDER_CANCELING]: 'bg-yellow-50 text-yellow-600',
    [OrderStatus.ORDER_ALL_CANCELED]: 'bg-gray-50 text-gray-600',
    [OrderStatus.ORDER_PARTIALLY_CANCELED]: 'bg-orange-50 text-orange-600',
    [OrderStatus.ORDER_FINISHED]: 'bg-green-50 text-green-600',
  };
  return statusMap[status] || 'bg-gray-50 text-gray-600';
}

// 订单状态文本显示函数
function getStatusText(status: OrderStatus) {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.INIT]: '处理中',
    [OrderStatus.MAKE_ORDER || OrderStatus.MAKE_ORDER]: '取消中',
    [OrderStatus.ORDER_CANCELING]: '取消中',
    [OrderStatus.ORDER_ALL_CANCELED]: '全部取消',
    [OrderStatus.ORDER_PARTIALLY_CANCELED]: '部分取消',
    [OrderStatus.ORDER_FINISHED]: '全部成交',
  };
  return statusMap[status] || status;
}
</script>

<style scoped>
.fixed-filter-bar {
  position: fixed;
  top: 90rpx;
  right: 0;
  left: 0;
  z-index: 9;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
