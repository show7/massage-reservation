<template>
  <uni-popup ref="popupRef" v-bind="$attrs" @change="change">
    <slot />
    <view class="flex justify-center items-center mt-40">
      <text
        class="iconfont icon-shanchu text-grey-light-2 text-80 text-center"
        @click="close"
      ></text>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
interface Props {
  visible?: boolean;
  type?:
    | "top"
    | "center"
    | "bottom"
    | "left"
    | "right"
    | "message"
    | "dialog"
    | "share";
}
const props = withDefaults(defineProps<Props>(), {
  type: "center",
});
const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "change", value: boolean): void;
}>();
const close = () => {
  popupRef.value?.close();
};
const change = ({ show }: { show: boolean }) => {
  emits("change", show);
};
const show = (type: string) => {
  popupRef.value?.open(props.type || type);
};
const hide = () => {
  popupRef.value?.close();
};
defineExpose({
  show,
  hide,
});
const popupRef = ref();
watch(
  () => props.visible,
  async (val) => {
    await nextTick();
    val ? popupRef.value?.open(props.type) : close();
    console.log("333333", popupRef.value);
  }
);
</script>

<style lang="scss"></style>
