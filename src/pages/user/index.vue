<template>
  <view class="user-component bg-green-light p-20">
    <uni-nav-bar
      backgroundColor="rgba(255, 255, 255, 0)"
      statusBar
      :border="false"
    />

    <view class="user-info_wrap flex flex-col gap-20 p-20">
      <view class="flex justify-between items-center" @click="goLogin">
        <view class="flex items-center gap-20">
          <image
            class="user-info__avatar"
            :src="
              userInfo.user.avatar || '/static/images/user-avatar-default.webp'
            "
            mode="scaleToFill"
          />

          <view class="gap-10 text-info"
            ><view class="text-42 mb-8">{{
              userInfo.user.name || "未登陆"
            }}</view>
            <view>
              <text class="iconfont icon-phone">{{
                userInfo.user.mobile?.replace(
                  /^(\d{3})\d{4}(\d{4})$/,
                  "$1****$2"
                ) || "未绑定手机号"
              }}</text>
            </view>
          </view>
        </view>
        <view>
          <text class="iconfont icon-bianji1 text-40 text-primary"></text
        ></view>
      </view>
      <view>
        <view class="user-meniu-content p-30 bg-white rounded-10 mt-30">
          <view
            class="flex justify-between items-center border-b-grey-light-4 py-14"
          >
            <text class="iconfont icon-fankuijianyi text-34 text-primary">
              <text class="text-black-little ml-20" @click="goLogin"
                >切换帐号
              </text>
            </text>
            <text class="iconfont icon-xiangqing text-38 text-info"></text>
          </view>
          <view
            class="flex justify-between items-center border-b-grey-light-4 py-14"
          >
            <text class="iconfont icon-fankuijianyi text-34 text-primary">
              <text class="text-black-little ml-20" @click="systemStore.logOut"
                >退出登录
              </text>
            </text>
            <text class="iconfont icon-xiangqing text-38 text-info"></text>
          </view>
        </view>
      </view>
    </view>
  </view>
  <TabBar path="/pages/user/index" />
</template>
<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import request from "@/api";
import { useSystemStore, useUserStore } from "@/store";
import { Native, JUMP_TYPE } from "@/utils";
import { CDN_BASE_URL } from "@/api/config/BASE_URL";
const userStore = useUserStore();
const systemStore = useSystemStore();
//getUserInfo
const { userInfo } = storeToRefs(userStore);
const state = reactive({ menuName: "", placeholder: "" });
const formData = reactive({
  orderId: "",
  menuId: "",
  canteenId: "",
  starrating: 0,
  remark: "",
});

const goPage = (key: string) => {
  Native.push(JUMP_TYPE.SELF, { url: pageMap[key as keyof typeof pageMap] });
};
const init = () => {
  userStore.getUserInfo();
};
const goLogin = () => {
  uni.navigateTo({
    url: "/pages/login/index",
  });
};
onLoad(() => {
  init();
});
</script>
<style lang="scss" scoped>
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
