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
    <c-header title="历史订单" :show-back="false" />
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
          :class="item.order_side === 'BUY' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'"
        >
          {{ item.order_side === 'BUY' ? '买入' : '卖出' }}
        </view>
        <view class="ml-20rpx rounded-8rpx bg-orange-50 px-16rpx py-4rpx text-24rpx text-orange-500">
          {{ item.make_type === 'MARKET' ? '市价' : '限价' }}
        </view>
        <view class="ml-auto text-24rpx text-gray-500">
          {{ item.create_at }}
        </view>
      </view>

      <view class="flex border-b border-gray-50 p-30rpx">
        <view class="flex flex-1 flex-col">
          <view class="mb-10rpx text-36rpx text-gray-800 font-bold">
            {{ item.price }}
          </view>
          <view class="text-24rpx text-gray-500">
            委托价格({{ item.fee_symboml }})
          </view>
        </view>
        <view class="flex flex-1 flex-col">
          <view class="mb-10rpx text-36rpx text-gray-800 font-bold">
            {{ item.avg_price }}
          </view>
          <view class="text-24rpx text-gray-500">
            成交均价
          </view>
        </view>
        <view class="flex flex-1 flex-col">
          <view class="mb-10rpx text-36rpx text-gray-800 font-bold">
            {{ item.deal_amount }}/{{ item.amount }}
          </view>
          <view class="text-24rpx text-gray-500">
            成交/委托数量
          </view>
        </view>
      </view>

      <view class="flex items-center p-24rpx">
        <view class="mr-30rpx text-24rpx text-gray-600">
          交易手续费: {{ item.fee }}
        </view>
        <!-- <view class="ml-auto flex items-center text-28rpx" :class="getStatusClass(item.status)">
          {{ getStatusText(item.status) }}
          <u-icon name="arrow-right" :color="getStatusColor(item.status)" size="14" />
        </view> -->
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
  currentPriceType.value = `${type}委托`;
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
  // 将订单数据转为字符串，通过 URL 参数传递
  const orderData = encodeURIComponent(JSON.stringify(item));
  uni.navigateTo({
    url: `/pages/order/detail/index?orderData=${orderData}`,
  });
}

// function getStatusClass(status: string) {
//   // Implement the logic to determine the class based on the status
//   return '';
// }

// function getStatusText(status: string) {
//   // Implement the logic to determine the text based on the status
//   return status;
// }

// function getStatusColor(status: string) {
//   // Implement the logic to determine the color based on the status
//   return '#000';
// }
</script>
