<template>
  <picker
    class="relative"
    mode="date"
    :value="value"
    :start="startDate"
    :end="endDate"
    @change="handleDateChange"
    :disabled="disabled"
  >
    <view>
      <uni-easyinput
        class="w-full"
        type="text"
        readonly
        :disabled="disabled"
        :clearable="false"
        v-model="value"
        :placeholder="placeholder"
      >
        <template #right>
          <!-- 这里可以自定义 append 插槽图标 -->
          <slot name="right">
            <uni-icons class="mr-10" type="calendar" size="18" color="#999" />
          </slot>
        </template>
      </uni-easyinput>
      <text
        @click.stop="clear"
        class="clear-icon absolute right-30 iconfont icon-shanchu text-info"
        v-if="clearable && value"
      ></text>
    </view>
  </picker>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from "vue";

// 定义 props
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "请选择日期",
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  start: {
    type: String,
    default: "",
  },
  end: {
    type: String,
    default: "",
  },
});

// 定义 emits
const emits = defineEmits(["update:modelValue", "change"]);

// 双向绑定的值
const value = ref(props.modelValue);

// 监听 props 的变化，更新 value
watch(
  () => props.modelValue,
  (newVal) => {
    value.value = newVal;
  }
);

// 监听 value 的变化，触发 update:modelValue 事件
watch(value, (newVal) => {
  emits("update:modelValue", newVal);
});

// 计算开始日期和结束日期
const startDate = computed(() => {
  if (props.start) {
    return props.start;
  }
  return getDate("start");
});

const endDate = computed(() => {
  if (props.end) {
    return props.end;
  }
  return getDate("end");
});

// 处理日期选择变化
const handleDateChange = (e: any) => {
  value.value = e.detail.value;
  emits("update:modelValue", e.detail.value);
  emits("change", e.detail.value);
};

const clear = () => {
  handleDateChange({ detail: { value: "" } });
};

// 获取日期的函数
const getDate = (type: string) => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (type === "start") {
    year = year - 60;
  } else if (type === "end") {
    year = year + 2;
  }

  let monthStr = month > 9 ? month.toString() : "0" + month;
  let dayStr = day > 9 ? day.toString() : "0" + day;

  return `${year}-${monthStr}-${dayStr}`;
};
</script>

<style scoped>
/* 可以在这里添加自定义样式 */
.clear-icon {
  right: 50rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
  font-size: 32rpx;
}
</style>
