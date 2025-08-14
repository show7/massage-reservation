<template>
  <view
    class="user-component bg-green-light p-20"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
    <uni-nav-bar backgroundColor="rgba(255, 255, 255, 0)" statusBar :border="false" />

    <!-- H5 下拉提示 -->
    <view v-if="isRefreshing" class="refresh-tip">正在刷新...</view>

    <view class="user-info_wrap flex flex-col gap-20 p-20">
      <!-- 用户信息 -->
      <view class="flex justify-between items-center" @click="avatarClick">
        <view class="flex items-center gap-20">
          <image class="user-info__avatar" :src="'/static/images/user-avatar-default.webp'" mode="scaleToFill" />
          <view class="gap-10 text-info">
            <view class="text-42 mb-8">{{ userInfo.nickName || "未登陆" }}</view>
            <view class="text-32 mb-8" style="color:#1296db;"> 积分：<text>{{ state.jf }}</text></view>
          </view>
        </view>
        <view>
          <text class="iconfont icon-bianji1 text-40 text-primary"></text>
        </view>
      </view>

      <!-- 菜单 -->
      <view class="user-meniu-content p-30 bg-white rounded-10 mt-30">
        <view class="flex justify-between items-center border-b-grey-light-4 py-14" @click="goPage('reserveList')">
          <text class="iconfont icon-fankuijianyi text-34 text-primary">
            <text class="text-black-little ml-20"> 预约列表 </text>
          </text>
          <text class="iconfont icon-xiangqing text-38 text-info"></text>
        </view>
        <view class="flex justify-between items-center border-b-grey-light-4 py-14" @click="goPage('family')">
          <text class="iconfont icon-fankuijianyi text-34 text-primary">
            <text class="text-black-little ml-20"> 我的家人 </text>
          </text>
          <text class="iconfont icon-xiangqing text-38 text-info"></text>
        </view>
        <view class="flex justify-between items-center border-b-grey-light-4 py-14" @click="goPage('login')">
          <text class="iconfont icon-fankuijianyi text-34 text-primary">
            <text class="text-black-little ml-20"> 切换帐号 </text>
          </text>
          <text class="iconfont icon-xiangqing text-38 text-info"></text>
        </view>
        <view class="flex justify-between items-center border-b-grey-light-4 py-14" @click="systemStore.logOut(false)">
          <text class="iconfont icon-fankuijianyi text-34 text-primary">
            <text class="text-black-little ml-20"> 退出登录 </text>
          </text>
          <text class="iconfont icon-xiangqing text-38 text-info"></text>
        </view>
      </view>
    </view>
  </view>
  <TabBar path="/pages/user/index" />
</template>

<script setup lang="ts">
import { onShow, onPullDownRefresh } from "@dcloudio/uni-app";
import request from "@/api";
import { useSystemStore, useUserStore } from "@/store";
import { Native, JUMP_TYPE } from "@/utils";

const userStore = useUserStore();
const systemStore = useSystemStore();
const { userInfo } = storeToRefs(userStore);
const state = reactive({ jf: null });

const isRefreshing = ref(false);
let startY = 0;
const threshold = 50; // 下拉触发距离

// 自定义 H5 下拉
const touchStart = (e: TouchEvent) => {
  if (process.env.UNI_PLATFORM !== "h5") return;
  startY = e.touches[0].clientY;
};
const touchMove = (e: TouchEvent) => {
  if (process.env.UNI_PLATFORM !== "h5") return;
  const moveY = e.touches[0].clientY - startY;
  if (moveY > threshold && !isRefreshing.value) {
    triggerRefresh();
  }
};
const touchEnd = () => {};

const triggerRefresh = async () => {
  isRefreshing.value = true;
  await getUserJf();
  setTimeout(() => {
    isRefreshing.value = false;
  }, 800);
};

const avatarClick = () => {
  if (userInfo.value.token) return;
  goPage("login");
};

const getUserJf = async () => {
  try {
    const res = await request.sendRequestByKey("GETJF");
    state.jf = res.data || 0;
  } catch (err) {
    console.error("获取信息失败", err);
  }
};

const goPage = (key: string) => {
  const pageMap = {
    reserveList: "/pages/user/reserveList",
    login: "/pages/login/index",
    family: "/pages/family/index",
  };
  Native.push(JUMP_TYPE.SELF, { url: pageMap[key] });
};

onShow(() => {
  getUserJf();
});

// 官方下拉刷新（小程序 / App）
onPullDownRefresh(async () => {
  await getUserJf();
  uni.stopPullDownRefresh();
});
</script>

<style lang="scss" scoped>
.refresh-tip {
  text-align: center;
  padding: 20rpx;
  color: #666;
  font-size: 28rpx;
}
.user {
  &-component {
    min-height: 100vh;
    background-image: linear-gradient(
      to bottom,
      #a88bdb,
      #8ba5db,
      #b8d1e8,
      #f5d6e0
    );
  }
  &-info {
    &__avatar {
      width: 180rpx;
      height: 180rpx;
      border-radius: 50%;
      margin: 0;
      padding: 0;
    }
    &__name {
      font-size: 40rpx;
    }
  }

  &-meniu-content {
    width: 100%;
    height: 568.75rpx;
    box-sizing: border-box;
  }
}
</style>
