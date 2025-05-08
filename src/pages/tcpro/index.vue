<template>
  <view class="container">
    <!-- 顶部项目信息 -->
    <view class="header">
      <view class="info-box">项目：小儿推拿</view>
      <view class="info-box">时长：10分钟</view>
      <view class="info-box">编号：9号</view>
    </view>

    <!-- 历史记录标题 -->
    <view class="section-title">历史记录</view>

    <!-- 历史记录列表 -->
    <view class="record-item" v-for="(item, index) in recordList" :key="index">
      <view class="record-header">
        <text class="cell">时间</text>
        <text class="cell">项目</text>
        <text class="cell">时长</text>
      </view>
      <view class="record-body">
        <view class="textarea-box">
          <text class="label">问题描述</text>
          <view class="suggestion-content">{{ item.problemDesc }}</view>
        </view>

        <view class="textarea-box">
          <text class="label">技师建议</text>
          <view
            class="suggestion-content"
            
          >
            {{ item.suggestion || '暂无' }}
          </view>
        </view>
      </view>
    </view>

    <!-- 底部输入栏 -->
    <view class="chat-input-bar">
      <input
        class="chat-input"
        v-model="inputText"
        placeholder="请输入建议..."
        focus
      />
      <button class="chat-submit" @click="submitSuggestion">回答</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"
import { onShow } from "@dcloudio/uni-app";
import request from "@/api";
const recordList = ref([
  {
    time: '2025-05-08',
    project: '小儿推拿',
    duration: '10分钟',
    problemDesc: '肩颈紧张，稍微有点怕痒肩颈紧张，稍微有点怕痒肩颈紧张，稍微有点怕痒...肩颈紧张，稍微有点怕痒肩颈紧张，稍微有点怕痒肩颈紧张，稍微有点怕痒...肩颈紧张，稍微有点怕痒肩颈紧张，稍微有点怕痒肩颈紧张，稍微有点怕痒...',
    suggestion: '',
  },
  {
    time: '2025-05-06',
    project: '推背',
    duration: '15分钟',
    problemDesc: '推拿中哭闹，疑似不适应',
    suggestion: '',
  }
])

const inputText = ref('')
const getList = async () => {
  const { data } = await request.sendRequestByKey('GET_NOTECH_RESRVATION_LIST', { "pageNo": 1,
  "pageSize": 100,
  "techId": 1});
  console.log(`output->`,data)
  // familyList.value = data
};
const submitSuggestion = async () => {
  if (!inputText.value.trim()) {
    uni.showToast({ title: '内容不能为空', icon: 'none' })
    return
  }
  inputText.value = ''
  uni.showToast({ title: '回答成功！', icon: 'success' })
}
onShow(()=>{
  getList();
})
</script>

<style scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  color: #fff;
  background-image: linear-gradient(to bottom, #a88bdb, #8ba5db, #b8d1e8, #f5d6e0);
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.info-box {
  flex: 1;
  text-align: center;
  border: 2rpx solid #fff;
  padding: 16rpx;
  border-radius: 10rpx;
  margin: 0 6rpx;
}

.section-title {
  font-weight: bold;
  margin: 20rpx 0;
  text-align: center;
  border-bottom: 2rpx solid #ccc;
  padding-bottom: 10rpx;
}

.record-item {
  border-radius: 10rpx;
  padding: 16rpx;
  margin-bottom: 30rpx;
  background-color: rgba(154, 123, 178, 0.8);
}

.record-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.cell {
  width: 30%;
  font-weight: bold;
  text-align: center;
}

.textarea-box {
  margin-top: 10rpx;
  position: relative;
}

.label {
  font-size: 24rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}

.suggestion-content {
  min-height: 80rpx;
  padding: 12rpx;
  border: 2rpx dashed #fff;
  border-radius: 8rpx;
  background-color: rgba(255, 255, 255, 0.1);
  word-wrap: break-word;
}
.chat-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
  z-index: 999;
}

.chat-input {
  flex: 1;
  border: 2rpx solid #ccc;
  border-radius: 8rpx;
  padding: 12rpx 24rpx;
  font-size: 28rpx;
  margin-right: 20rpx;
  color: black;
}

.chat-submit {
  background-color: #007aff;
  color: white;
  padding: 0rpx 40rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}

</style>
