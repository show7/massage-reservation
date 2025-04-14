<template>
  <view class="date-range-picker flex items-center gap-10">
    <!-- 开始日期选择 -->
    <picker
      mode="date"
      :value="startDate"
      start="2000-01-01"
      end="2099-12-31"
      @change="onStartDateChange"
    >
      <uni-easyinput
        class="bg-white text-36"
        type="text"
        readonly
        v-model="startDate"
        :clearable="false"
        placeholder="开始日期"
      />
    </picker>
    ~
    <!-- 结束日期选择 -->
    <picker
      mode="date"
      :value="endDate"
      :start="startDate"
      end="2099-12-31"
      @change="onEndDateChange"
    >
      <view class="relative">
        <uni-easyinput
          class="bg-white text-36"
          type="text"
          readonly
          :clearable="false"
          v-model="endDate"
          placeholder="结束日期"
        />
        <text
          class="clear-icon absolute right-30 iconfont icon-shanchu text-info"
          v-if="clearable && value.startDate && value.endDate"
          @click.stop="clear"
        ></text>
      </view>
    </picker>
    <!-- 确认和取消按钮 -->
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

// 定义 props 类型和默认值
const props = withDefaults(
  defineProps<{
    value: {
      startDate: string;
      endDate: string;
    };
    clearable?: boolean; // 使用可选类型
  }>(),
  {
    clearable: true, // 为 clearable 提供默认值
  }
);

// 定义 emit 事件类型
const emit = defineEmits<{
  (e: "update:value", value: { startDate: string; endDate: string }): void;
  (e: "confirm", value: { startDate: string; endDate: string }): void;
  (e: "cancel"): void;
}>();

// 格式化日期函数
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 开始日期计算属性，实现双向绑定
const startDate = computed(
  () => props.value.startDate //|| formatDate(new Date())
);

// 结束日期计算属性，实现双向绑定
const endDate = computed(
  () => props.value.endDate //|| formatDate(new Date())
);

// 开始日期选择事件处理函数
const onStartDateChange = (e: any) => {
  const newStartDate = e.detail.value;
  console.log(newStartDate);
  // 如果结束日期小于新的开始日期，更新结束日期为新的开始日期
  if (endDate.value && newStartDate) {
    emit("update:value", {
      ...props.value,
      endDate: endDate.value < newStartDate ? newStartDate : endDate.value,
      startDate: newStartDate,
    });
    onConfirm();
  } else {
    emit("update:value", {
      ...props.value,
      startDate: newStartDate,
    });
  }
};

// 结束日期选择事件处理函数
const onEndDateChange = (e: any) => {
  const newEndtDate = e.detail.value;
  if (startDate.value && newEndtDate) {
    emit("update:value", {
      ...props.value,
      endDate: newEndtDate,
      startDate: startDate.value,
    });
    onConfirm();
  } else {
    emit("update:value", {
      ...props.value,
      endDate: e.detail.value,
    });
  }
  //onConfirm();
};

// 确认按钮点击事件处理函数
const onConfirm = () => {
  console.log("选择的日期范围：", startDate.value, " - ", endDate.value);
  // 触发确认事件
  emit("confirm", { startDate: startDate.value, endDate: endDate.value });
};
const clear = () => {
  emit("update:value", {
    startDate: "",
    endDate: "",
  });
  onConfirm();
};
// 取消按钮点击事件处理函数
const onCancel = () => {
  // 重置日期为当前日期
  const currentDate = formatDate(new Date());
  emit("update:value", {
    startDate: currentDate,
    endDate: currentDate,
  });
  // 触发取消事件
  emit("cancel");
};
</script>

<style scoped>
.date-range-picker {
}

.picker-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.button-group {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.button-group button {
  width: 40%;
}
.clear-icon {
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
  font-size: 32rpx;
}
</style>
