<template>
  <view
    class="notice-board-container flex items-center px-26"
    v-if="state.noticeList.length > 0"
  >
    <image
      class="notice-icon w-32 h-32"
      :src="`${CDN_BASE_URL}/static/images/notice-icon.webp`"
      mode="scaleToFill"
    />
    <swiper
      class="notice-swiper flex-1 ml-22"
      vertical="true"
      autoplay="true"
      :interval="interval"
      circular="true"
      :duration="duration"
    >
      <swiper-item
        v-for="(item, index) in state.noticeList"
        :key="index"
        @click="goToNoticeList"
      >
        <view class="notice-item flex items-center h-full">
          <view class="text-ellipsis-1">{{ item.title }}</view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts" setup>
import request from "@/api";
import { CDN_BASE_URL } from "@/api/config/BASE_URL";
const props = defineProps({
  title: {
    type: String,
    default: "公告栏",
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 3000,
  },
  duration: {
    type: Number,
    default: 500,
  },
});
const state = reactive({
  noticeList: [],
});
const getNoticeList = async () => {
  try {
    const { rows = [] } = await request.sendRequestByKey(
      "GET_BUS_ANNOUNCEMENT_LIST"
    );
    state.noticeList = rows;
  } catch (error) {
    console.log(error);
  }
};
const goToNoticeList = () => {
  uni.navigateTo({
    url: "/pages/notice/index",
  });
};
onMounted(async () => {
  console.log("onMounted");
  getNoticeList();
});
</script>

<style scoped>
/* 引入 iconfont 样式 */
@import "@/static/iconfont/iconfont.css";

.notice-board-container {
  background-color: #e5e5e5;
}

.notice-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.iconfont {
  font-size: 20rpx;
  color: #f90;
  margin-right: 8rpx;
}

.notice-swiper {
  height: 87.5rpx;
  border-radius: 5rpx;
  overflow: hidden;
}

.notice-item {
  font-size: 28rpx;
  color: #0a66cf;
}
</style>
