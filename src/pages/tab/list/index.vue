<template>
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
    <c-header title="历史订单" :show-back="false" class="relative z-10" />
    <!-- 顶部筛选栏 -->
    <view class="fixed-filter-bar flex items-center border-b border-gray-100 bg-white p-30rpx">
      <view class="mr-30rpx flex items-center text-28rpx text-gray-800" @click="togglePriceTypePopup">
        {{ currentPriceType }}
        <view class="ml-20rpx flex items-center">
          <u-icon name="arrow-down-fill" size="12rpx" color="#999" />
        </view>
      </view>
      <!-- <view class="mx-20rpx text-gray-300">
        |
      </view> -->
      <view class="mr-30rpx flex items-center text-28rpx text-gray-800" @click="toggleDirectionPopup">
        {{ currentDirection }}
        <view class="ml-20rpx flex items-center">
          <u-icon name="arrow-down-fill" size="12rpx" color="#999" />
        </view>
      </view>
      <view class="mr-30rpx flex items-center text-28rpx text-gray-800" @click="showDateRangePicker">
        {{ currentTime }}
        <view class="ml-20rpx flex items-center">
          <u-icon name="arrow-down-fill" size="12rpx" color="#999" />
        </view>
      </view>
      <view class="ml-auto">
        <u-icon name="list" size="24" color="#333" />
      </view>
    </view>

    <!-- 为筛选栏添加占位 -->
    <!-- <view class="h-200rpx" /> -->

    <!-- 价格类型选择弹出层 -->
    <u-popup
      :show="showPriceTypePopup"
      mode="top"
      :mask="true"
      :safe-area-inset-top="false"
      :z-index="20"
      @close="showPriceTypePopup = false"
    >
      <view class="bg-white">
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
      <view class="bg-white">
        <view class="border-b border-gray-100 px-30rpx py-24rpx text-28rpx" @click="selectDirection('买入')">
          买入
        </view>
        <view class="px-30rpx py-24rpx text-28rpx" @click="selectDirection('卖出')">
          卖出
        </view>
      </view>
    </u-popup>

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
        <view class="no-scrollbar w-[35%] overflow-x-auto text-center text-24rpx text-gray-600">
          <text class="whitespace-nowrap">
            手续费利润: {{ item.agent_fee ? formatNumber(item.agent_fee) : '0.00' }}
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
  <!-- 日期范围选择器 -->
  <u-calendar
    :show="showDatePickerPopup"
    mode="range"
    :top="88"
    :safe-area-inset-top="false"
    :month-num="12"
    :show-month="true"
    :show-subtitle="true"
    :show-month-btn="true"
    start-text="开始"
    end-text="结束"
    color="#2979ff"
    :max-date="maxDate"
    :min-date="minDate"
    :default-date="startDate ? startDate : ''"
    :default-end-date="endDate ? endDate : ''"
    :round="10"
    @confirm="confirmDateRange"
    @close="cancelDate"
  />
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

// 添加最大和最小日期限制
const maxDate = ref(formatDate(new Date()));
const minDate = ref((() => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return formatDate(date);
})());

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
function confirmDateRange(e: string[]) {
  console.log('e', e);
  const start = new Date(e[0]);
  const end = new Date(e[e.length - 1]);

  // 检查日期范围是否超过30天
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 30) {
    uni.showToast({
      title: '日期范围不能超过30天',
      icon: 'none',
    });
    return;
  }
  console.log('start', start);
  console.log('end', end);

  // 直接使用 formatDateForQuery 生成正确格式的日期字符串
  const formattedStartDate = formatDateForQuery(start);
  const formattedEndDate = formatDateForQuery(end);

  // 更新查询参数
  queryParams.value.create_begin = formattedStartDate;
  queryParams.value.create_end = formattedEndDate;

  // 保存日期值用于显示
  startDate.value = formattedStartDate;
  endDate.value = formattedEndDate;

  updateTimeDisplay();
  showDatePickerPopup.value = false;

  // 重置分页并刷新列表
  queryParams.value.current = 1;
  pagingRef.value?.reload();
}

// 修改 formatDateForQuery 函数确保返回正确格式
function formatDateForQuery(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`; // 返回格式如: 20250101
}

// 取消日期选择
function cancelDate() {
  showDatePickerPopup.value = false;
  // 如果之前没有选择过日期，清空日期相关参数
  if (!startDate.value || !endDate.value) {
    queryParams.value.create_begin = undefined;
    queryParams.value.create_end = undefined;
    currentTime.value = '时间';
  }
}

// 修改格式化日期函数，使其返回 yyyy-MM-dd 格式
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// 修改时间显示更新函数
function updateTimeDisplay() {
  if (startDate.value && endDate.value) {
    try {
      // 确保日期字符串格式正确
      const formatStart = startDate.value.replace(/\D/g, '');
      const formatEnd = endDate.value.replace(/\D/g, '');

      if (formatStart.length >= 8 && formatEnd.length >= 8) {
        const start = `${formatStart.slice(4, 6)}-${formatStart.slice(6, 8)}`;
        const end = `${formatEnd.slice(4, 6)}-${formatEnd.slice(6, 8)}`;
        currentTime.value = `${start} 至 ${end}`;
      }
      else {
        currentTime.value = '时间';
      }
    }
    catch (error) {
      console.error('日期格式化错误:', error);
      currentTime.value = '时间';
    }
  }
  else {
    currentTime.value = '时间';
    // 清空查询参数中的日期
    queryParams.value.create_begin = undefined;
    queryParams.value.create_end = undefined;
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
    [OrderStatus.ORDER_COMMITE]: 'bg-green-50 text-blue-600',
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
    [OrderStatus.ORDER_COMMITE]: '已挂单',
  };
  return statusMap[status] || status;
}
</script>

<style scoped>
/* .fixed-filter-bar {
  position: fixed;
  top: 90rpx;
  right: 0;
  left: 0;
  z-index: 9;
} */

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
