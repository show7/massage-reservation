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
            <view class="p-24">
              <uni-easyinput
                :styles="{
                  color: '#333336',
                  backgroundColor: 'rgba(242, 242, 242, 0.5)',
                  borderColor: '#cccccc',
                  borderRadius: '20rpx',
                }"
                v-if="showSearch"
                prefixIcon="search"
                v-model="state.searchValue"
                placeholder="请输入名称进行模糊查询"
                @blur="search"
                @clear="search"
                @confirm="search"
              />

              <view class="p-20">
                <scroll-view
                  class="scroll-container"
                  scroll-y
                  @scrolltolower="loadMore"
                  :lower-threshold="50"
                >
                  <view
                    class="item flex justify-between items-center py-10"
                    v-for="(item, index) in state.options"
                    :key="index"
                    @click="change(item)"
                  >
                    <view
                      :class="[
                        'text-30',
                        state.value === item[valueKey]
                          ? 'text-primary'
                          : 'text-info',
                      ]"
                      >{{ item[labelKey] }}</view
                    >
                    <text
                      :class="[
                        'iconfont text-40 ',
                        state.value === item[valueKey]
                          ? 'icon-checkbox-checked text-primary'
                          : 'icon-checkbox-weixuan text-info',
                      ]"
                    ></text>
                  </view>
                  <LoadMore :status="status" />
                </scroll-view>
              </view>
            </view>
          </slot>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";

import type { ChangeRadioType } from "@/types";
import { useLoadMore, usePopupShow, usePagination } from "@/hooks";

const { status, setLoadMoreStatus } = useLoadMore();
const pagination = usePagination();

interface OptionItem {
  [key: string]: string;
  id: string;
  name: string;
}
interface Props {
  title?: string;
  show: boolean;
  value: string | number;
  showSearch?: boolean;
  labelKey?: string;
  valueKey?: string;
  fetchOptions: Promise<OptionItem[]>;
}
const props = withDefaults(defineProps<Props>(), {
  title: "",
  labelKey: "label",
  valueKey: "value",
  showSearch: true,
});

const state = reactive({
  searchValue: "",
  options: [],
  value: "" as string | any[],
  selectItem: {} as OptionItem,
});

// pick-view  默认值
const pickValue = ref<number[]>([]);
// 防止 options 中没有 props.value 值
const valueDefault = () => {
  if (props.value) {
    const findObjIndex = state.options.findIndex((v) => props.value === v.id);
    if (findObjIndex > -1) {
      pickValue.value = [findObjIndex];
    } else {
      nextTick(() => {
        emits("update:value", state.options[0].id);
      });
      state.value = state.options[0].id;
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
  (e: "search", value: string, item?: OptionItem): void;
  /**取消按钮方法 */
  (e: "close"): void;
}>();
const search = (e: string) => {
  state.searchValue = e?.detail?.value || "";
  pagination.init();
  state.options = [];
  getOptions();
};
const loadMore = () => {
  console.log("loadMore");
  if (status.value !== "more") return;
  pagination.state.pageNum++;
  getOptions();
};
const cancel = () => {
  emits("update:show", false);
  emits("close");
  pickValue.value = [];
};
const submit = () => {
  emits("update:show", false);
  emits("update:value", state.value);
  emits("change", state.value, state.selectItem);
};
const change = (item: ChangeRadioType) => {
  const value = item?.value as string;
  state.value = value;
  state.selectItem = item;
  // emits("update:value", value);
  emits("change", value, item);
};

const getOptions = async () => {
  setLoadMoreStatus("loading");
  const { pageNum, pageSize } = pagination.state;
  const params = {
    value: state.searchValue,
    pageNum,
    pageSize,
  };
  const { rows = [], ...arg }: any = await props.fetchOptions(params);

  state.options.push(...rows);
  setLoadMoreStatus(state.options.length >= arg.total ? "noMore" : "more");
  pagination.create(arg);
};
onMounted(() => {
  search();
});
</script>

<style scoped lang="scss">
.popupbox {
  z-index: 288;
  .set-border {
    background-color: rgba(#333, $alpha: 0.7);
  }
  .scroll-container {
    height: 550rpx;
  }
  .popup-content {
    height: 800rpx;
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
