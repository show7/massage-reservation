<template>
  <view>
    <uni-load-more :content-text="contentText" v-bind="$attrs"></uni-load-more>
  </view>
</template>

<script lang="ts" setup>
const contentText = {
  contentdown: "上拉查看更多",
  contentrefresh: "加载中...",
  contentnomore: "暂无更多数据",
};
</script>

<style lang="scss"></style>
