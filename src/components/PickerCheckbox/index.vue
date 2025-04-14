<template>
  <uni-popup
    ref="modal"
    type="bottom"
    class="popupbox"
    mask-background-color="rgba(0,0,0,0.7)"
    background-color="#fff"
    @maskClick="cancel"
  >
    <view class="set-border">
      <view class="popup-content">
        <view class="popup-main">
          <view class="popup-header">
            <text class="popup-header-left" @click="cancel">取消</text>
            <text class="popup-header-center">{{ title }}</text>
            <text class="popup-header-right" @click="submit">确认</text>
          </view>
          <view class="checkbox-list flex gap-20 flex-wrap">
            <view
              v-for="option in props.options"
              :key="option.id"
              class="checkbox-item"
              @click="handleCheckboxChange(option.id)"
            >
              <view
                :class="[
                  'iconfont font-40 mr-10',
                  isChecked(option.id)
                    ? 'icon-checkboxchecked text-primary'
                    : 'icon-checkbox text-grey-light',
                ]"
              ></view>
              <text>{{ option.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { usePopupShow } from "@/hooks";

interface OptionItem {
  [key: string]: string;
  id: string;
  name: string;
}

interface Props {
  title?: string;
  options: OptionItem[];
  show: boolean;
  value: string[];
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  options: () => [],
});

// 存储选中的选项 ID
const selectedIds = ref<string[]>(props.value);

// 判断选项是否被选中
const isChecked = (id: string) => {
  return selectedIds.value.includes(id);
};

// 处理复选框的变化
const handleCheckboxChange = (id: string) => {
  if (isChecked(id)) {
    selectedIds.value = selectedIds.value.filter((itemId) => itemId !== id);
  } else {
    selectedIds.value.push(id);
  }
};

const { modal } = usePopupShow(props, () => {});

const emits = defineEmits<{
  /**弹窗 显隐  model 值 */
  (e: "update:show", value: boolean): void;
  /**pick选择 model 值 */
  (e: "update:value", value: string[]): void;
  /**点击提交时传递的参数 */
  (e: "submit", value: string[], items?: OptionItem[]): void;
  /**取消按钮方法 */
  (e: "close"): void;
}>();

const cancel = () => {
  emits("update:show", false);
  emits("close");
};

const submit = () => {
  const selectedItems = props.options.filter((option) =>
    selectedIds.value.includes(option.id)
  );
  emits("update:value", selectedIds.value);
  emits("submit", selectedIds.value, selectedItems);
  emits("update:show", false);
};

// 监听 props.value 的变化，确保选中状态与父组件传来的值同步
watch(
  () => props.value,
  (newValue) => {
    selectedIds.value = [...newValue];
  },
  { immediate: true }
);
watchEffect(() => {
  const selectedItems = props.options.filter((option) =>
    selectedIds.value.includes(option.id)
  );
  emits("submit", selectedIds.value, selectedItems);
  console.log("selectedItemsselectedItems", selectedItems, selectedIds.value);
});
</script>

<style scoped lang="scss">
.popupbox {
  z-index: 288;
  .set-border {
    background-color: rgba(#333, $alpha: 0.7);
  }
  .popup-content {
    height: 610rpx;
    width: 100%;
    border-radius: 16rpx 16rpx 0 0;
    background-color: #fff;
  }
  .popup-header {
    padding: 24rpx;
    display: flex;
    justify-content: space-between;
    border-bottom: 1rpx solid #eee;
    font-size: 30rpx;
    &-left {
      color: #7a7a88;
    }
    &-center {
      color: #333336;
    }
    &-right {
      color: #25ba1b;
    }
  }
  .popup-main {
    height: calc(100% - 90rpx);
  }
  .checkbox-list {
    padding: 20rpx;
  }
  .checkbox-item {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
  }
  .checkbox-item checkbox {
    margin-right: 10rpx;
  }
}
</style>
