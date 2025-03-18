<template>
  <c-header title="充提历史" @back="goBack" />
  <c-container class="px-28rpx">
    <!-- 全局loading -->
    <view v-if="loading" class="global-loading">
      <view class="loading-spinner" />
      <text class="loading-text">
        加载中...
      </text>
    </view>

    <view class="history-container">
      <!-- 筛选选项 -->
      <view class="filter-container">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="filter-tab"
          :class="{ active: currentTab === tab.value }"
          @click="handleTabChange(tab.value)"
        >
          {{ tab.label }}
        </view>
      </view>

      <!-- 使用z-paging替换原列表 -->
      <z-paging
        ref="paging"
        v-model="recordList"
        language="zh-cn"
        :fixed="false"
        :show-scrollbar="true"
        :auto-height="true"
        :auto-show-back-to-top="true"
        :refresher-enabled="true"
        :auto="true"
        empty-view-text="暂无数据"
        loading-more-no-more-text="没有更多数据了"
        no-more-data-text="没有更多数据了"
        loading-more-loading-text="加载中..."
        loading-more-failed-text="加载失败，点击重试"
        refresher-default-text="下拉刷新"
        refresher-pulling-text="松开刷新"
        refresher-refreshing-text="刷新中..."
        @query="queryRecordList"
        @refresher-refresh="onRefresh"
      >
        <view class="record-list">
          <view v-for="(item, index) in recordList" :key="index" class="record-item">
            <!-- 第一行：币种和金额 -->
            <view class="record-header">
              <text class="symbol">
                {{ item.symbol }}
              </text>
              <text class="amount">
                {{ item.amount }}
              </text>
            </view>

            <!-- 第二行：日期和状态 -->
            <view class="record-datetime">
              <text class="date">
                {{ formatDate(item.create_at) }}
              </text>
              <text class="status-tag" :class="getStatusClass(item.status, 'bg')">
                {{ getStatusText(item.status) }}
              </text>
            </view>

            <!-- 第三行：账户和费用信息 -->
            <view class="record-details justify-between">
              <text class="detail-item">
                {{ item.flow_type === 'Withdraw' ? '提现账户:' : '充值账户:' }} {{ item.nick_name }}
              </text>
              <text class="detail-item">
                交易手续费: {{ item.fee }}
              </text>
            </view>
          </view>
        </view>
      </z-paging>
    </view>
  </c-container>
</template>

<script lang="ts" setup>
import { type FundFlowHistoryItem, withdrawalHistory, type WithdrawalHistoryReq } from '@/api/withdraw/index';
import { onMounted, ref } from 'vue';

// 筛选标签
const tabs = [
  { label: '全部', value: '' },
  { label: '充值', value: 'Deposit' },
  { label: '提现', value: 'Withdraw' },
];

const currentTab = ref('');
const recordList = ref<FundFlowHistoryItem[]>([]);
const paging = ref<any>(null);
const loading = ref(false); // 全局loading状态

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 获取状态样式类
const getStatusClass = (status: string, type: 'text' | 'bg') => {
  if (status === 'Success' || status === 'Reviewed') {
    return type === 'text' ? 'success-text' : 'success-status';
  }
  else if (status === 'Fail') {
    return type === 'text' ? 'failed-text' : 'failed-status';
  }
  else {
    return type === 'text' ? 'pending-text' : 'pending-status';
  }
};

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    Init: '处理中',
    Processing: '处理中',
    Success: '已完成',
    Fail: '已失败',
    Reviewed: '已审核',
  };

  return statusMap[status] || status;
};

// 刷新事件处理
const onRefresh = () => {
  // 下拉刷新时z-paging会自动调用queryRecordList
};

// 查询交易记录 - 配合z-paging使用
const queryRecordList = async (pageNo: number, pageSize: number) => {
  // 第一页数据加载时显示全局loading
  if (pageNo === 1) {
    loading.value = true;
  }

  try {
    const params: WithdrawalHistoryReq = {
      current: pageNo,
      pageSize,
    };

    if (currentTab.value) {
      params.flow_type = currentTab.value;
    }

    const res = await withdrawalHistory(params);

    // 通知z-paging加载结果
    if (res && res.records) {
      paging.value.complete(res.records);
    }
    else {
      paging.value.complete([]);
    }
  }
  catch (error) {
    console.error('获取交易记录失败', error);
    paging.value.complete(false);

    uni.showToast({
      title: '获取交易记录失败',
      icon: 'none',
    });
  }
  finally {
    // 无论成功失败，都关闭全局loading
    loading.value = false;
  }
};

// 切换标签
const handleTabChange = (tab: string) => {
  if (currentTab.value === tab) return;

  currentTab.value = tab;
  loading.value = true; // 切换标签时显示loading

  // 刷新列表
  if (paging.value) {
    paging.value.reload();
  }
};

// 返回
const goBack = () => {
  uni.switchTab({
    url: '/pages/tab/withdrawal/index',
  });
};

onMounted(() => {
  // 页面加载时显示loading
  loading.value = true;
  // z-paging组件会自动调用queryRecordList加载第一页数据
});
</script>

<style lang="scss" scoped>
.history-container {
  padding: 20rpx 0;
  height: calc(100vh - 100rpx);
  display: flex;
  flex-direction: column;
}

.filter-container {
  display: flex;
  margin-bottom: 20rpx;
  padding: 10rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
}

.filter-tab {
  flex: 1;
  padding: 16rpx 0;
  font-size: 28rpx;
  text-align: center;
  color: #666;
  border-radius: 8rpx;
  transition: all 0.3s;

  &.active {
    color: #333;
    font-weight: 500;
    background-color: #fff;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  }
}

.record-list {
  width: 100%;
}

.record-item {
  position: relative;
  margin-bottom: 20rpx;
  padding: 24rpx;
  background-color: #fff;
  border-radius: 8rpx;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.symbol {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.amount {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.record-datetime {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.date {
  font-size: 22rpx;
  color: #999;
}

.status-tag {
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 4rpx;
}

.record-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22rpx;
  color: #666;
}

.detail-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 全局loading样式 */
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #e63946;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-status {
  color: #4cd964;
  background-color: rgba(76, 217, 100, 0.1);
}

.failed-status {
  color: #ff3b30;
  background-color: rgba(255, 59, 48, 0.1);
}

.pending-status {
  color: #f0ad4e;
  background-color: rgba(240, 173, 78, 0.1);
}

.success-text {
  color: #4cd964;
}

.failed-text {
  color: #ff3b30;
}

.pending-text {
  color: #f0ad4e;
}
</style>
