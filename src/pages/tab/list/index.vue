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
    <view class="filter-bar">
      <view class="filter-item" @click="togglePriceTypePopup">
        {{ currentPriceType }}
        <u-icon name="arrow-down-fill" size="14" color="#999" />
      </view>
      <view class="divider">
        |
      </view>
      <view class="filter-item" @click="toggleDirectionPopup">
        {{ currentDirection }}
        <u-icon name="arrow-down-fill" size="14" color="#999" />
      </view>
      <view class="filter-item" @click="showDateRangePicker">
        {{ currentTime }}
        <u-icon name="arrow-down-fill" size="14" color="#999" />
      </view>
      <view class="filter-icon">
        <u-icon name="list" size="24" color="#333" />
      </view>
    </view>

    <!-- 价格类型选择弹出层 -->
    <view v-if="showPriceTypePopup" class="price-type-popup">
      <view class="popup-item" @click="selectPriceType('市价')">
        市价
      </view>
      <view class="popup-item" @click="selectPriceType('限价')">
        限价
      </view>
    </view>

    <!-- 方向选择弹出层 -->
    <view v-if="showDirectionPopup" class="direction-popup">
      <view class="popup-item" @click="selectDirection('买入')">
        买入
      </view>
      <view class="popup-item" @click="selectDirection('卖出')">
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
    <view v-for="(item, index) in dataList" :key="index" class="order-item">
      <view class="order-header">
        <view class="order-pair">
          {{ item.symbol }}
        </view>
        <view class="order-type" :class="[item.type === 'BUY' ? 'buy-type' : 'sell-type']">
          {{ item.type === 'BUY' ? '买入' : '卖出' }}
        </view>
        <view class="order-type-tag">
          {{ item.orderType }}
        </view>
        <view class="order-time">
          {{ item.time }}
        </view>
      </view>

      <view class="order-content">
        <view class="order-price-col">
          <view class="price-value">
            {{ item.price }}
          </view>
          <view class="price-label">
            委托价格(USDT)
          </view>
        </view>
        <view class="order-price-col">
          <view class="price-value">
            {{ item.avgPrice }}
          </view>
          <view class="price-label">
            成交均价
          </view>
        </view>
        <view class="order-amount-col">
          <view class="amount-value">
            {{ item.amount }}
          </view>
          <view class="amount-label">
            成交/委托数量(HSK)
          </view>
        </view>
      </view>

      <view class="order-footer">
        <view class="fee-info">
          交易手续费: {{ item.fee }}
        </view>
        <view class="fee-info">
          手续费抵扣: {{ item.feeProfit }}
        </view>
        <view class="order-status">
          {{ item.status }} <u-icon name="arrow-right" color="#ff0000" size="14" />
        </view>
      </view>
    </view>

    <!-- 自定义底部 -->
    <template #loadingMoreNoMoreLine>
      <view class="custom-no-more">
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
const language = uni.getSystemInfoSync().language;
console.log('[ language ] >', language);
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.filter-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
  font-size: 14px;
  color: #333;
}

.divider {
  margin: 0 10px;
  color: #ddd;
}

.filter-icon {
  margin-left: auto;
}

.price-type-popup {
  position: absolute;
  top: 45px;
  left: 0;
  z-index: 100;
  width: 120px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
}

.popup-item {
  padding: 12px 15px;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
}

.order-item {
  margin: 10px;
  overflow: hidden;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 5%);
}

.order-header {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f5f5f5;
}

.order-pair {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.order-type {
  padding: 2px 8px;
  margin-left: 10px;
  font-size: 12px;
  border-radius: 4px;
}

.buy-type {
  color: #52c41a;
  background-color: rgb(82 196 26 / 10%);
}

.sell-type {
  color: #ff4d4f;
  background-color: rgb(255 77 79 / 10%);
}

.order-type-tag {
  padding: 2px 8px;
  margin-left: 10px;
  font-size: 12px;
  color: #ff9800;
  background-color: rgb(255 152 0 / 10%);
  border-radius: 4px;
}

.order-time {
  margin-left: auto;
  font-size: 12px;
  color: #999;
}

.order-content {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.order-price-col, .order-amount-col {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.price-value, .amount-value {
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.price-label, .amount-label {
  font-size: 12px;
  color: #999;
}

.order-footer {
  display: flex;
  align-items: center;
  padding: 12px 15px;
}

.fee-info {
  margin-right: 15px;
  font-size: 12px;
  color: #666;
}

.order-status {
  display: flex;
  align-items: center;
  margin-left: auto;
  font-size: 14px;
  color: #ff4d4f;
}

.direction-popup {
  position: absolute;
  top: 45px;
  left: 120px; /* 调整位置，使其在方向筛选下方 */
  z-index: 100;
  width: 120px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
}

.custom-no-more {
  padding: 15px 0;
  font-size: 14px;
  color: #999;
  text-align: center;
}
</style>
