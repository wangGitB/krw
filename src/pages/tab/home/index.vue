<template>
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
      <view class="h-[904rpx] w-[424rpx] flex flex-col px-[28rpx]">
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
              :class="[showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10rpx]']"
              @tap.stop
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
          <text class="text-[24rpx] text-[#999999]">
            IP
          </text>
        </view>

        <!-- 添加滑动条 -->
        <view class="relative mt-[24rpx] box-border rounded-sm bg-[#f8f9fa] p-[28rpx]">
          <slider
            :value="sliderValue" :min="minValue" :max="maxValue" :step="0.00000001" :block-size="12"
            :active-color="activeTab === 'BUY' ? '#E53935' : '#4CAF50'" background-color="#FFE4E1" class="slider-custom"
            @change="handleSliderChange" @changing="handleSliderChanging"
          />
        </view>

        <!-- 交易额显示 -->
        <view class="mt-[24rpx] box-border flex items-center justify-between rounded-sm bg-[#f8f9fa] p-[28rpx]">
          <text class="text-[24rpx] text-[#999999]">
            交易额
          </text>
          <text class="text-[24rpx] text-[#999999]">
            USDT
          </text>
        </view>

        <!-- 可用余额 -->
        <view class="mt-[24rpx] box-border flex items-center justify-between rounded-sm bg-[#f8f9fa] p-[28rpx]">
          <view class="flex flex-1 items-center">
            <text class="text-[24rpx] text-[#999999]">
              可用
            </text>
            <text class="ml-[8rpx] text-[24rpx] text-[#333333]">
              {{ source_amount }} USDT
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
            :text="activeTab === 'BUY' ? '买入 IP' : '卖出 IP'" :color="activeTab === 'BUY' ? '#E53935' : '#4CAF50'"
            :custom-style="{ width: '100%', height: '88rpx', borderRadius: '8rpx', fontSize: '32rpx' }"
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
              <!-- 修改卖单列表的背景样式 -->
              <!-- <view
                class="absolute bottom-0 right-[12rpx] top-0 bg-[#FFE4E1] transition-all duration-300"
                :style="{ width: `${(Number(item.amount.replace('K', '000')) / 1500) * 100}%` }"
              /> -->
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
              <text
                class="text-[28rpx] font-bold transition-colors duration-100"
              >
                {{ currentPrice }}
              </text>
              <!-- <view class="mt-[4rpx]">
                <text class="text-[20rpx] text-[#999]">
                  ≈ ¥{{ (currentPrice * 7.23).toFixed(4) }}
                </text>
              </view> -->
            </view>
          </view>

          <!-- 买单列表 -->
          <view class="mb-[24rpx]">
            <view
              v-for="(item, index) in buyOrders" :key="index"
              class="relative mb-[12rpx] h-[56rpx] flex items-center justify-between px-[12rpx]"
            >
              <!-- 添加背景色柱状图 -->
              <!-- <view
                class="absolute bottom-0 right-0 top-0 bg-[#E8F5E9] transition-all duration-300"
                :style="{ width: `${(Number(item.amount.replace('K', '000')) / 1500) * 100}%` }"
              /> -->
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
      <view v-for="item in 3" :key="item" class="mt-[24rpx] rounded-sm bg-#f8f9fa p-28rpx">
        <view class="px-[28rpx]">
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
      </view>
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
      :show="showMakeTypePopup"
      mode="bottom"
      :mask="true"
      :safe-area-inset-bottom="true"
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
          <view
            class="flex items-center justify-between py-[24rpx]"
            @click="selectMakeType('MARKET')"
          >
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
  </c-container>
</template>

<script setup lang="ts">
import type { SymbolInfosRes } from '@/api/home';
import { getSymbolInfos, getSymbolSetting } from '@/api/home';
import icon_right from '@/static/images/home/back_icon.png';
import background_banner from '@/static/images/home/background_banner.png';
import home_icon1 from '@/static/images/home/home_icon1.png';
import home_icon2 from '@/static/images/home/home_icon2.png';
import home_icon3 from '@/static/images/home/home_icon3.png';
import home_icon4 from '@/static/images/home/home_icon4.png';
import home_icon5 from '@/static/images/home/home_icon5.png';
import { getGoogleToken } from '@/utils';
import WebSocketService from '@/utils/ws';
// WebSocketService
import { onBeforeUnmount, onMounted, ref } from 'vue';

// 添加当前价格的响应式引用
const currentPrice = ref(0);
// 源币数量
const source_amount = ref('');
// 当前激活的标签页（买入/卖出）
const activeTab = ref('BUY'); // 默认选中买入
// 买入按钮点击事件
const handleBuy = () => {
  activeTab.value = 'BUY';
};

// 卖出按钮点击事件
const handleSell = () => {
  activeTab.value = 'SELL';
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

// 买入或卖出价格
const buyOrSellPrice = ref('');

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

const handleAdd = () => {
  console.log('点击添加');
};
// 卖单数据
const sellOrders = ref<{ price: string; amount: string }[]>([]);

// 买单数据
const buyOrders = ref<{ price: string; amount: string }[]>([]);

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
  console.log('收到服务端消息:', message);

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
    }
  }
  if (message.T === 'D') {
    currentPrice.value = message.price;
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

// 选择交易对
const selectSymbol = (item: SymbolInfosRes): void => {
  selectedSymbol.value = `${item.source_name}/${item.target_name}`;
  selectedUniqueSymbolId.value = getSymbolId(item);
  selectedSymbolId.value = item.target_id;
  selectedExchangeId.value = item.exchange_id;
  selectedSourceId.value = item.source_id;
  showSymbolPicker.value = false;
};

const handleCurrency = () => {
  showSymbolPicker.value = true;
};

// 获取交易对列表
const fetchSymbolList = async (): Promise<void> => {
  try {
    const res = await getSymbolInfos();
    console.log('交易对列表:', res);
    symbolList.value = res || [];
    // 如果有数据，默认选中第一个
    if (symbolList.value.length > 0) {
      const firstItem = symbolList.value[0];
      selectedSymbol.value = `${firstItem.target_name}/${firstItem.source_name}`;
      selectedUniqueSymbolId.value = getSymbolId(firstItem);
      selectedSymbolId.value = firstItem.target_id;
      selectedExchangeId.value = firstItem.exchange_id;
      selectedSourceId.value = firstItem.source_id;
    }
  }
  catch (error) {
    console.error('获取交易对列表失败:', error);
  }
};

// 获取交易对设置
const fetchSymbolSetting = async (): Promise<void> => {
  const res = await getSymbolSetting({ symbol_id: selectedSymbolId.value!, source_id: selectedSourceId.value!, exchange_id: selectedExchangeId.value! });
  console.log('交易对设置:', res);
  source_amount.value = res.source_amount_display;
};
const initData = async () => {
  await fetchSymbolList();
  await fetchSymbolSetting();
};
// 页面加载时获取交易对列表
onMounted(() => {
  // 添加全局点击事件监听
  document.addEventListener('click', () => {
    if (showTooltip.value) {
      closeTooltip();
    }
  });

  // 初始化数据
  initData();
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
</script>

<style scoped>
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
