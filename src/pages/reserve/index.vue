<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">全部服务</text>
    </view>

    <view class="content-wrapper">
      <!-- 左侧菜单栏 -->
      <view class="sidebar">
        <view
          v-for="(item, index) in menuItems"
          :key="index"
          class="menu-item"
          :class="{ active: currentService === item.id }"
          @click="selectService(item.id)"
        >
          <text>{{ item.name }}</text>
        </view>
      </view>

      <!-- 右侧内容区 -->
      <view class="content-area" :style="gradientStyle">
        <OnlineServices v-if="currentService === 'appointment'" />
      </view>
    </view>

    <!-- 底部导航 -->
    <TabBar />
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import OnlineServices from "./components/OnlineServices/index.vue";
// 菜单项数据
const menuItems = ref([
  { id: "appointment", name: "在线预约" },
  { id: "location", name: "定位导航" },
  { id: "consultation", name: "问诊咨询" },
  { id: "children", name: "小儿调理" },
  { id: "eastSquare", name: "东方广场总店" },
  { id: "xiangshan", name: "象山二路旗舰店" },
]);

// 当前选中的服务
const currentService = ref("appointment");

// 选择服务
const selectService = (serviceId) => {
  currentService.value = serviceId;
};

// 背景渐变样式
const gradientStyle = computed(() => {
  return {
    backgroundImage:
      "linear-gradient(to bottom, #a88bdb, #8ba5db, #b8d1e8, #f5d6e0)",
  };
});
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
}

/* 顶部标题样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.title {
  font-size: 36rpx;
  color: #333;
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

/* 内容区布局 */
.content-wrapper {
  display: flex;
  flex: 1;
  width: 100%;
}

/* 左侧菜单栏样式 */
.sidebar {
  width: 200rpx;
  background-color: #f5f5f5;
}

.menu-item {
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #e0e0e0;
  font-size: 28rpx;
  color: #a88bdb;
  text-align: center;
  padding: 0 10rpx;
}

.menu-item.active {
  background-color: #a88bdb;
  color: #fff;
}

/* 右侧内容区样式 */
.content-area {
  flex: 1;
  padding: 30rpx;
  min-height: 1000rpx; /* 确保内容区足够高 */
}

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
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 20rpx;
}

.service-title {
  font-size: 32rpx;
  color: #a88bdb;
  font-weight: bold;
}

/* 底部导航样式 */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tab-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 4rpx;
}

.tab-text {
  font-size: 22rpx;
  color: #666;
}

.appointment {
  position: relative;
  top: -30rpx;
}

.appointment-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.appointment-btn text {
  color: #fff;
  font-size: 28rpx;
}
</style>
