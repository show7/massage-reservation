const useTabBarStore = defineStore(
  "tabBarStore",
  () => {
    const currentTabInfo = reactive({
      type: "",
      iconPath: "",
      selectedIconPath: "",
      path: "",
    });
    const setTabBar = (value: any) => {
      Object.assign(currentTabInfo, value);
    };
    const clear = async () => {
      return Promise.resolve(true);
    };
    return {
      currentTabInfo,
      setTabBar,
      clear,
    };
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key);
        },
        setItem(key, value) {
          return uni.setStorageSync(key, value);
        },
      },
    },
  }
);

export default useTabBarStore;
