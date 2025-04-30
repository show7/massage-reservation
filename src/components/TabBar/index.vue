<template>
  <view class="tab-bar-container safe-bottom">
    <view class="tab-bar-content flex w-full">
      <template v-for="(item, i) in allTabBarData" :key="i">
        <view
          :class="[
            'tab-item',
            item.path == tabBarStore.currentTabInfo.path ? 'active' : '',
          ]"
          v-if="item.type !== 'constom'"
          @click="tabChange(item)"
        >
          <image
            :src="
              item.path == tabBarStore.currentTabInfo.path
                ? item.selectedIconPath
                : item.iconPath
            "
            mode="aspectFit"
            class="tab-icon"
          />
          <text class="tab-text">{{ item.text }}</text>
        </view>
        <view v-else class="tab-item appointment" @click="tabChange(item)">
          <view class="appointment-btn">
            <text>{{ item.text }}</text>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { allTabBarData } from "@/config";
import { useTabBarStore } from "@/store";
import { Native, JUMP_TYPE } from "@/utils";
const tabBarStore = useTabBarStore();
// tab 配置

const tabChange = (item: any) => {
  tabBarStore.setTabBar(item);
  Native.push(JUMP_TYPE.SELF, { url: item.path });
};
</script>

<style lang="scss">
/* 底部导航样式 */
.tab-bar-container {
  position: fixed;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: #fff;
  border-top: 1rpx solid #eee;
}
.tab-bar-content {
  height: 100rpx;
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

.active .tab-text {
  color: #1296db;
}

.appointment {
  position: relative;
  top: -30rpx;
}

.appointment-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #1296db;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 999;
}

.appointment-btn text {
  color: #fff;
  font-size: 28rpx;
}
</style>
