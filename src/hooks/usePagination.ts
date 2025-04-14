import { reactive } from "vue";

const usePagination = (config?: any) => {
  // 用 reactive 来创建响应式的状态对象
  const state = reactive({
    pageNum: 1,
    pageSize: config?.pageSize || 10,
    totalNum: 0,
  });

  // 初始化函数
  const init = ({ pageSize = 10 } = { pageSize: 10 }) => {
    state.pageNum = 1; // 重置页码
    state.totalNum = 0; // 重置总数
    state.pageSize = pageSize; // 设置每页数量
    return state;
  };

  // 创建函数，用于合并新的分页数据
  const create = (res: any) => {
    Object.assign(state, res);
    return state;
  };

  // 返回 state 和操作函数
  return {
    state,
    init,
    create,
  };
};
export default usePagination;
