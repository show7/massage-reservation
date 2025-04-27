<template>
  <view class="container">
    <!-- 家人列表 -->
    <scroll-view class="family-list" scroll-y="true">
      <view v-for="(member, index) in familyList" :key="index" class="family-card">
        <view class="info">
          <view class="row">
            <text class="label">姓名：</text>
            <text class="value">{{ member.name }}</text>
            <text class="label">关系：</text>
            <text class="value">{{ member.relation }}</text>
          </view>
          <view class="row">
            <text class="label">性别：</text>
            <text class="value">{{ member.gender }}</text>
            <text class="label">年龄：</text>
            <text class="value">{{ member.age }}</text>
          </view>
        </view>

        <!-- 编辑按钮 -->
        <button class="edit-icon-btn" @click="() => editMember(index)">
          编辑
        </button>
      </view>

      <view v-if="familyList.length === 0" class="empty">
        暂无家人信息，快来添加吧~
      </view>
    </scroll-view>

    <!-- 添加家人按钮 -->
    <view class="footer">
      <button class="add-btn" @click="addMember">+ 添加家人</button>
    </view>
  </view>
</template>

<script setup>
// 引入组合式API
import { reactive } from 'vue'

// 家人列表数据
const familyList = reactive([
  { name: '爸爸', gender: '男', age: '50', relation: '父亲' },
  { name: '妈妈', gender: '女', age: '48', relation: '母亲' },
  { name: '宝宝', gender: '男', age: '2', relation: '儿子' }
])

// 编辑成员
const editMember = (index) => {
  const member = familyList[index]
  const query = `index=${index}&name=${member.name}&gender=${member.gender}&age=${member.age}&relation=${member.relation}`
  uni.navigateTo({
    url: `/pages/family/edit?${query}`
  })
}

// 添加成员
const addMember = () => {
  uni.navigateTo({
    url: `/pages/family/edit`
  })
}
</script>

<style scoped>
/* 样式保持不变，继续陪伴着页面的灵魂起舞 */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20rpx;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.family-list {
  flex: 1;
  overflow-y: auto;
}

.family-card {
  background: #ffffff;
  margin-bottom: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.row {
  display: flex;
  align-items: center;
  margin-bottom: 6rpx;
}

.label {
  font-size: 26rpx;
  color: #999;
  width: 100rpx;
  text-align: right;
}
.value {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  width: 100rpx;
  text-align: left;
}

.edit-icon-btn {
  width: 150rpx;
  margin: 0 auto;
  height: 70rpx;
  line-height: 70rpx;
  background: linear-gradient(135deg, #66b1ff, #409eff);
  color: #ffffff;
  border-radius: 45rpx;
  font-size: 32rpx;
  text-align: center;
  box-shadow: 0 8rpx 16rpx rgba(102, 177, 255, 0.4);
  display: block;
  border: none;
}
.edit-icon-btn:active {
  transform: scale(0.96);
  box-shadow: 0 4rpx 8rpx rgba(102, 177, 255, 0.3);
}

.empty {
  text-align: center;
  color: #aaa;
  font-size: 28rpx;
  margin-top: 100rpx;
}

.footer {
  padding: 20rpx 0;
  background: #f5f7fa;
}

.add-btn {
  width: 90%;
  margin: 0 auto;
  height: 90rpx;
  position: fixed;
  bottom: 90rpx;
  right: 0;
  left: 0;
  line-height: 90rpx;
  background: linear-gradient(135deg, #66b1ff, #409eff);
  color: #ffffff;
  border-radius: 45rpx;
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
