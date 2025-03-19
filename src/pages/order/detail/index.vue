<template>
  <c-header title="订单详情" @back="goBack" />
  <c-container class="px-28rpx">
    <!-- 交易对信息 -->
    <view class="my-20rpx rounded-md bg-white p-30rpx">
      <view class="flex items-center justify-between">
        <view class="flex items-center">
          <view class="text-36rpx font-bold">
            {{ orderDetail.symbol }}
          </view>
          <view
            class="ml-20rpx rounded-8rpx px-16rpx py-4rpx text-24rpx"
            :class="orderDetail.order_side === 'BUY' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'"
          >
            {{ orderDetail.order_side === 'BUY' ? '买入' : '卖出' }}
          </view>
          <view class="ml-20rpx rounded-8rpx bg-orange-50 px-16rpx py-4rpx text-24rpx text-orange-500">
            {{ orderDetail.make_type === 'MARKET' ? '市价' : '限价' }}
          </view>
        </view>
        <view class="flex items-center" @click="goToTrade">
          <text class="text-28rpx text-red-500">
            去交易
          </text>
          <u-icon name="arrow-right" size="14" color="#ff0000" />
        </view>
      </view>
    </view>

    <!-- 订单详情标题 -->
    <view class="mt-20rpx border-b border-gray-100 bg-white p-30rpx">
      <view class="flex items-center">
        <view class="mr-16rpx h-32rpx w-8rpx rounded-4rpx bg-red-500" />
        <text class="text-32rpx font-bold">
          订单详情
        </text>
        <view
          class="ml-auto rounded-full px-16rpx py-4rpx text-24rpx"
          :class="getStatusClass(orderDetail.status)"
        >
          {{ getStatusText(orderDetail.status) }}
        </view>
      </view>
    </view>

    <!-- 订单详情信息 -->
    <view class="bg-white p-30rpx">
      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          委托价格({{ orderDetail.symbol.split('/')[1] }})
        </text>
        <text class="text-28rpx">
          {{ orderDetail.price }}
        </text>
      </view>

      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          成交均价({{ orderDetail.symbol.split('/')[1] }})
        </text>
        <text class="text-28rpx">
          {{ orderDetail.avg_price || '0' }}
        </text>
      </view>

      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          委托数量({{ orderDetail.symbol.split('/')[0] }})
        </text>
        <text class="text-28rpx">
          {{ orderDetail.amount || '0' }}
        </text>
      </view>

      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          成交数量({{ orderDetail.symbol.split('/')[0] }})
        </text>
        <text class="text-28rpx">
          {{ orderDetail.deal_amount || '0' }}
        </text>
      </view>

      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          成交额({{ orderDetail.symbol.split('/')[1] }})
        </text>
        <text class="text-28rpx">
          {{ orderDetail.volume || '0' }}
        </text>
      </view>

      <!-- 进度条 -->
      <view class="border-t border-gray-50 pt-20rpx">
        <view class="relative h-6rpx w-full overflow-hidden rounded-full bg-gray-200">
          <view
            class="absolute left-0 top-0 h-full bg-red-500"
            :style="{ width: `${calculateProgress()}%` }"
          />
        </view>
        <view class="mt-8rpx flex justify-end">
          <text class="text-24rpx text-red-500">
            {{ calculateProgress() }}%
          </text>
        </view>
      </view>
      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          订单号
        </text>
        <view class="flex items-center">
          <text class="max-w-250rpx truncate text-28rpx">
            {{ orderDetail.order_id }}
          </text>
          <view class="ml-10rpx" @click="copyOrderId">
            <image src="@/static/images/list_detail/copy.png" class="h-36rpx w-36rpx" mode="aspectFit" />
          </view>
        </view>
      </view>

      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          创建时间
        </text>
        <text class="text-28rpx">
          {{ orderDetail.create_at }}
        </text>
      </view>

      <view class="flex items-center justify-between border-b border-gray-50 py-20rpx">
        <text class="text-28rpx text-gray-600">
          结束时间
        </text>
        <text class="text-28rpx">
          {{ orderDetail.update_at }}
        </text>
      </view>

      <view class="flex items-center justify-between py-20rpx">
        <text class="text-28rpx text-gray-600">
          手续费({{ orderDetail.symbol ? orderDetail.symbol.split('/')[0] : 'HSK' }})
        </text>
        <text class="text-28rpx">
          {{ orderDetail.fee_symbol || '0' }}
        </text>
      </view>
    </view>

    <!-- 成交记录 -->
    <view class="my-20rpx bg-white">
      <view class="border-b border-gray-100 p-30rpx">
        <view class="flex items-center">
          <view class="mr-16rpx h-32rpx w-8rpx rounded-4rpx bg-red-500" />
          <text class="text-32rpx font-bold">
            成交记录
          </text>
        </view>
      </view>

      <!-- 添加空状态显示 -->
      <view v-if="!orderDetail.records || orderDetail.records.length === 0" class="flex flex-col items-center justify-center p-60rpx">
        <u-icon name="info-circle" size="80" color="#dbdbdb" />
        <text class="mt-20rpx text-28rpx text-gray-400">
          暂无成交记录
        </text>
      </view>

      <view v-for="(record, index) in orderDetail.records" :key="index" class="mb-20rpx bg-#f8f9fa p-30rpx last:mb-0">
        <view class="mb-20rpx flex items-center justify-between">
          <text class="text-28rpx text-gray-600">
            日期
          </text>
          <text class="max-w-400rpx truncate text-28rpx">
            {{ record.create_at }}
          </text>
        </view>

        <view class="mb-20rpx flex items-center justify-between">
          <text class="text-28rpx text-gray-600">
            角色/订单ID
          </text>
          <view class="flex items-center">
            <text class="max-w-350rpx truncate text-28rpx">
              {{ orderDetail.make_type }}/{{ record.id || '' }}
            </text>
            <u-icon name="info-circle" size="14" color="#999999" class="ml-10rpx" />
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
            {{ record.volume }}
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
  </c-container>
</template>

<script setup lang="ts">
import { getOrderDetail } from '@/api/list';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

// 根据接口定义订单详情接口
interface OrderDetailItem {
  amount: string;
  create_at: string;
  fee: string;
  fee_symbol: string;
  id: number;
  make_type: string;
  price: string;
  volume: string;
  [property: string]: any;
}

interface OrderDetailData {
  amount: string;
  avg_price: string;
  create_at: string;
  deal_amount: string;
  fee: string;
  fee_symbol: string;
  make_type: string;
  order_id: string;
  order_side: string;
  price: string;
  records: OrderDetailItem[];
  status: string;
  symbol: string;
  total: number;
  update_at: string;
  volume: string;
  [property: string]: any;
}

// 获取路由参数
const orderDetail = ref<OrderDetailData>({} as OrderDetailData);
const orderId = ref<number>(0);

onLoad((options) => {
  console.log('options', options);
  if (options?.id) {
    try {
      orderId.value = Number(options.id);
      // 获取订单详情
      fetchOrderDetail();
    }
    catch (e) {
      console.error('获取订单ID失败:', e);
      uni.showToast({
        title: '获取订单ID失败',
        icon: 'none',
      });
    }
  }
  else {
    uni.showToast({
      title: '订单ID不存在',
      icon: 'none',
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
});

// 获取订单详情
async function fetchOrderDetail() {
  try {
    const res = await getOrderDetail({
      order_id: orderId.value,
      current: 1,
      pageSize: 10,
    });

    if (res) {
      // 直接使用接口返回的数据结构
      orderDetail.value = res;
    }
  }
  catch (error) {
    console.error('获取订单详情失败:', error);
    uni.showToast({
      title: '获取订单详情失败',
      icon: 'none',
    });
  }
}

// 返回上一页
function goBack() {
  uni.switchTab({
    url: '/pages/tab/list/index',
  });
}

// 跳转到交易页面
function goToTrade() {
  uni.switchTab({
    url: '/pages/tab/home/index',
  });
}

// 复制订单ID
function copyOrderId() {
  uni.setClipboardData({
    data: orderDetail.value.order_id.toString(),
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'none',
      });
    },
  });
}

// 获取订单状态样式
function getStatusClass(status: string) {
  const statusMap: Record<string, string> = {
    MAKE_ORDER: 'bg-blue-50 text-blue-600',
    ORDER_COMMITED: 'bg-blue-50 text-blue-600',
    ORDER_ALL_CANCELED: 'bg-gray-50 text-gray-600',
    ORDER_PARTIALLY_CANCELED: 'bg-yellow-50 text-yellow-600',
    ORDER_CANCELING: 'bg-yellow-50 text-yellow-600',
    ORDER_FINISHED: 'bg-green-50 text-green-600',
    ORDER_FAILED: 'bg-red-50 text-red-600',
  };
  return statusMap[status] || 'bg-gray-50 text-gray-600';
}

// 获取订单状态文本
function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    MAKE_ORDER: '进行中',
    ORDER_COMMITED: '进行中',
    ORDER_ALL_CANCELED: '已取消',
    ORDER_PARTIALLY_CANCELED: '部分取消',
    ORDER_CANCELING: '取消中',
    ORDER_FINISHED: '全部完成',
    ORDER_FAILED: '失败',
  };
  return statusMap[status] || status;
}

// 计算进度
function calculateProgress() {
  if (!orderDetail.value.amount || !orderDetail.value.deal_amount) return 0;
  const total = Number(orderDetail.value.amount);
  const dealt = Number(orderDetail.value.deal_amount);
  if (total === 0) return 0;
  return Math.round((dealt / total) * 100);
}
</script>
