const allTabBarData = [
  {
    text: "首页",
    iconPath: `/static/images/home-icon.png`,
    selectedIconPath: `/static/images/home-selected-icon.png`,
    path: "/pages/index/index",
  },
  {
    text: "预约",
    type: "constom",
    iconPath: `/static/images/home-icon.png`,
    selectedIconPath: `/static/images/home-selected-icon.png`,
    path: "/pages/reserve/index",
  },
  {
    text: "我的",
    iconPath: `/static/images/my-icon.png`,
    selectedIconPath: `/static/images/my-selected-icon.png`,
    path: "/pages/user/index",
  },
];
const tabbarPathArray = allTabBarData.map((item) => {
  return item.path;
});
export { allTabBarData, tabbarPathArray };
