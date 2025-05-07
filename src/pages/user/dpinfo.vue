<template>
  <view class="container">
    <view class="form-section">
      <view class="form-item">
        <text class="label">选择家人</text>
        <picker
          mode="selector"
          v-if="familyList.length"
          :range="familyList"
          range-key="name"
          @change="onFamilyChange"
        >
          <view  :style="{ color: !state.familyId ? '#999999' : '#333' }">
            {{ selectedFamily?.name || '请选择家人' }}
          </view>
        </picker>
        <button class="add-btn" v-else @click="addMember">添加家人</button>
      </view>

      <view class="form-item">
        <text class="label">备注信息</text>
        <textarea
          v-model="state.caseDesc"
           :style="{ color: !state.caseDesc ? '#999999' : '#333' }"
          class="textarea"
          placeholder="请输入备注内容..."
          maxlength="200"
        />
      </view>
    </view>

    <button class="submit-btn" @click="submitReserve">提交</button>
  </view>
</template>

<script setup>
// Vue组合式API
import { ref,reactive } from 'vue'
import { onLoad,onShow } from "@dcloudio/uni-app";
import { Native, JUMP_TYPE } from "@/utils";
import request from "@/api";
// 家人列表
const familyList = ref([])
const selectedFamily = ref(null)

// 备注内容
const state = reactive({
  caseDesc:'',
  familyId:'',
  reservationId:'',
})

// 选择家人事件
const onFamilyChange = (e) => {
  const index = e.detail.value
  state.familyId = familyList.value[index].familyId
  selectedFamily.value = familyList.value[index]
}
const addMember = () => {
   Native.push(JUMP_TYPE.SELF, {
    url: `/pages/family/edit`,
  });
}

// 提交预约
const submitReserve =async () => {
  if (!state.familyId) {
    uni.showToast({ title: '请选择家人', icon: 'none' })
    return
  }
  let params = {
      ...state,
  }
 await request.sendRequestByKey('QT_ADD',params);


  uni.showToast({ title: '提交成功！', icon: 'success' })

  // setTimeout(() => {
  //   uni.navigateBack()
  // }, 1000)
}
const getList = async () => {
  const { data } = await request.sendRequestByKey('F_LIST');
  familyList.value = data
  
};

const getqtList = async () => {
  const { data } = await request.sendRequestByKey('QT_INFO',{reservationId:state.reservationId});
  if(data.length){
    let { reservationId,familyId,caseDesc} = data[0]
    data[0].name = data[0].nickName
    selectedFamily.value = data[0]
    state.reservationId = reservationId
    state.familyId = familyId
    state.caseDesc = caseDesc

  }
};
onShow(()=>{
    getList();
})
onLoad((options) => {
      if(options && options.reservationId){
        state.reservationId =  options.reservationId
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
