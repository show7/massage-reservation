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
          <slot>
            <view class="popup-header">
              <text class="popup-header-left" @click="cancel">取消</text>
              <text class="popup-header-center">{{ title }}</text>
              <text class="popup-header-right" @click="submit">确认</text>
            </view>

            <picker-view
              class="picker-view"
              :value="pickValue"
              @change="change"
              immediate-change
              v-if="options.length"
            >
              <picker-view-column>
                <view class="item" v-for="v in options" :key="v.id">{{
                  v.name
                }}</view>
              </picker-view-column>
            </picker-view>
            <view
              class="h-full w-full bg-white rounded-10 px-26 py-20 text-24 flex items-center justify-center flex-col gap-20 mt-40"
              v-else
            >
              <view class="iconfont icon-kongshuju text-80 text-info"> </view>
              <view class="text-info mt-10">暂无数据</view>
            </view>
          </slot>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { usePopupShow } from "@/hooks";
import type { ChangeRadioType } from "@/types";

interface OptionItem {
  [key: string]: string;
  id: string;
  name: string;
}
interface Props {
  title?: string;
  options: OptionItem[];
  show: boolean;
  value: string | number;
}
const props = withDefaults(defineProps<Props>(), {
  title: "",
  options: () => [],
});

// pick-view  默认值
const pickValue = ref<number[]>([]);
// 防止 options 中没有 props.value 值
const valueDefault = () => {
  if (props.value) {
    const findObjIndex = props.options.findIndex((v) => props.value === v.id);
    if (findObjIndex > -1) {
      pickValue.value = [findObjIndex];
    } else {
      nextTick(() => {
        emits("update:value", props.options[0].id);
      });
    }
  }
};
const { modal } = usePopupShow(props, valueDefault);
const emits = defineEmits<{
  /**弹窗 显隐  model 值 */
  (e: "update:show", value: boolean): void;
  /**pick选择 model 值 */
  (e: "update:value", value: string | number): void;
  /**点击提交时传递的参数 */
  (e: "submit", value: string, item?: OptionItem): void;
  /**取消按钮方法 */
  (e: "close"): void;
}>();
const cancel = () => {
  emits("update:show", false);
  emits("close");
  pickValue.value = [];
};
const submit = () => {
  nextTick(() => {
    if (props.value) {
      const findObj = props.options.find(
        (v: OptionItem) => v.id === props.value
      );
      emits("submit", props.value, findObj);
    } else {
      emits("update:value", props.options[0].id);
      emits("submit", props.options[0].id, props.options[0]);
    }
    cancel();
  });
};
const change = (item: ChangeRadioType) => {
  const value = item.detail.value as number[];
  console.log(value);
  emits("update:value", props.options[value[0]].id);
};
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
  .picker-view {
    height: 100%;
    .item {
      text-align: center;
      line-height: 80rpx;
    }
  }
}
</style>
