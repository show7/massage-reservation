// #ifdef MP-WEIXIN
const statusBarHeight = uni.getWindowInfo().statusBarHeight + "px";
// #endif
// #ifndef MP-WEIXIN
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight + "px";
// #endif

export { statusBarHeight };
