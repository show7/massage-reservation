<template>
  <view class="quotation-component bg-green-light px-24 safe-bottom">
    <view class="flex flex-col gap-20 pt-30">
      <view
        class="bg-white py-24 px-30 rounded-20 text-24 box-border mt-50"
        v-for="(item, i) in state.tabData"
        :key="i"
      >
        <view
          class="flex-th-td-item flex justify-between items-center text-info text-24 border-b-info pb-14"
        >
          <view class="text-left text-30 text-black-little font-bold">
            {{ item.projectName }}
          </view>
          <view class="text-center text-30"> 编号：{{ item.workNums }} </view>
        </view>

        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left"> 创建时间：</view>
          <view class="flex-col-w-3 text-right">{{
            dayjs(item.createTime).format("YYYY-mm-DD")
          }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left"> 预约时间：</view>
          <view class="flex-col-w-3 text-right">{{ item.workDate }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left"> 开始时间：</view>
          <view class="flex-col-w-3 text-right">{{ item.startWorkTime }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left">结束时间：</view>
          <view class="flex-col-w-3 text-right">{{ item.endWorkTime }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left">名称：</view>
          <view class="flex-col-w-3 text-right">{{ item.techName }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left">门店名称：</view>
          <view class="flex-col-w-3 text-right">{{ item.storeName }}</view>
        </view>
        <view
          class="flex justify-between items-center text-black text-24 py-10"
        >
          <view class="flex-col-w-1 text-left">预约状态：</view>
          <view
            :class="[
              'flex-col-w-3 text-right',
              state.statusColorMap[item.reservationStatus].class,
            ]"
            >{{ state.statusColorMap[item.reservationStatus].text }}</view
          >
        </view>

        <view
          class="flex-th-td-item flex justify-end items-center text-info text-24 border-t-info my-14 pt-14"
        >
        
         <view
          class="flex justify-end items-center gap-10  mt-10 pt-20"
        >
          <view
            v-if="!item.reservationStatus"
            class="btn-normal bg-orange"
            @click="cancel(item)"
          >
            取消预约
          </view>
          <view
            class="btn-normal bg-blue"
            @click="goPage(item,'dpInfo')"
          >
            问题描述
          </view>
          <view
            class="btn-normal bg-green"
            @click="goPage(item,'reserveInfo')"
          >
            详情
          </view>
           <view
            v-if="state.isWb"
            class="btn-normal bg-zse"
            @click="sendTeacher(item)"
          >
            推送
          </view>
        </view>

        </view>
      </view>
    </view>
    <view v-if="!state.tabData.length && status !== 'loading'">
      <view
        class="bg-white rounded-10 px-26 my-50 text-24 flex flex-col gap-20"
        :style="`height:${contentViewHeight}`"
      >
        <view class="h-full flex flex-col justify-center items-center">
          <view class="iconfont icon-kongshuju text-80 text-info"> </view>
          <view class="text-info mt-20">暂无数据</view>
        </view>
      </view>
    </view>

    <LoadMore v-if="state.tabData.length" :status="status" />
  </view>

  <Dialog ref="DialogRef" />
</template>

<script setup lang="ts">
import { onShow,onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";

import { useUserStore, useSystemStore } from "@/store";
import { useLoadMore, usePagination, useQuerySelect } from "@/hooks";
import request from "@/api";
import dayjs from "dayjs";
import { Native, JUMP_TYPE } from "@/utils";

const userStore = useUserStore();
const systemStore = useSystemStore();
const instance = getCurrentInstance(); // 获取组件实例
const { status, setLoadMoreStatus } = useLoadMore();
const pagination = usePagination();
const DialogRef = ref<any>(null);
const state = reactive({
  isWb:false,
  tabData: [],
  headerHieght: 120,
  statusColorMap: {
    //1预约中,0已预约，1已取消，2已结束
    0: {
      text: "已预约",
      class: "text-success",
    },
    1: {
      text: "已取消",
      class: "text-info",
    },
    2: {
      text: "已结束",
      class: "text-info",
    },
  },
});

const formData = reactive({});

const contentViewHeight = computed(() => {
  return `calc(100vh - (${state.headerHieght}px + env(safe-area-inset-bottom)) )`;
});

onReachBottom(() => {
  console.log("触底", state.tabData.length);
  if (status.value !== "more") return;
  pagination.state.pageNum++;
  getData();
});
const search = () => {
  console.log("search");
  state.tabData = [];
  pagination.init();
  getData();
};
const getData = async () => {
  //ORDER_LIST
  setLoadMoreStatus("loading");
  const { pageNum, pageSize } = pagination.state;
  const params = {
    ...formData,
    pageNum: 1,
    pageSize: 10000000,
  };
  let { data = [], ...arg }: any = await request.sendRequestByKey(
    "GET_RESRVATION_LIST",
    params
  );
  state.tabData.push(...data);
  setLoadMoreStatus("noMore");
  pagination.create(arg);
};

const sendTeacher = async ({reservationId}) => {
try{
  await request.sendRequestByKey(
    "SEND_TE",
    {reservationId}
  );
  uni.showToast({ title: '推送成功！', icon: 'success' })
}catch(err){
   uni.showToast({ title: '推送失败', icon: 'error' })
}
};

const goPage = (item:object,key: string) => {
  const pageMap = {
    reserveInfo: "/pages/user/reserveInfo",
    dpInfo: "/pages/user/dpInfo",
  };
  Native.push(JUMP_TYPE.SELF, {
    url: `${pageMap[key as keyof typeof pageMap]}?reservationId=${item.reservationId}`,
  });
};
const cancel = async (item) => {
  try {
    const params = {
      workId: item.workId,
    };
    await DialogRef.value.showDialog({
      title: "提示",
      message: "确定要取消当前预约项目吗？",
      cancelButtonText: "取消",
      confirmButtonText: "确认",
    });
    const { data = [], ...arg }: any = await request.sendRequestByKey(
      "CANCEL_RESERVATION",
      params
    );
    search();
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  // const data = await useQuerySelect({
  //   instance,
  //   className: ".quotation__header",
  // });
  // console.log(data, "state.headerHieght");
  // state.headerHieght = data.height;
  search();
};

onPullDownRefresh(() => {
  init();
  uni.stopPullDownRefresh();
});
onShow(() => {
  init();
});
onLoad((options) => {
   state.isWb = options && options.from === 'qrscan'
});
</script>

<style lang="scss">
.quotation-component {
  min-height: 100vh;
  background-image: linear-gradient(
    to bottom,
    #a88bdb,
    #8ba5db,
    #b8d1e8,
    #f5d6e0
  );
.gap-20 {
  gap: 20rpx;
}
.btn-normal {
  padding: 10rpx 15rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #ffffff;
  min-width: 140rpx;
  text-align: center;
}

/* 背景色，换成温和版 */
.bg-orange {
  background: #f5a623; /* 橙色，用于"取消预约" */
}
.bg-blue {
  background: #409eff; /* 蓝色，用于"问题描述" */
}
.bg-green {
  background: #67c23a; /* 绿色，用于"详情" */
}
.bg-zse {
  background: #a88bdb; /* 蓝色，用于"问题描述" */
}
/* 如果需要 hover 点击效果可以加 */
.btn-normal:active {
  opacity: 0.8;
  transform: scale(0.96);
}

  .flex-col-w-1 {
    width: 50%;
  }

  .flex-col-w-3 {
    width: 40%;
  }

  .date-select-wrap {
    height: 45.83rpx;
  }
  .date-select-item {
    &:last-child {
      border-right: none;
    }
    &--active {
      color: #fff;
    }
  }
  .next-week-button {
    left: 20rpx;
    width: 158.33rpx;
    height: 81.25rpx;
    border-radius: 81.25rpx;

    bottom: 40rpx;
  }
  .audit-button {
    right: 20rpx;
    width: 158.33rpx;
    height: 81.25rpx;
    margin: 0;
    padding: 0;
    border-radius: 81.25rpx;

    bottom: 40rpx;
  }
}
</style>
