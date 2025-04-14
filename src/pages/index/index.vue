<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">康特推拿</text>
    </view>
    <!-- Banner 轮播区域 -->
    <swiper
      class="banner-swiper"
      circular
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="500"
    >
      <swiper-item v-for="(item, index) in state.bannerList" :key="index">
        <image :src="item.image" mode="aspectFill" class="banner-image" />
      </swiper-item>
    </swiper>

    <!-- 服务功能区 -->
    <view class="service-grid">
      <view
        class="service-item"
        v-for="(item, index) in state.kingList"
        :key="index"
        @click="navigateToService(item.id)"
      >
        <image :src="item.icon" mode="aspectFit" class="service-icon" />
        <text class="service-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 关于我们 -->
    <view class="about-section">
      <view class="section-title">关于我们</view>
      <image
        src="/static/images/about.jpg"
        mode="widthFix"
        class="about-image"
      />
    </view>

    <!-- 底部导航 -->
    <TabBar />
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import request from "@/api";
const state = reactive({
  bannerList: [],
  kingList: [],
});
// Banner 轮播数据
const bannerList = ref([
  {
    id: 1,
    image: "/static/images/banner.png",
    title: "康特推拿",
  },
  {
    id: 2,
    image: "/static/images/banner.png",
    title: "线上预约 正式上线",
  },
  {
    id: 3,
    image: "/static/images/banner.png",
    title: "专业推拿服务",
  },
]);

// 服务功能数据
const kingList = ref([
  {
    id: 1,
    name: "在线预约",
    icon: "/static/images/user-avatar-default.webp",
    url: "/pages/appointment/index",
  },
  {
    id: 2,
    name: "问诊咨询",
    icon: "/static/images/user-avatar-default.webp",
    url: "/pages/consultation/index",
  },
  {
    id: 3,
    name: "定位导航",
    icon: "/static/images/user-avatar-default.webp",
    url: "/pages/location/index",
  },
  {
    id: 4,
    name: "儿推报号",
    icon: "/static/images/user-avatar-default.webp",
    url: "/pages/children/index",
  },

  {
    id: 5,
    name: "东方广场总店",
    icon: "/static/images/user-avatar-default.webp",
    address: "东方广场A座1层",
  },
  {
    id: 6,
    name: "象山二路旗舰店",
    icon: "/static/images/user-avatar-default.webp",
    address: "象山二路商业街12号",
  },
  {
    id: 7,
    name: "小儿调理",
    icon: "/static/images/user-avatar-default.webp",
    address: "专业小儿推拿",
  },
  {
    id: 8,
    name: "敬请期待",
    icon: "/static/images/user-avatar-default.webp",
    address: "更多门店敬请期待",
  },
]);

// 导航到服务页面
const navigateToService = (id) => {
  const service = kingList.value.find((item) => item.id === id);
  if (service && service.url) {
    uni.navigateTo({
      url: service.url,
    });
  }
};
const getBannerData = async () => {
  try {
    //const res = await request.sendRequestByKey("GET_BANNER_LIST");
    //console.log("请求成功：", res);
    state.bannerList = bannerList;
  } catch (err) {
    console.error("请求失败：", err);
  }
};
const getKingData = async () => {
  try {
    //const res = await request.sendRequestByKey("GET_BANNER_LIST");
    //console.log("请求成功：", res);
    state.kingList = kingList;
  } catch (err) {
    console.error("请求失败：", err);
  }
};
// 导航到分店页面
const navigateToBranch = (id) => {
  uni.navigateTo({
    url: `/pages/branch/detail?id=${id}`,
  });
};
onLoad(() => {
  getBannerData();
  getKingData();
});
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部标题样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
}

.title {
  font-size: 36rpx;
  color: #4caf50;
  font-weight: bold;
}

.header-icons {
  display: flex;
  align-items: center;
}

.dots {
  margin-right: 20rpx;
  font-size: 24rpx;
}

.circle {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #333;
}

/* Banner 轮播样式 */
.banner-swiper {
  width: 100%;
  height: 350rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
}

/* 服务功能区样式 */
.service-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.service-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.service-icon {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 10rpx;
}

.service-name {
  font-size: 24rpx;
  color: #333;
}

/* 分店区域样式 */
.branch-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.branch-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.branch-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-bottom: 10rpx;
}

.branch-name {
  font-size: 24rpx;
  color: #333;
}

/* 关于我们样式 */
.about-section {
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 120rpx; /* 为底部导航留出空间 */
}

.section-title {
  font-size: 32rpx;
  color: #4caf50;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.about-image {
  width: 100%;
  border-radius: 8rpx;
}
</style>
