<template>
  <view class="container">


    <!-- 历史记录列表 -->
    <view class="record-item" v-for="(item, index) in recordList" :key="index" >
      <!-- 历史记录标题 -->
      <view class="section-title" v-if="index == 1">历史记录</view>
      <view class="record-header" >
        <text class="cell">{{item.nickName}}：{{item.projectName}}，时长{{item.projectTime}}分钟，预约时间{{item.createTime}}</text>
      </view>
      <view class="record-body"  >
        <view class="textarea-box">
          <text class="label">问题描述</text>
          <view >{{ item.caseDesc }}</view>
        </view>

        <view class="textarea-box">
          <text class="label">技师建议</text>
          <view   v-for="(items,index) in item.answers" :key="index">
            {{ items.techName}}：{{items.answerDesc}}
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
import { onLoad } from "@dcloudio/uni-app";
import request from "@/api";
const reservationId = ref('')
const recordList = ref([])

const inputText = ref('')
const getList = async () => {
  const { data } = await request.sendRequestByKey('QT_INFO', {reservationId:reservationId.value});
  recordList.value = data
  // recordList.value = [
  //   {nickName:'111111'},
  //      {nickName:'222'},
  // ]
};
const submitSuggestion = async () => {
  if (!inputText.value.trim()) {
    uni.showToast({ title: '内容不能为空', icon: 'none' })
    return
  }
  if(!recordList.value.length){
     uni.showToast({ title: '请联系管理员', icon: 'none' })
    return 
  }
  let params = {
    "answerDesc":  inputText.value,
    "reservationId": reservationId.value,
    "caseId": recordList.value[0].caseId || '',
    "techId": recordList.value[0].nowTechId || ''
    
  }
  await request.sendRequestByKey('ADD_ANSWER',params );
  inputText.value = ''
  uni.showToast({ title: '回答成功！', icon: 'success' })
}
onLoad((options) => {
   reservationId.value = options && options.reservationId
   getList();
});
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 150rpx;
  min-height: 100vh;
  color: #fff;
  background-image: linear-gradient(to bottom, #a88bdb, #8ba5db, #b8d1e8, #f5d6e0);
}

.header {
  display: flex;
  justify-content: center;
  margin-bottom: 30rpx;
}

.info-box {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: space-between;
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
  margin-bottom: 10rpx;
}
.record-body{
  border-top: 1px solid rgba(0,0,0,0.1);
}
.cell {
  font-size: 26rpx;
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
