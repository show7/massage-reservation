<template>
  <view class="service-description">
    <text
      >康特推拿是任田院长于2004年创办的一家专门做中医推拿的推拿馆。我们的服务项目包括伤科推拿、内科推拿、小儿推拿等。我们的宗旨是解除您疼痛，还您一个健康生活。</text
    >
  </view>
  <view class="service-card" v-if="!state.pagetype" @click="state.pagetype = 1">
    <image
      src="/static/images/user-avatar-default.webp"
      mode="aspectFit"
      class="service-image"
    />
    <text class="service-title">小儿调理</text>
  </view>
  <view class="flex flex-col gap-20" v-else>
    <view class="p-30 bg-white rounded-20 flex" @click="gotoPage">
      <view class="mr-20">
        <image
          src="/static/images/user-avatar-default.webp"
          mode="aspectFit"
          class="user-image"
        />
        <text class="user-name text-yellow">小儿调理</text>
      </view>
      <view class="text-24 text-yellow">
        康特推拿是任田院长于2004年创办的一家专门做中医推拿的推拿馆。我们的服务项目包括伤科推拿、内科推拿、小儿推拿等。我康特推拿是任田院长于2004年创办的一家专门做中医推拿的推拿馆。我们的服务项目包括伤科推拿、内科推拿、小儿推拿等。我
      </view>
    </view>
  </view>
</template>

<script setup>
const state = reactive({
  pagetype: 0,
});
const gotoPage = () => {
  uni.navigateTo({
    url: "/pages/reserve/reserve",
  });
};
</script>

<style>
.service-description {
  margin-bottom: 40rpx;
  line-height: 1.6;
  font-size: 28rpx;
  color: #333;
}

.service-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.service-image {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 20rpx;
}

.service-title {
  font-size: 32rpx;
  color: #a88bdb;
  font-weight: bold;
}
.user-image {
  width: 150rpx;
  height: 250rpx;
}
</style>
