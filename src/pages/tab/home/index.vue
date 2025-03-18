<template>
  <!-- 添加loading页面 -->
  <u-loading-page :loading="isLoading" icon-size="36" loading-text="加载中..." loading-mode="semicircle" bg-color="rgba(255, 255, 255, 0.9)" />
  <!-- 顶部导航和币种选择 -->
  <c-header :show-back="false" has-background title="行情" class="relative z-10" />
  <!-- container -->
  <c-container>
    <view
      class="absolute left-0 right-0 top-0 h-[300rpx] w-full"
      :style="{ backgroundImage: `url(${background_banner})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
    />
    <!-- 币种选择器 -->
    <view class="mb-[20rpx] mt-[24rpx] p-l-[28rpx] p-r-[18rpx]">
      <view
        class="relative h-[108rpx] flex items-center justify-between overflow-hidden rounded-[10rpx] p-x-[20rpx] shadow-md"
      >
        <!-- 背景渐变层 -->
        <view class="absolute inset-0 z-0" style="background: linear-gradient(to right, #FFF5EC, #FFF3E9)" />

        <!-- 内容层 -->
        <view class="relative z-1 w-full flex items-center justify-between" @click="handleCurrency">
          <text class="text-[32rpx] text-[#333]">
            {{ selectedSymbol }}
          </text>
          <view class="flex items-center">
            <image :src="icon_right" class="h-[48rpx] w-[48rpx]" />
          </view>
        </view>
      </view>
    </view>
    <view class="relative z-10">
      <view class="flex items-center justify-between overflow-hidden bg-white py-[28rpx] p-l-[28rpx] p-r-[18rpx]">
        <view class="w-full flex items-center rounded-md bg-#F8F9FA p-x-[28rpx] p-y-[18rpx]">
          <view
            v-for="(item, index) in home_icon_list" :key="index"
            class="relative w-full flex items-center gap-[14rpx] text-[32rpx] text-[#333]"
          >
            <img class="mr-[14rpx] h-[48rpx] w-[48rpx]" :src="item.icon" alt="" srcset="">
            <text>{{ item.text }}</text>
          </view>
        </view>
      </view>
    </view>
    <c-line />
    <!-- 买入和卖出 Button -->
    <view class="flex items-start justify-between bg-white py-[30rpx]">
      <!-- 左侧内容 -->
      <view class="w-[424rpx] flex flex-col px-[28rpx]">
        <!-- 买入卖出按钮 -->
        <view class="mb-[24rpx] flex">
          <u-button
            class="flex-1" :color="activeTab === 'BUY' ? '#E53935' : '#FFE4E1'" text="买入"
            :custom-style="{ borderRadius: '8rpx 0 0 8rpx', width: '212rpx', height: '64rpx', color: activeTab === 'BUY' ? '#fff' : '#E6302F', fontSize: '30rpx' }"
            @click="handleBuy"
          />
          <u-button
            class="flex-1" :color="activeTab === 'SELL' ? '#4CAF50' : '#FFE4E1'" text="卖出"
            :custom-style="{ borderRadius: '0 8rpx 8rpx 0', width: '212rpx', height: '64rpx', color: activeTab === 'SELL' ? '#fff' : '#E6302F', fontSize: '30rpx' }"
            @click="handleSell"
          />
        </view>

        <!-- 限单价 -->
        <view
          class="box-border w-[424rpx] flex items-center justify-between gap-[14rpx] rounded-sm bg-[#f8f9fa] p-[28rpx]"
          @click="showMakeTypePopup = true"
        >
          <view class="relative flex items-center gap-[14rpx]">
            <image :src="home_icon4" class="h-[48rpx] w-[48rpx]" @tap.stop="toggleTooltip" />
            <!-- 添加 tooltip -->
            <view
              v-if="showTooltip"
              class="absolute bottom-[60rpx] left-0 z-10 w-[300rpx] rounded-[8rpx] bg-[#2C2C2C] p-[20rpx] shadow-lg transition-all duration-300 ease-in-out"
              :class="[showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10rpx]']" @tap.stop
            >
              <text class="text-[24rpx] text-[#E6E6E6]">
                {{ makeType === 'LIMIT' ? '限价委托是指以特定或更优价格进行买卖，限价单不能保证执行。' : '市价委托是指以当前市场最优价格立即成交的委托方式。' }}
              </text>
              <view
                class="absolute bottom-[-8rpx] left-[20rpx] h-0 w-0 border-l-[8rpx] border-r-[8rpx] border-t-[8rpx] border-l-transparent border-r-transparent border-t-[#2C2C2C]"
              />
            </view>
            <text class="text-[32rpx] text-[#333] font-bold">
              {{ makeType === 'LIMIT' ? '限单价' : '市价' }}
            </text>
          </view>
          <image :src="home_icon5" class="h-[22rpx] w-[34rpx]" />
        </view>

        <!-- 买入价格 -->
        <view class="mt-[24rpx] box-border flex items-center justify-between rounded-sm bg-[#f8f9fa] p-[28rpx]">
          <text class="text-[24rpx] text-[#999999]">
            {{ activeTab === 'BUY' ? '买入价格' : '卖出价格' }}(USDT)
          </text>
          <text class="text-[32rpx] text-[#333333] font-bold">
            {{ buyOrSellPrice }}
          </text>
        </view>

        <!-- 数量 -->
        <view class="mt-[24rpx] box-border flex items-center justify-between rounded-sm bg-[#f8f9fa] p-[28rpx]">
          <text class="text-[24rpx] text-[#999999]">
            数量
          </text>
          <text class="text-[32rpx] text-[#333333] font-bold">
            {{ tradeAmount }} IP
          </text>
        </view>

        <!-- 添加滑动条 -->
        <view class="relative mt-[24rpx] box-border rounded-sm bg-[#f8f9fa] p-[28rpx]">
          <slider
            :value="sliderValue" :min="minValue" :max="maxValue" :step="0.00000001" :block-size="12"
            :active-color="activeTab === 'BUY' ? '#E53935' : '#4CAF50'" background-color="#FFE4E1" class="slider-custom"
            @change="handleSliderChange" @changing="handleSliderChange"
          />
          <view class="mt-[10rpx] flex items-center justify-between">
            <text class="text-[20rpx] text-[#999999]" @click="selectPercentage(0)">
              0%
            </text>
            <text class="text-[20rpx] text-[#999999]" @click="selectPercentage(25)">
              25%
            </text>
            <text class="text-[20rpx] text-[#999999]" @click="selectPercentage(50)">
              50%
            </text>
            <text class="text-[20rpx] text-[#999999]" @click="selectPercentage(75)">
              75%
            </text>
            <text class="text-[20rpx] text-[#999999]" @click="selectPercentage(100)">
              100%
            </text>
          </view>
        </view>

        <!-- 交易额显示 -->
        <view class="mt-[24rpx] box-border flex items-center justify-between rounded-sm bg-[#f8f9fa] p-[28rpx]">
          <text class="w-85rpx text-[24rpx] text-[#999999]">
            交易额
          </text>
          <text class="text-end text-[32rpx] text-[#333333] font-bold">
            {{ totalAmount }} USDT
          </text>
        </view>

        <!-- 可用余额 -->
        <view class="mt-[24rpx] box-border flex items-center justify-between rounded-sm bg-[#f8f9fa] p-[28rpx]">
          <view class="flex flex-1 items-center">
            <text class="text-[24rpx] text-[#999999]">
              可用
            </text>
            <text class="ml-[8rpx] text-[24rpx] text-[#333333]">
              {{ source_amount_display }} USDT
            </text>
          </view>
        </view>

        <!-- 买入按钮 -->
        <view class="mt-[40rpx]">
          <u-button
            :text="activeTab === 'BUY' ? '买入 IP' : '卖出 IP'" :color="activeTab === 'BUY' ? '#E53935' : '#4CAF50'"
            :custom-style="{ width: '100%', height: '88rpx', borderRadius: '8rpx', fontSize: '32rpx' }"
            @click="handleOrder"
          />
        </view>
      </view>

      <!-- 右侧报价列表 -->
      <view class="h-[904rpx] flex flex-1 flex-col p-l-[10rpx] p-r-[20rpx]">
        <!-- 标题栏 -->
        <view class="h-[64rpx] flex items-center justify-between px-[12rpx] text-[24rpx] text-[#999]">
          <text>价格<br> (USDT)</text>
          <text>数量 <br>(IP)</text>
        </view>

        <!-- 卖单列表 -->
        <view class="flex-1 overflow-y-auto">
          <!-- 卖单容器 -->
          <view class="mt-[24rpx]">
            <view
              v-for="(item, index) in sellOrders" :key="index"
              class="relative mb-[12rpx] h-[46rpx] flex items-center justify-between px-[12rpx]"
            >
              <!-- 内容保持在最上层 -->
              <text class="relative z-1 text-[24rpx] text-[#E53935]">
                {{ item.price }}
              </text>
              <text class="relative z-1 text-[24rpx] text-[#333]">
                {{ item.amount }}
              </text>
            </view>
          </view>

          <!-- 当前价格 -->
          <view class="my-[24rpx] flex items-center justify-between bg-[#F8F8F8] px-[12rpx] py-[28rpx]">
            <view>
              <text class="text-[28rpx] font-bold transition-colors duration-100">
                {{ currentPrice }}
              </text>
            </view>
          </view>

          <!-- 买单列表 -->
          <view class="mb-[24rpx]">
            <view
              v-for="(item, index) in buyOrders" :key="index"
              class="relative mb-[12rpx] h-[56rpx] flex items-center justify-between px-[12rpx]"
            >
              <!-- 内容保持在最上层 -->
              <text class="relative z-1 text-[24rpx] text-[#00B069]">
                {{ item.price }}
              </text>
              <text class="relative z-1 text-[24rpx] text-[#333]">
                {{ item.amount }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 委托 -->
    <view class="mt-[40rpx] h-1160rpx overflow-auto bg-white p-x-[28rpx] p-b-[28rpx]">
      <z-paging
        ref="paging" v-model="orderList" :auto="true" :refresher-enabled="true" :show-scrollbar="false"
        language="zh-cn" empty-view-text="暂无委托订单" :loading-more-enabled="true" :auto-scroll-to-top-when-reload="true"
        :fixed="false" loading-more-no-more-text="没有更多数据了" no-more-data-text="没有更多数据了"
        loading-more-loading-text="加载中..." loading-more-failed-text="加载失败，点击重试" refresher-default-text="下拉刷新"
        refresher-pulling-text="松开刷新" refresher-refreshing-text="刷新中..." @query="queryOrderList"
      >
        <template #default>
          <view v-for="(item, index) in orderList" :key="index" class="mt-[24rpx] rounded-sm bg-#f8f9fa p-28rpx">
            <view>
              <view class="flex items-center justify-between">
                <view class="flex items-center gap-[12rpx]">
                  <text class="text-[32rpx] text-[#333] font-bold">
                    {{ item.symbol }}
                  </text>
                  <view class="border-[2rpx] border-[#E6302F] rounded-[4rpx] border-solid p-x-[8rpx] p-y-[4rpx]">
                    <text class="text-[24rpx] text-[#E6302F]">
                      {{ item.order_side === 'BUY' ? '买入' : '卖出' }}
                    </text>
                  </view>
                  <view class="border-[2rpx] border-[#F7B966] rounded-[4rpx] border-solid p-x-[8rpx] p-y-[4rpx]">
                    <text class="text-[24rpx] text-[#F7B966]">
                      {{ item.make_type === 'LIMIT' ? '限价' : '市价' }}
                    </text>
                  </view>
                </view>
                <view class="text-[28rpx] text-[#999] font-500">
                  {{ formatDate(item.create_at) }}
                </view>
              </view>
            </view>
            <view class="mt-[40rpx] flex items-center justify-between px-[28rpx]">
              <view class="flex flex-col items-center justify-center">
                <view class="price-display text-[44rpx] text-[#333] font-bold">
                  {{ item.price }}
                </view>
                <view class="text-[24rpx] text-[#666]">
                  委托价格(USDT)
                </view>
              </view>

              <view class="flex flex-col items-center justify-center">
                <view class="price-display text-[44rpx] text-[#333] font-bold">
                  {{ item.amount }}
                </view>
                <view class="text-[24rpx] text-[#666]">
                  委托数量(IP)
                </view>
              </view>
              <view class="flex flex-col items-center justify-center">
                <view class="price-display text-[44rpx] text-[#333] font-bold">
                  {{ item.volume }}
                </view>
                <view class="text-[24rpx] text-[#666]">
                  交易额(USDT)
                </view>
              </view>
            </view>

            <view class="mt-[40rpx] flex items-center justify-between px-[28rpx]">
              <view class="flex flex-col items-center justify-center">
                <view class="price-display text-[44rpx] text-[#E6302F] font-bold">
                  {{ item.deal_amount }}
                </view>
                <view class="text-[24rpx] text-[#999]">
                  已成交(IP)
                </view>
              </view>
              <view
                v-if="item.status === 'ORDER_COMMITED'"
                class="rounded-[8rpx] bg-[#FAE4E6] p-x-[68rpx] p-y-[16rpx] text-[#E6302F] font-bold"
                @click="cancelOrder(item.order_id)"
              >
                撤销
              </view>
              <view
                v-else-if="['INIT', 'MAKE_ORDER', 'ORDER_CANCELING'].includes(item.status)"
                class="rounded-[8rpx] bg-[#EFEFEF] p-x-[68rpx] p-y-[16rpx] text-[#999999] font-bold"
              >
                处理中
              </view>
            </view>
          </view>
        </template>
      </z-paging>
    </view>

    <!-- 币种选择弹出层 -->
    <u-popup
      :show="showSymbolPicker" mode="bottom" :mask="true" :safe-area-inset-bottom="true"
      @close="showSymbolPicker = false"
    >
      <view class="bg-white p-[30rpx]">
        <view class="flex items-center justify-between border-b border-gray-100 pb-[20rpx]">
          <text class="text-[32rpx] font-bold">
            选择交易对
          </text>
          <u-icon name="close" size="32" @click="showSymbolPicker = false" />
        </view>
        <scroll-view scroll-y style="max-height: 600rpx;">
          <view
            v-for="(item, index) in symbolList" :key="index"
            class="flex items-center justify-between border-b border-gray-100 py-[24rpx]" @click="selectSymbol(item)"
          >
            <view class="flex items-center">
              <text class="text-[28rpx]">
                {{ item.target_name }}/{{ item.source_name }}
              </text>
              <text class="ml-[10rpx] text-[24rpx] text-gray-500">
                {{ item.exchange_name }}
              </text>
            </view>
            <u-icon
              v-if="selectedUniqueSymbolId === getSymbolId(item)" name="checkmark-circle" color="#07c160"
              size="32"
            />
          </view>
          <view v-if="symbolList.length === 0" class="py-[40rpx] text-center text-gray-500">
            暂无可用交易对
          </view>
        </scroll-view>
      </view>
    </u-popup>

    <!-- 委托类型选择弹出层 -->
    <u-popup
      :show="showMakeTypePopup" mode="bottom" :mask="true" :safe-area-inset-bottom="true" :round="10"
      @close="showMakeTypePopup = false"
    >
      <view class="bg-white p-[30rpx]">
        <view class="flex items-center justify-between border-b border-gray-100 pb-[20rpx]">
          <text class="text-[32rpx] font-bold">
            选择委托类型
          </text>
          <u-icon name="close" size="32" @click="showMakeTypePopup = false" />
        </view>
        <view class="py-[20rpx]">
          <view
            class="flex items-center justify-between border-b border-gray-100 py-[24rpx]"
            @click="selectMakeType('LIMIT')"
          >
            <view class="flex items-center">
              <text class="text-[28rpx]">
                限价委托
              </text>
              <text class="ml-[10rpx] text-[24rpx] text-gray-500">
                以特定或更优价格进行买卖
              </text>
            </view>
            <u-icon v-if="makeType === 'LIMIT'" name="checkmark-circle" color="#07c160" size="32" />
          </view>
          <view class="flex items-center justify-between py-[24rpx]" @click="selectMakeType('MARKET')">
            <view class="flex items-center">
              <text class="text-[28rpx]">
                市价委托
              </text>
              <text class="ml-[10rpx] text-[24rpx] text-gray-500">
                以市场最优价格立即成交
              </text>
            </view>
            <u-icon v-if="makeType === 'MARKET'" name="checkmark-circle" color="#07c160" size="32" />
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 下单确认弹出层 -->
    <u-popup
      :show="showOrderConfirm" mode="bottom" :mask="true" :safe-area-inset-bottom="true" round="20"
      @close="showOrderConfirm = false"
    >
      <view class="flex items-center justify-between border-b border-[#f5f5f5] p-[28rpx]">
        <view class="flex-1" /> <!-- 左侧空白占位 -->
        <view class="flex-1 text-center">
          <text class="text-[32rpx] text-[#333] font-bold">
            下单确认
          </text>
        </view>
        <view class="flex flex-1 justify-end">
          <u-icon name="close" size="30rpx" @click="showOrderConfirm = false" />
        </view>
      </view>
      <view class="p-[28rpx]">
        <view class="mb-[20rpx] flex items-center">
          <text class="text-[28rpx] text-[#333]">
            {{ selectedSymbol }}
          </text>
          <view
            class="ml-22rpx rounded-sm p-x-[8rpx] text-[24rpx]"
            :style="{ color: activeTab === 'BUY' ? '#E6302F' : '#00B069', border: activeTab === 'BUY' ? '1rpx solid #E6302F' : '1rpx solid #00B069' }"
          >
            {{ activeTab === 'BUY' ? '买入' : '卖出' }}
          </view>
        </view>
        <view class="mb-[20rpx] flex items-center justify-between">
          <text class="h-28rpx text-[28rpx] text-[#999] line-height-28rpx">
            委托类型
          </text>
          <text class="text-[28rpx] text-[#333]">
            {{ makeType === 'LIMIT' ? '限价' : '市价' }}
          </text>
        </view>
        <view class="mb-[20rpx] flex items-center justify-between">
          <text class="text-[28rpx] text-[#999]">
            {{ activeTab === 'BUY' ? '买入' : '卖出' }}价格
          </text>
          <text class="text-[28rpx] text-[#333]">
            {{ buyOrSellPrice }} USDT
          </text>
        </view>
        <view class="mb-[20rpx] flex items-center justify-between">
          <text class="text-[28rpx] text-[#999]">
            买入量
          </text>
          <text class="text-[28rpx] text-[#333]">
            {{ tradeAmount }} IP
          </text>
        </view>
        <view class="mb-[20rpx] flex items-center justify-between">
          <text class="text-[28rpx] text-[#999]">
            交易额
          </text>
          <text class="text-[28rpx] text-[#333]">
            {{ totalAmount }} USDT
          </text>
        </view>
      </view>
      <view class="h-[90rpx] p-x-[28rpx] p-y-[20rpx]">
        <view
          class="h-full flex items-center justify-center rounded-full text-[30rpx] text-white"
          :style="{ background: activeTab === 'BUY' ? '#E6302F' : '#00B069' }" @click="submitOrder"
        >
          确认
        </view>
      </view>
    </u-popup>

    <!-- 修改密码输入弹窗，使用 u-code-input 组件 -->
    <u-popup
      :show="showPasswordPopup" mode="bottom" :mask="true" :safe-area-inset-bottom="true" round="20"
      @close="showPasswordPopup = false"
    >
      <view class="p-[28rpx]">
        <view class="flex items-center justify-between border-b border-[#f5f5f5] p-b-[20rpx]">
          <view class="flex-1" />
          <view class="flex-1 text-center">
            <text class="text-[32rpx] text-[#333] font-bold">
              输入交易密码
            </text>
          </view>
          <view class="flex flex-1 justify-end">
            <u-icon name="close" size="30rpx" @click="showPasswordPopup = false" />
          </view>
        </view>

        <view class="code-container mt-[40rpx] w-full flex justify-center">
          <!-- 使用 u-code-input 组件 -->
          <u-code-input
            v-model="tradePassword" :maxlength="6" :dot="false" mode="box" :space="10" font-size="24px"
            class="verification-code-input mb-[20rpx] w-full" :size="boxSize"
          />
        </view>

        <view class="mt-[40rpx]">
          <view
            class="h-[88rpx] flex items-center justify-center rounded-[8rpx] bg-[#E6302F] text-[32rpx] text-white"
            @click="handleConfirmPassword"
          >
            确认
          </view>
        </view>
      </view>
    </u-popup>
  </c-container>
</template>

<script setup lang="ts">
import type { SymbolInfosRes } from '@/api/home';
import { CancelOrder, getSymbolInfos, getSymbolSetting, newOrder, VerifyTradePwd } from '@/api/home';
import { getOrderList } from '@/api/list';
import icon_right from '@/static/images/home/back_icon.png';
import background_banner from '@/static/images/home/background_banner.png';
import home_icon1 from '@/static/images/home/home_icon1.png';
import home_icon2 from '@/static/images/home/home_icon2.png';
import home_icon3 from '@/static/images/home/home_icon3.png';
import home_icon4 from '@/static/images/home/home_icon4.png';
import home_icon5 from '@/static/images/home/home_icon5.png';
import { getGoogleToken } from '@/utils';
import storage from '@/utils/storage';
import WebSocketService from '@/utils/ws';
// WebSocketService
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

// 添加页面加载状态
const isLoading = ref(true);

// 添加当前价格的响应式引用
const currentPrice = ref(0);
// 源币数量
const source_amount = ref('');
const source_amount_display = ref('');
// 当前激活的标签页（买入/卖出）
const activeTab = ref('BUY'); // 默认选中买入

// 买入或卖出价格
const buyOrSellPrice = ref('');

// 交易数量
const tradeAmount = ref('0');
// 交易总额
const totalAmount = ref('0');

// 卖单数据
const sellOrders = ref<{ price: string; amount: string }[]>([]);

// 买单数据
const buyOrders = ref<{ price: string; amount: string }[]>([]);

// 滑动条相关变量
const minValue = ref(0);
const maxValue = ref(100);
const sliderValue = ref(0);

// 计算最大可交易数量
const calculateMaxTradeAmount = () => {
  if (!buyOrSellPrice.value || Number.parseFloat(buyOrSellPrice.value) <= 0) {
    return 0;
  }
  // 获取可用余额
  const availableBalance = Number.parseFloat(source_amount.value || '0');
  // 根据买入/卖出计算最大可交易数量
  if (activeTab.value === 'BUY') {
    // 买入时，最大数量 = 可用余额 / 买入价格
    return availableBalance / Number.parseFloat(buyOrSellPrice.value);
  }
  else {
    // 卖出时，直接使用可用余额（假设这里的可用余额是IP数量）
    return availableBalance;
  }
};

// 更新交易数量和总额
const updateTradeInfo = () => {
  const maxAmount = calculateMaxTradeAmount();
  // 根据滑块百分比计算实际交易数量
  const percentage = sliderValue.value / 100;
  const amount = maxAmount * percentage;
  // 更新交易数量显示，保留6位小数
  tradeAmount.value = amount.toFixed(6);
  // 计算交易总额
  if (buyOrSellPrice.value) {
    const total = amount * Number.parseFloat(buyOrSellPrice.value);
    totalAmount.value = total.toFixed(2);
  }
  else {
    totalAmount.value = '0';
  }
};

// 买入按钮点击事件
const handleBuy = () => {
  activeTab.value = 'BUY';
  // 重置滑块和交易数量
  sliderValue.value = 0;
  // 切换到买入时更新价格和交易信息
  if (buyOrders.value.length > 0) {
    buyOrSellPrice.value = buyOrders.value[buyOrders.value.length - 1].price;
  }
  updateTradeInfo();
};

// 卖出按钮点击事件
const handleSell = () => {
  activeTab.value = 'SELL';
  // 重置滑块和交易数量
  sliderValue.value = 0;
  // 切换到卖出时更新价格和交易信息
  if (sellOrders.value.length > 0) {
    buyOrSellPrice.value = sellOrders.value[0].price;
  }
  updateTradeInfo();
};

// 添加 tooltip 控制变量
const showTooltip = ref(false);

// 点击页面任意位置关闭tooltip
const closeTooltip = () => {
  showTooltip.value = false;
};

// 添加 tooltip 切换方法
const toggleTooltip = (e: Event) => {
  e.stopPropagation(); // 阻止事件冒泡
  showTooltip.value = !showTooltip.value;
};

// 滑动条改变事件
const handleSliderChange = (e: any) => {
  sliderValue.value = e.detail.value;
  updateTradeInfo();
};

// const handleSliderChanging = (e: any) => {
//   sliderValue.value = e.detail.value;
//   updateTradeInfo();
// };

// 快速选择百分比
const selectPercentage = (percentage: number) => {
  sliderValue.value = percentage;
  updateTradeInfo();
};

// const handleAdd = () => {
//   // 可以添加充值或其他操作
// };
// 委托订单列表
const orderList = ref<any[]>([]);
// 添加分页相关变量
const paging = ref<any>(null);

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 获取委托订单列表 - 分页查询
const queryOrderList = async (pageNo: number, pageSizeParam: number) => {
  try {
    const res = await getOrderList({
      status: 0,
      pageSize: pageSizeParam,
      current: pageNo,
    });

    if (res && res.records) {
      // 过滤掉不需要显示的订单状态
      const filteredList = res.records.filter(item =>
        !['ORDER_ALL_CANCELED', 'ORDER_PARTIALLY_CANCELED', 'ORDER_FINISHED'].includes(item.status),
      );

      // 通知z-paging加载完成
      if (paging.value) {
        paging.value.complete(filteredList);
      }

      // 如果没有更多数据，通知z-paging
      if (filteredList.length < pageSizeParam || (res as any).current >= (res as any).pages) {
        paging.value.complete(filteredList);
      }
    }
    else {
      // 如果没有数据，通知z-paging加载完成，无更多数据
      if (paging.value) {
        paging.value.complete([]);
      }
    }
  }
  catch (error) {
    console.error('获取委托订单列表失败:', error);
    // 通知z-paging加载失败
    if (paging.value) {
      paging.value.complete(false);
    }
    uni.showToast({
      title: '获取订单列表失败',
      icon: 'none',
    });
  }
};

// 刷新委托订单列表
const fetchOrderList = async () => {
  if (paging.value) {
    paging.value.reload();
  }
  else {
    // 兼容旧逻辑
    try {
      const res = await getOrderList({
        status: 0, // 已完成的订单
        pageSize: 10,
        current: 1,
      });

      if (res && res.records) {
        // 过滤掉不需要显示的订单状态
        orderList.value = res.records.filter(item => !['ORDER_ALL_CANCELED', 'ORDER_PARTIALLY_CANCELED', 'ORDER_FINISHED'].includes(item.status));
      }
    }
    catch (error) {
      console.error('获取委托订单列表失败:', error);
      uni.showToast({
        title: '获取订单列表失败',
        icon: 'none',
      });
    }
  }
};

const token = getGoogleToken();
const WSURL = import.meta.env.VITE_WS_URL;

const wsService = new WebSocketService(`${WSURL}/wss?Authorization=${token}`);
// 建立连接
wsService.connect();

// 初始化行情数据
const home_icon_list = ref([
  {
    icon: home_icon1,
    text: '0.00', // BP - 买入价格
  },
  {
    icon: home_icon2,
    text: '0.00', // TP - 卖出价格
  },
  {
    icon: home_icon3,
    text: '0.00', // TM - 24小时最高价
  },
]);

// 监听消息
wsService.onMessage((message) => {
  // 处理价格行情数据
  if (message.T === 'B') {
    // 更新行情数据 - BP(买入价格)、TP(卖出价格)、TM(24小时最高价)
    if (message.BP) {
      home_icon_list.value[0].text = message.BP.toLocaleString();
    }

    if (message.TP) {
      home_icon_list.value[1].text = message.TP.toLocaleString();
    }

    if (message.TM) {
      home_icon_list.value[2].text = message.TM.toLocaleString();
    }
  }

  if (message.T === 'P') {
    // 处理深度数据
    if (message.A && message.B) {
      // A是买单列表，需要反转
      buyOrders.value = [...message.A].reverse().map(item => ({
        price: item.P,
        amount: item.V,
      }));

      // B是卖单列表，需要反转
      sellOrders.value = [...message.B].reverse().map(item => ({
        price: item.P,
        amount: item.V,
      }));

      if (activeTab.value === 'BUY') {
        buyOrSellPrice.value = buyOrders.value[buyOrders.value.length - 1].price;
      }
      else if (activeTab.value === 'SELL') {
        buyOrSellPrice.value = sellOrders.value[0].price;
      }

      // 价格变化时更新交易信息
      updateTradeInfo();
    }
  }
  if (message.T === 'D') {
    currentPrice.value = message.price;
  }
  if (message.T === 'O') {
    console.log('订单更新消息:', message);
    // 查找并更新订单列表中对应的订单
    const orderIndex = orderList.value.findIndex(item => item.order_id === message.ID);
    if (orderIndex !== -1) {
      // 更新订单状态和成交数量
      orderList.value[orderIndex].status = message.S;
      orderList.value[orderIndex].deal_amount = message.D;

      // 如果订单状态变为已完成或已取消，可以刷新订单列表
      if (['ORDER_FINISHED', 'ORDER_ALL_CANCELED', 'ORDER_PARTIALLY_CANCELED'].includes(message.S)) {
        fetchOrderList();
      }
    }
  }
});

// 币种选择相关数据
const showSymbolPicker = ref(false);
const symbolList = ref<SymbolInfosRes[]>([]);
// 选择的交易对显示文字
const selectedSymbol = ref('');
const selectedUniqueSymbolId = ref<string | null>(null);
const selectedSymbolId = ref<number | null>(null);
const selectedExchangeId = ref<number | null>(null);
const selectedSourceId = ref<number | null>(null);
// 获取交易对唯一标识
const getSymbolId = (item: any): string => {
  return `${item.source_id}_${item.target_id}_${item.exchange_id}`;
};

// 保存选择的币种到本地存储
const saveSelectedSymbolToLocal = (item: SymbolInfosRes): void => {
  const symbolInfo = {
    symbol: `${item.target_name}/${item.source_name}`,
    uniqueId: getSymbolId(item),
    symbolId: item.target_id,
    exchangeId: item.exchange_id,
    sourceId: item.source_id,
    targetName: item.target_name,
    sourceName: item.source_name,
  };
  storage.set('selected_symbol', JSON.stringify(symbolInfo));
};

// 从本地存储获取币种信息
const getSelectedSymbolFromLocal = (): any => {
  const symbolData = storage.get('selected_symbol');
  return symbolData ? JSON.parse(symbolData) : null;
};

// 选择交易对
const selectSymbol = (item: SymbolInfosRes): void => {
  selectedSymbol.value = `${item.target_name}/${item.source_name}`;
  selectedUniqueSymbolId.value = getSymbolId(item);
  selectedSymbolId.value = item.target_id;
  selectedExchangeId.value = item.exchange_id;
  selectedSourceId.value = item.source_id;
  showSymbolPicker.value = false;
  // 将选择的币种信息保存到本地存储
  saveSelectedSymbolToLocal(item);
};

const handleCurrency = () => {
  showSymbolPicker.value = true;
};

// 获取交易对列表
const fetchSymbolList = async (): Promise<void> => {
  try {
    const res = await getSymbolInfos();
    symbolList.value = res || [];
    // 先尝试从本地存储获取选中的币种
    const savedSymbol = getSelectedSymbolFromLocal();
    if (savedSymbol && symbolList.value.some(item => getSymbolId(item) === savedSymbol.uniqueId)) {
      // 如果本地有存储的币种且币种列表中存在该币种，则使用保存的币种
      selectedSymbol.value = savedSymbol.symbol;
      selectedUniqueSymbolId.value = savedSymbol.uniqueId;
      selectedSymbolId.value = savedSymbol.symbolId;
      selectedExchangeId.value = savedSymbol.exchangeId;
      selectedSourceId.value = savedSymbol.sourceId;
    }
    else if (symbolList.value.length > 0) {
      // 如果本地没有存储币种或者保存的币种不在当前列表中，则默认选中第一个
      const firstItem = symbolList.value[0];
      selectedSymbol.value = `${firstItem.target_name}/${firstItem.source_name}`;
      selectedUniqueSymbolId.value = getSymbolId(firstItem);
      selectedSymbolId.value = firstItem.target_id;
      selectedExchangeId.value = firstItem.exchange_id;
      selectedSourceId.value = firstItem.source_id;
      // 将默认选择的币种保存到本地
      saveSelectedSymbolToLocal(firstItem);
    }
  }
  catch (error) {
    console.error('获取交易对列表失败:', error);
  }
};

// 获取交易对设置
const fetchSymbolSetting = async (): Promise<void> => {
  const res = await getSymbolSetting({ symbol_id: selectedSymbolId.value!, source_id: selectedSourceId.value!, exchange_id: selectedExchangeId.value! });
  source_amount.value = res.source_amount;
  source_amount_display.value = res.source_amount_display;
  // 更新交易信息
  updateTradeInfo();
};

// 撤销订单
const cancelOrder = (orderId: number) => {
  // 显示确认弹窗
  uni.showModal({
    title: '温馨提示',
    content: '确定要撤销此订单吗？',
    confirmColor: '#E6302F',
    confirmText: '确认',
    cancelText: '取消',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({
            title: '处理中...',
          });
          // 调用撤销订单接口
          await CancelOrder({ order_id: orderId });
          uni.showToast({
            title: '撤销成功',
            icon: 'success',
          });
          // 刷新订单列表
          await fetchOrderList();
        }
        catch (error: any) {
          uni.showToast({
            title: error.message || '撤销失败',
            icon: 'none',
          });
        }
        finally {
          uni.hideLoading();
        }
      }
    },
  });
};

const initData = async () => {
  isLoading.value = true; // 开始加载数据时显示loading
  try {
    await fetchSymbolList();
    await fetchSymbolSetting();
    await fetchOrderList(); // 添加获取委托订单列表
  }
  catch (error) {
    console.error('初始化数据失败:', error);
    uni.showToast({
      title: '加载数据失败，请重试',
      icon: 'none',
    });
  }
  finally {
    isLoading.value = false; // 数据加载完成后隐藏loading
  }
};

// 添加验证码输入框大小计算
const boxSize = ref(0);
// 页面加载时获取交易对列表
onMounted(async () => {
  // 添加全局点击事件监听
  document.addEventListener('click', () => {
    if (showTooltip.value) {
      closeTooltip();
    }
  });

  // 初始化数据
  await initData();
  if (selectedExchangeId.value && selectedSymbolId.value && selectedSourceId.value) {
    // 订阅价格变化
    wsService.subscribe('P', selectedExchangeId.value, selectedSymbolId.value, selectedSourceId.value);
  }
});

// 在组件卸载前取消订阅并关闭WebSocket
onBeforeUnmount(() => {
  wsService.unsubscribe();

  // 关闭WebSocket连接
  wsService.close();

  // 移除全局点击事件监听
  document.removeEventListener('click', () => {
    if (showTooltip.value) {
      closeTooltip();
    }
  });
});

onPageScroll(() => {
  if (showTooltip.value) {
    showTooltip.value = false;
  }
});

// 委托类型选择相关
const makeType = ref('LIMIT'); // 默认限价委托
const showMakeTypePopup = ref(false);

// 选择委托类型
const selectMakeType = (type: 'LIMIT' | 'MARKET') => {
  makeType.value = type;
  showMakeTypePopup.value = false;
};

// 下单确认相关
const showOrderConfirm = ref(false);

// 处理下单按钮点击
const handleOrder = () => {
  // 检查交易数量是否为0
  if (Number(tradeAmount.value) <= 0) {
    uni.showToast({
      title: '请输入交易数量',
      icon: 'none',
    });
    return;
  }

  // 检查价格是否有效
  if (makeType.value === 'LIMIT' && (!buyOrSellPrice.value || Number(buyOrSellPrice.value) <= 0)) {
    uni.showToast({
      title: '请输入有效价格',
      icon: 'none',
    });
    return;
  }

  // 显示确认弹窗
  showOrderConfirm.value = true;
};

// 添加新的响应式变量
const showPasswordPopup = ref(false);
const tradePassword = ref('');

// 修改 submitOrder 函数
const submitOrder = async () => {
  try {
    isLoading.value = true; // 提交订单时显示loading
    uni.showLoading({
      title: '提交中...',
    });

    // 准备请求参数
    const orderData = {
      amount: tradeAmount.value,
      make_type: makeType.value,
      order_side: activeTab.value,
      price: buyOrSellPrice.value,
      sourceId: selectedSourceId.value!,
      symbol_id: selectedSymbolId.value!,
      t: Date.now(),
      sign: '',
    };

    // 调用下单接口
    await newOrder(orderData);

    // 关闭密码弹窗和确认弹窗
    showPasswordPopup.value = false;
    showOrderConfirm.value = false;
    tradePassword.value = ''; // 清空密码

    // 显示成功提示
    uni.showToast({
      title: '下单成功',
      icon: 'success',
    });

    // 重置交易数量
    sliderValue.value = 0;

    // 刷新交易对设置和订单列表
    await fetchSymbolSetting();
    await fetchOrderList(); // 下单成功后刷新订单列表
  }
  catch (error: any) {
    if (error.code === 3000) {
      // 显示密码输入弹窗，同时隐藏确认弹窗
      showPasswordPopup.value = true;
      showOrderConfirm.value = false;
      nextTick(() => {
        const query = uni.createSelectorQuery();
        query.select('.code-container').boundingClientRect((data) => {
          if (data && typeof data === 'object' && 'width' in data) {
            // 计算每个输入框的大小 (总宽度减去间距) / 输入框数量
            const containerWidth = data.width as number;
            const totalSpacing = 10 * 5; // 5个间隔 (6个输入框之间)
            boxSize.value = Math.floor((containerWidth - totalSpacing) / 6);
          }
        }).exec();
      });
    }
    else {
      uni.showToast({
        title: error.message || '下单失败',
        icon: 'none',
      });
    }
  }
  finally {
    isLoading.value = false; // 无论提交成功或失败，都隐藏loading
    uni.hideLoading();
  }
};

// 添加确认密码的处理函数
const handleConfirmPassword = async () => {
  try {
    isLoading.value = true; // 验证密码时显示loading
    uni.showLoading({
      title: '提交中...',
    });
    const res = await VerifyTradePwd({ trade_pwd: tradePassword.value });

    // 关闭密码弹窗和确认弹窗
    showPasswordPopup.value = false;
    showOrderConfirm.value = false;
    tradePassword.value = ''; // 清空密码

    // 重置交易数量
    sliderValue.value = 0;
    uni.showToast({
      title: '验证成功',
      icon: 'none',
    });
    storage.set('verify_trade_pwd_token', res.token);
    storage.set('verify_trade_pwd_trade_status_expired', res.trade_status_expired.toString());
  }
  catch (error: any) {
    uni.showToast({
      title: error.message || '下单失败',
      icon: 'none',
    });
  }
  finally {
    isLoading.value = false; // 无论验证成功或失败，都隐藏loading
    uni.hideLoading();
  }
};
</script>

<style lang="scss" scoped>
.slider-custom {
  margin: 0;
}

/* 修改滑块样式 */
.slider-custom .uni-slider-handle {
  width: 24rpx !important;
  height: 24rpx !important;
  background-color: #E53935 !important;
  box-shadow: 0 0 4rpx rgb(0 0 0 / 20%);
}

/* 添加价格变化动画 */
.transition-colors {
  transition: color 0.1s ease-in-out;
}

/* 价格显示样式 */
.price-display {
  max-width: 200rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.verification-code-input {

  /* stylelint-disable selector-class-pattern */
  :deep(.u-code-input__item) {
    // height: 80rpx !important; // 减小输入框高度
    // line-height: 80rpx !important; // 调整内部文字垂直居中
    background-color: #F8F9FA !important; // 添加背景色
    border: none !important; // 移除边框
  }
}
</style>
