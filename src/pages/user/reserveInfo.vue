<template>
  <view class="container">
    <view class="form-section">
      <view class="form-item">
        <text class="label">家人</text>
          <view  :style="{ color: '#000' }">
            {{ state.nickName}}
          </view>
      </view>

      <view class="form-item">
        <text class="label">问题描述</text>
        <view  :style="{ color: '#000' }">
            {{ state.caseDesc}}
        </view>
      </view>
      <view class="form-item">
        <text class="label">建议</text>
        <view  :style="{ color: '#000' }" v-for="(item,index) in state.answers" :key="index">
            {{ item.techName}}：{{item.answerDesc}}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
// Vue组合式API
import { reactive } from 'vue'
import { onLoad,onShow } from "@dcloudio/uni-app";
import request from "@/api";

// 备注内容
const state = reactive({
  caseDesc:'',
  nickName:'',
  answers:[],
  reservationId:''
})


const getqtList = async () => {
  const { data } = await request.sendRequestByKey('QT_INFO_PHONE',{reservationId:state.reservationId});
  console.log(`output->`,data)
  if(data && data.length){
    let { answers,nickName,caseDesc} = data[0]
    state.nickName = nickName
    state.caseDesc = caseDesc
    state.answers = answers
  }
};
// onShow(()=>{
//     getqtList();
// })
onLoad((options) => {
      if(options && options.reservationId){
        state.reservationId = options.reservationId
        getqtList()
      }
});
</script>

<style scoped>
.container {
  padding: 30rpx;
  min-height: 100vh;
  background-color: #f8f8f8;
}

.form-section {
  background: #ffffff;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 12rpx;
  display: block;
}

.picker-text {
  padding: 20rpx;
  background: #f2f3f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #666666;
}

.textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  background: #f2f3f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}

.submit-btn {
  margin-top: 50rpx;
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background: linear-gradient(135deg, #66b1ff, #409eff);
  color: #ffffff;
  border-radius: 45rpx;
  font-size: 32rpx;
  text-align: center;
  box-shadow: 0 8rpx 16rpx rgba(102, 177, 255, 0.4);
  transition: all 0.3s ease;
}
.submit-btn:active {
  transform: scale(0.96);
  box-shadow: 0 4rpx 8rpx rgba(102, 177, 255, 0.3);
}
.add-btn {
  width: 90%;
  margin: 0 auto;
  height: 70rpx;
  line-height: 70rpx;
  background: linear-gradient(135deg, #66b1ff, #409eff);
  color: #ffffff;
  font-size: 32rpx;
  text-align: center;
  box-shadow: 0 8rpx 16rpx rgba(102, 177, 255, 0.4);
  display: block;
  border: none;
}
.add-btn:active {
  transform: scale(0.96);
  box-shadow: 0 4rpx 8rpx rgba(102, 177, 255, 0.3);
}
</style>
