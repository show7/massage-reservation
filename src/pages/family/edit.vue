<template>
  <view class="container">
    <view class="form-item">
      <text class="label">姓名</text>
      <input v-model="form.name" placeholder="请输入姓名" class="input" />
    </view>

    <view class="form-item">
      <text class="label">关系</text>
      <input v-model="form.relation" placeholder="请输入关系（如父亲/母亲/子女）" class="input" />
    </view>

    <view class="form-item">
      <text class="label">年龄</text>
      <input v-model="form.age" type="number" placeholder="请输入年龄" class="input" />
    </view>

    <view class="form-item">
      <text class="label">性别</text>
      <picker
        @change="onGenderChange"
        :value="genderIndex"
        :range="genderOptions"
        class="input"
      >
      <view :style="{ color: genderIndex != '' ? '#999999' : '#333' }">
      {{ genderOptions[genderIndex] || '请选择性别' }}
    </view>
      </picker>
    </view>

    <view class="button-area">
      <button type="primary" class="submit-button" @click="onSubmit">保存</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 表单数据
const form = ref({
  name: '',
  relation: '',
  age: '',
  gender: '',
});

// 性别选项
const genderOptions = ['男', '女'];
const genderIndex = ref(-1);

// 性别选择变化
const onGenderChange = (e) => {
  genderIndex.value = e.detail.value;
  form.value.gender = genderOptions[genderIndex.value];
};

// 表单提交
const onSubmit = () => {
  console.log('保存的表单数据:', form.value);
  
  if (!form.value.name || !form.value.relation || !form.value.age || genderIndex.value === -1) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    });
    return;
  }
  
  uni.showToast({
    title: '保存成功',
    icon: 'success'
  });

  // 可跳转、保存接口，随你安排
  // uni.navigateBack();
};
</script>

<style scoped>
.container {
  padding: 30rpx;
  background: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #666;
}

.input, .picker-text {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  background: #f7f8fa;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  font-size: 30rpx;
  color: #333;
  box-sizing: border-box;
}

.button-area {
  margin-top: 60rpx;
  text-align: center;
}

.submit-button {
  width: 80%;
  height: 90rpx;
  line-height: 90rpx;
  background: linear-gradient(135deg, #66b1ff, #409eff);
  color: #ffffff;
  border-radius: 45rpx;
  font-size: 32rpx;
  text-align: center;
  box-shadow: 0 8rpx 16rpx rgba(102, 177, 255, 0.4);
  transition: all 0.2s ease;
}
.submit-button:active {
  transform: scale(0.96);
  box-shadow: 0 4rpx 8rpx rgba(102, 177, 255, 0.3);
}
</style>
