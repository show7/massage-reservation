<template>
  <view class="container">
    <view class="form-section">
      <view class="form-item">
        <text class="label">选择家人</text>
        <picker
          mode="selector"
          :range="familyList"
          range-key="name"
          @change="onFamilyChange"
        >
          <view class="picker-text">
            {{ selectedFamily?.name || '请选择家人' }}
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">备注信息</text>
        <textarea
          v-model="remark"
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
import { ref } from 'vue'

// 家人列表
const familyList = ref([
  { name: '爸爸', relation: '父亲' },
  { name: '妈妈', relation: '母亲' },
  { name: '宝宝', relation: '儿子' },
])

// 当前选择的家人
const selectedFamily = ref(null)

// 备注内容
const remark = ref('')

// 选择家人事件
const onFamilyChange = (e) => {
  const index = e.detail.value
  selectedFamily.value = familyList.value[index]
}

// 提交预约
const submitReserve = () => {
  if (!selectedFamily.value) {
    uni.showToast({ title: '请选择家人', icon: 'none' })
    return
  }

  const data = {
    family: selectedFamily.value,
    remark: remark.value,
  }

  console.log('提交预约数据', data)

  uni.showToast({ title: '预约成功！', icon: 'success' })

  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
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
</style>
