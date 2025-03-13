<template>
  <!-- 顶部导航和币种选择 -->
  <c-header show-back has-background title="行情" class="fixed left-0 right-0 top-0 z-10" />
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
        <view class="relative z-1 w-full flex items-center justify-between">
          <text class="text-[32rpx] text-[#333]">
            FDUSD/USDT
          </text>
          <view class="flex items-center" @click="handleCurrency">
            <image :src="icon_right" class="h-[48rpx] w-[48rpx]" />
          </view>
        </view>
      </view>
    </view>
    <view class="mb-[58rpx] mt-[48rpx] flex items-center justify-between p-l-[28rpx] p-r-[18rpx]">
      <view
        v-for="(item, index) in home_icon_list" :key="index"
        class="relative flex items-center gap-[14rpx] text-[32rpx] text-[#333]"
      >
        <img class="mr-[14rpx] h-[48rpx] w-[48rpx]" :src="item.icon" alt="" srcset="">
        <text>{{ item.text }}</text>
      </view>
    </view>
    <!-- 买入和卖出 Button -->
    <view class="mt-[40rpx] flex items-start justify-between">
      <!-- 左侧内容 -->
      <view class="h-[680rpx] w-[424rpx] flex flex-col px-[28rpx]">
        <view class="flex">
          <u-button
            class="flex-1" :color="activeTab === 'buy' ? '#E53935' : '#FFE4E1'" text="买入"
            :custom-style="{ borderRadius: '8rpx 0 0 8rpx', width: '212rpx', height: '64rpx', color: activeTab === 'buy' ? '#fff' : '#E6302F', fontSize: '30rpx' }"
            @click="handleBuy"
          />
          <u-button
            class="flex-1" :color="activeTab === 'sell' ? '#4CAF50' : '#FFE4E1'" text="卖出"
            :custom-style="{ borderRadius: '0 8rpx 8rpx 0', width: '212rpx', height: '64rpx', color: activeTab === 'sell' ? '#fff' : '#E6302F', fontSize: '30rpx' }"
            @click="handleSell"
          />
        </view>
        <view class="mt-[48rpx] w-[424rpx] flex items-center justify-between gap-[14rpx]">
          <view class="relative flex items-center gap-[14rpx]">
            <image :src="home_icon4" class="h-[48rpx] w-[48rpx]" @tap.stop="toggleTooltip" />
            <!-- 添加 tooltip -->
            <view
              v-if="showTooltip"
              class="absolute bottom-[60rpx] left-0 z-10 w-[300rpx] rounded-[8rpx] bg-[#2C2C2C] p-[20rpx] shadow-lg transition-all duration-300 ease-in-out"
              :class="[showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10rpx]']" @tap.stop
            >
              <text class="text-[24rpx] text-[#E6E6E6]">
                限价委托是指以特定或更优价格进行买卖，限价单不能保证执行。
              </text>
              <view
                class="absolute bottom-[-8rpx] left-[20rpx] h-0 w-0 border-l-[8rpx] border-r-[8rpx] border-t-[8rpx] border-l-transparent border-r-transparent border-t-[#2C2C2C]"
              />
            </view>
            <text class="text-[32rpx] text-[#333] font-bold">
              限单价
            </text>
          </view>
          <image :src="home_icon5" class="h-[22rpx] w-[34rpx]" />
        </view>
        <view class="mt-[48rpx] flex items-center justify-between">
          <text class="text-[24rpx] text-[#999999]">
            买入价格(USDT)
          </text>
          <text class="text-[32rpx] text-[#333333] font-bold">
            {{ buyPrice }}
          </text>
        </view>
        <view class="mt-[48rpx] flex items-center justify-between">
          <text class="text-[24rpx] text-[#999999]">
            数量
          </text>
          <text class="text-[24rpx] text-[#999999]">
            IP
          </text>
        </view>

        <!-- 添加滑动条 -->
        <view class="relative mt-[24rpx]">
          <slider
            :value="sliderValue" :min="minValue" :max="maxValue" :step="0.00000001" :block-size="12"
            :active-color="activeTab === 'buy' ? '#E53935' : '#4CAF50'" background-color="#FFE4E1" class="slider-custom" @change="handleSliderChange"
            @changing="handleSliderChanging"
          />
        </view>
        <!-- 交易额显示 -->
        <view class="mt-[48rpx] flex items-center justify-between">
          <text class="text-[24rpx] text-[#999999]">
            交易额
          </text>
          <text class="text-[24rpx] text-[#999999]">
            USDT
          </text>
        </view>
        <!-- 可用余额 -->
        <view class="mt-[24rpx] flex items-center justify-between">
          <view class="flex flex-1 items-center">
            <text class="text-[24rpx] text-[#999999]">
              可用
            </text>
            <text class="ml-[8rpx] text-[24rpx] text-[#333333]">
              {{ availableBalance }} USDT
            </text>
          </view>
          <view
            class="h-[34rpx] w-[34rpx] flex items-center justify-center rounded-[4rpx] bg-[#FAE4E6]"
            @tap="handleAdd"
          >
            <text class="text-[24rpx] text-[#E53935]">
              +
            </text>
          </view>
        </view>
        <!-- 买入按钮 -->
        <view class="mt-[40rpx]">
          <u-button
            text="买入 IP" :color="activeTab === 'buy' ? '#E53935' : '#4CAF50'"
            :custom-style="{ width: '100%', height: '88rpx', borderRadius: '8rpx', fontSize: '32rpx' }"
          />
        </view>
      </view>

      <!-- 右侧报价列表 -->
      <view class="h-[680rpx] w-[280rpx] flex flex-col p-r-[20rpx]">
        <!-- 标题栏 -->
        <view class="flex items-center justify-between px-[12rpx] text-[24rpx] text-[#999]">
          <text>价格<br> (USDT)</text>
          <text>数量 <br>(IP)</text>
        </view>

        <!-- 卖单列表 -->
        <view class="flex-1 overflow-y-auto">
          <view class="mt-[24rpx]">
            <view
              v-for="(item, index) in sellOrders" :key="index"
              class="relative mb-[12rpx] flex items-center justify-between px-[12rpx]"
            >
              <!-- 修改卖单列表的背景样式 -->
              <view
                class="absolute bottom-0 right-[12rpx] top-0 bg-[#FFE4E1] transition-all duration-300"
                :style="{ width: `${(Number(item.amount.replace('K', '000')) / 1500) * 100}%` }"
              />
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
          <view class="my-[12rpx] flex items-center justify-between bg-[#F8F8F8] px-[12rpx] py-[8rpx]">
            <view>
              <text
                class="text-[28rpx] font-bold transition-colors duration-100" :class="{
                  'text-[#333]': !priceChangeDirection,
                  'text-[#E53935]': priceChangeDirection === 'up',
                  'text-[#00B069]': priceChangeDirection === 'down',
                }"
              >
                {{ currentPrice }}
              </text>
              <view class="mt-[4rpx]">
                <text class="text-[20rpx] text-[#999]">
                  ≈ ¥{{ (currentPrice * 7.23).toFixed(4) }}
                </text>
              </view>
            </view>
          </view>

          <!-- 买单列表 -->
          <view>
            <view
              v-for="(item, index) in buyOrders" :key="index"
              class="relative mb-[12rpx] flex items-center justify-between px-[12rpx]"
            >
              <!-- 添加背景色柱状图 -->
              <view
                class="absolute bottom-0 right-0 top-0 bg-[#E8F5E9] transition-all duration-300"
                :style="{ width: `${(Number(item.amount.replace('K', '000')) / 1500) * 100}%` }"
              />
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
    <view class="mt-[40rpx] px-[28rpx]">
      <view class="flex items-center justify-between">
        <view class="flex items-center gap-[12rpx]">
          <text class="text-[32rpx] text-[#333] font-bold">
            IP/USDT
          </text>
          <view class="border-[2rpx] border-[#E6302F] rounded-[4rpx] border-solid p-x-[8rpx] p-y-[4rpx]">
            <text class="text-[24rpx] text-[#E6302F]">
              买入
            </text>
          </view>
          <view class="border-[2rpx] border-[#F7B966] rounded-[4rpx] border-solid p-x-[8rpx] p-y-[4rpx]">
            <text class="text-[24rpx] text-[#F7B966]">
              限价
            </text>
          </view>
        </view>
        <view class="text-[28rpx] text-[#999] font-500">
          2025-02-28 16:26:22
        </view>
      </view>
    </view>
    <view class="mt-[40rpx] flex items-center justify-between px-[28rpx]">
      <view class="flex flex-col items-center justify-center">
        <view class="text-[44rpx] text-[#333] font-bold">
          0.46988
        </view>
        <view class="text-[24rpx] text-[#666]">
          委托价格(USDT)
        </view>
      </view>

      <view class="flex flex-col items-center justify-center">
        <view class="text-[44rpx] text-[#333] font-bold">
          3
        </view>
        <view class="text-[24rpx] text-[#666]">
          委托数量(IP)
        </view>
      </view>
      <view class="flex flex-col items-center justify-center">
        <view class="text-[44rpx] text-[#333] font-bold">
          1.40964
        </view>
        <view class="text-[24rpx] text-[#666]">
          交易额(USDT)
        </view>
      </view>
    </view>

    <view class="mt-[40rpx] flex items-center justify-between px-[28rpx]">
      <view class="flex flex-col items-center justify-center">
        <view class="text-[44rpx] text-[#E6302F] font-bold">
          2
        </view>
        <view class="text-[24rpx] text-[#999]">
          已成交(IP)
        </view>
      </view>
      <view class="rounded-[8rpx] bg-[#FAE4E6] p-x-[68rpx] p-y-[16rpx] text-[#E6302F] font-bold">
        撤销
      </view>
    </view>
  </c-container>
</template>

<script setup lang="ts">
import icon_right from '@/static/images/home/back_icon.png';
import background_banner from '@/static/images/home/background_banner.png';
import home_icon1 from '@/static/images/home/home_icon1.png';
import home_icon2 from '@/static/images/home/home_icon2.png';
import home_icon3 from '@/static/images/home/home_icon3.png';
import home_icon4 from '@/static/images/home/home_icon4.png';
import home_icon5 from '@/static/images/home/home_icon5.png';
import { useUserStore } from '@/store';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const home_icon_list = ref([
  {
    icon: home_icon1,
    text: '1,440.6',
  },
  {
    icon: home_icon2,
    text: '1,441.1',
  },
  {
    icon: home_icon3,
    text: '1,456.2',
  },

]);
const userStore = useUserStore();
console.log('userStore.user_name', userStore.user_name);

// 当前激活的标签页（买入/卖出）
const activeTab = ref('buy'); // 默认选中买入

// TODO: 币种选择
const handleCurrency = () => {
  console.log('handleCurrency');
};

// 买入按钮点击事件
const handleBuy = () => {
  console.log('点击买入');
  activeTab.value = 'buy';
};

// 卖出按钮点击事件
const handleSell = () => {
  console.log('点击卖出');
  activeTab.value = 'sell';
};

// 添加 tooltip 控制变量
const showTooltip = ref(false);

// 添加 tooltip 切换方法
const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value;
};

// 买入价格
const buyPrice = ref('1,440.6');

// 滑动条相关变量
const minValue = ref(0);
const maxValue = ref(10);
const sliderValue = ref(5.46988);

// 滑动条改变事件
const handleSliderChange = (e: any) => {
  sliderValue.value = e.detail.value;
};

const handleSliderChanging = (e: any) => {
  sliderValue.value = e.detail.value;
};

// 添加定时器引用
let priceUpdateTimer: number | null = null;

// 添加点击其他区域关闭 tooltip
onMounted(() => {
  uni.setNavigationBarTitle({
    title: '行情',
  });

  // 每 2 秒更新一次价格
  // eslint-disable-next-line ts/no-use-before-define
  priceUpdateTimer = setInterval(updatePrice, 2000);
});

onPageScroll(() => {
  if (showTooltip.value) {
    showTooltip.value = false;
  }
});

// 这里可以添加行情数据的获取和处理逻辑
const availableBalance = ref('6.51828322');

const handleAdd = () => {
  console.log('点击添加');
};

// 卖单数据
const sellOrders = ref([
  { price: '10.666', amount: '1.21K' },
  { price: '10.665', amount: '453.94' },
  { price: '10.664', amount: '237.66' },
  { price: '10.663', amount: '118.59' },
  { price: '10.662', amount: '142.77' },
]);

// 买单数据
const buyOrders = ref([
  { price: '10.659', amount: '0.15' },
  { price: '10.658', amount: '0.61' },
  { price: '10.657', amount: '91.57' },
  { price: '10.656', amount: '330.53' },
  { price: '10.655', amount: '550.94' },
]);

// 添加当前价格的响应式引用
const currentPrice = ref(10.659);
const priceChangeDirection = ref<'up' | 'down' | null>(null);

// 更新价格的函数
const updatePrice = () => {
  const oldPrice = currentPrice.value;
  // 随机生成价格变化
  const change = (Math.random() - 0.5) * 0.01;
  currentPrice.value = Number((oldPrice + change).toFixed(3));

  // 设置价格变化方向
  priceChangeDirection.value = change > 0 ? 'up' : 'down';

  // 100ms 后重置方向，移除动画效果
  setTimeout(() => {
    priceChangeDirection.value = null;
  }, 100);

  // 更新买卖单数据
  // eslint-disable-next-line ts/no-use-before-define
  updateOrderBooks();
};

// 更新买卖单数据
const updateOrderBooks = () => {
  // 更新卖单
  sellOrders.value = sellOrders.value.map((_order, index) => ({
    price: (currentPrice.value + (0.001 * (5 - index))).toFixed(3),
    amount: (Math.random() * 1000 + 100).toFixed(2),
  }));

  // 更新买单
  buyOrders.value = buyOrders.value.map((_order, index) => ({
    price: (currentPrice.value - (0.001 * (index + 1))).toFixed(3),
    amount: (Math.random() * 1000 + 100).toFixed(2),
  }));
};

// 在组件卸载前清除定时器
onBeforeUnmount(() => {
  if (priceUpdateTimer) {
    clearInterval(priceUpdateTimer);
  }
});
</script>

<style>
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
</style>
