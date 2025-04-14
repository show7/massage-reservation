import { reactive } from "vue";

type STATUS = "more" | "loading" | "noMore";
type STATE = {
  status: STATUS;
};
const useLoadMore = () => {
  // 用 reactive 来创建响应式的状态对象
  const state = reactive<STATE>({
    status: "loading",
  });
  /**
   * @description:
   *  @param {STATUS} status  // more 上拉加载更多  loading 加载中  noMore 没有更多了
   */
  const setLoadMoreStatus = (status: STATUS) => {
    state.status = status;
    return state;
  };

  // 返回 state 和操作函数
  return {
    ...toRefs(state),
    setLoadMoreStatus,
  };
};
export default useLoadMore;
