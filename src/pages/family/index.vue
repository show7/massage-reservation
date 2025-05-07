<template>
  <view class="container">
    <!-- 家人列表 -->
    <scroll-view class="family-list" scroll-y="true">
      <view v-for="(member, index) in familyList" :key="index"   class="family-card">
        <view class="info">
          <view class="row">
            <text class="label">称呼：</text>
            <text class="value">{{ member.name }}</text>
            <text class="label">性别：</text>
            <text class="value">{{ member.gender ? '男' : '女' }}</text>
              <text class="label">出生日期：</text>
            <text class="value">{{ member.age }}</text>
          </view>
        </view>
        <view class="actions">
          <button class="edit-icon-btn" @click="editMember(member)">编辑</button>
          <button class="delete-icon-btn" @click="delMember(member)">删除</button>
        </view>

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
import { ref } from 'vue'
import request from "@/api";
import { onShow } from "@dcloudio/uni-app";

// 家人列表数据
const familyList = ref([])
// 表单提交
const getList = async () => {
  const {data} = await request.sendRequestByKey('F_LIST');
  familyList.value = data
};
// 编辑成员
const editMember = (member) => {
  const query = `name=${member.name}&gender=${member.gender}&age=${member.age}&familyId=${member.familyId}`
  uni.navigateTo({
    url: `/pages/family/edit?${query}`
  })
}

const delMember = async (member) => {
  console.log(`11112222->`,member)

  uni.showModal({
    title: '确认删除',
    content: `确定要删除【${member.name}】吗？`,
    success: async (res) => {
      if (res.confirm) {
        await request.sendRequestByKey('F_DELETE', { familyId: member.familyId });
        await getList(); // 或手动 splice
        uni.showToast({
          title: '已删除',
          icon: 'success'
        });
      }
    }
  });
}

// 添加成员
const addMember = () => {
  uni.navigateTo({
    url: `/pages/family/edit`
  })
}
onShow(() => {
  getList();
});
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
  flex-direction: column;
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
  margin: 20rpx;
  text-align: right;
}
.value {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  text-align: left;
}
.actions {
  display: flex;
  flex-direction: row;
  gap: 16rpx;
  margin: 20rpx;
}

.edit-icon-btn {
  width: 180rpx;
  margin: 0 auto;
  height: 50rpx;
  line-height: 50rpx;
  background: linear-gradient(135deg, #66b1ff, #409eff);
  color: #ffffff;
  border-radius:15rpx;
  font-size: 32rpx;
  margin-right: 15rpx;
  text-align: center;
  box-shadow: 0 8rpx 16rpx rgba(102, 177, 255, 0.4);
  display: block;
  border: none;
}
.edit-icon-btn:active {
  transform: scale(0.96);
  box-shadow: 0 4rpx 8rpx rgba(102, 177, 255, 0.3);
}
.delete-icon-btn {
  width: 180rpx;
  margin: 0 auto;
  height: 50rpx;
  line-height: 50rpx;
  background: linear-gradient(135deg, #ff7875, #ff4d4f);
  color: #ffffff;
  border-radius:15rpx;
  font-size: 32rpx;
  text-align: center;
  box-shadow: 0 8rpx 16rpx rgba(255, 77, 79, 0.3);
  display: block;
  border: none;
}
.delete-icon-btn:active {
  transform: scale(0.96);
  box-shadow: 0 4rpx 8rpx rgba(255, 77, 79, 0.2);
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
