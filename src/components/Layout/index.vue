<template>
  <view class="layout-compoennt">
    <uni-nav-bar
      backgroundColor="rgba(255, 255, 255, 0)"
      statusBar
      :border="false"
    />
    <view class="relative">
      <image
        class="top-title-img mt-40 ml-30"
        :src="`${CDN_BASE_URL}/static/images/top-title.webp`"
        mode="scaleToFill"
      />
      <image
        class="luobo-img"
        :src="`${CDN_BASE_URL}/static/images/luobo.webp`"
        mode="scaleToFill"
      />
    </view>
    <view class="mt-24">
      <Notice
        :noticeList="noticeList"
        title="最新公告"
        :showTitle="true"
        :interval="4000"
        :duration="600"
      />
    </view>
    <view
      class="p-20 flex items-center justify-around gap-20 bg-white pt-30"
      v-if="navBarlist && navBarlist.length"
    >
      <view
        class="flex flex-col items-center"
        v-for="item in navBarlist"
        :key="item.name"
        @click="goToPage(item.path)"
      >
        <image class="w-62 h-62" :src="item.icon" mode="scaleToFill" />
        <view class="mt-20 text-26 text-black">{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { Native, JUMP_TYPE } from "@/utils";
import { CDN_BASE_URL } from "@/api/config/BASE_URL";
const noticeList = ref([
  "这是第一条公告，请注意查看相关信息。",
  "第二条公告，近期有重要活动，请大家积极参与。",
  "第三条公告，系统将在今晚进行维护，请提前做好准备。",
]);

interface navBarlist {
  name: string;
  path: string;
  icon: string;
}
interface Props {
  navBarlist: navBarlist[];
}
const props = defineProps<Props>();
const goToPage = (url: string) => {
  Native.push(JUMP_TYPE.SELF, { url });
};
</script>
<style lang="scss">
.layout-compoennt {
  background-color: #ebf8f5;
  .top-title-img {
    width: 577.08rpx;
    height: 56.25rpx;
  }
  .luobo-img {
    position: absolute;
    top: 0;
    right: 0;
    width: 131.25rpx;
    height: 200rpx;
  }
}
</style>
