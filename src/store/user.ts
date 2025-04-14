import { defineStore } from "pinia";
import request from "@/api";

// 定义 User 类型
type User = {
  avatar: string | null;
  cardno: string | null;
  centeenIds: string | null;
  code: string | null;
  createBy: string | null;
  createTime: string | null;
  id: string | null;
  mobile: string | null;
  name: string | null;
  nickname: string | null;
  oldtype: string | null;
  openid: string | null;
  remark: string | null;
  roleId: string | null;
  sex: string | null;
  supplierIds: string | null;
  type: string | null;
  updateBy: string | null;
  updateTime: string | null;
};

// 定义 UserInfo 类型
type UserInfo = {
  canteens: any[]; // 这里可以根据实际情况修改 any 为具体类型
  suppliers: any[];
  userStatus: string | null;
  roles: {};
  rolesGroup: string[]; // 这里可以根据实际情况修改 any 为具体类型
  user: User;
};

const useUserStore = defineStore(
  "userStore",
  () => {
    // 初始化用户基础信息
    const userBaseInfo = reactive<User>({
      avatar: null,
      cardno: null,
      centeenIds: null,
      code: null,
      createBy: null,
      createTime: null,
      id: null,
      mobile: null,
      name: null,
      nickname: null,
      oldtype: null,
      openid: null,
      remark: null,
      roleId: null,
      sex: null,
      supplierIds: null,
      type: null,
      updateBy: null,
      updateTime: null,
    });

    // 初始化用户信息，使用 ref 创建响应式对象
    const userInfo = reactive<UserInfo>({
      canteens: [],
      suppliers: [],
      rolesGroup: [],
      roles: {},
      userStatus: "",
      user: {
        avatar: null,
        cardno: null,
        centeenIds: null,
        code: null,
        createBy: null,
        createTime: null,
        id: null,
        mobile: null,
        name: null,
        nickname: null,
        oldtype: null,
        openid: null,
        remark: null,
        roleId: null,
        sex: null,
        supplierIds: null,
        type: null,
        updateBy: null,
        updateTime: null,
      },
    });

    // 更新用户基础信息的方法
    const updateUserBaseInfo = (user: User) => {
      Object.assign(userBaseInfo, user);
    };

    // 清空用户基础信息的方法
    const clearUserBaseInfo = () => {
      return new Promise((resolve, reject) => {
        Object.keys(userBaseInfo).forEach((key) => {
          (userBaseInfo as any)[key] = null;
        });
        resolve(true);
      });
    };

    // 更新用户信息的方法
    const updateUserInfo = (user: Partial<UserInfo>) => {
      Object.assign(userInfo, user);
    };

    // 清空用户信息的方法
    const clearUserInfo = () => {
      return new Promise((resolve, reject) => {
        Object.assign(userInfo, {
          canteens: [],
          suppliers: [],
          rolesGroup: [],
          roles: {},
          user: {
            ...userBaseInfo,
          },
        });
        resolve(true);
      });
    };
    const clear = async () => {
      await clearUserBaseInfo();
      await clearUserInfo();
      return Promise.resolve(true);
    };
    // 获取用户信息的异步方法
    const getUserInfo = async () => {
      try {
        console.log("userBaseInfo", userBaseInfo);
        const { data } = await request.sendRequestByKey("GET_USER_INFO", {
          openid: userBaseInfo.openid,
        });
        const rolesGroup = ["base"];
        if (data.canteens.length) {
          rolesGroup.push("canteen");
        }
        if (data.suppliers.length) {
          rolesGroup.push("supplier");
        }
        await checkUserPermissions(rolesGroup);
        await updateUserInfo({ ...data, rolesGroup });
        return Promise.resolve(data);
      } catch (err) {
        console.error("请求失败：", err);
        return Promise.reject(err);
      }
    };
    const checkUserPermissions = async (rolesGroup: UserInfo["rolesGroup"]) => {
      const preUserRolesGroup = [...userInfo.rolesGroup];
      const curUserRolesGroup = rolesGroup;
      console.log(
        "checkUserPermissions",
        preUserRolesGroup,
        "-----------",
        curUserRolesGroup
      );
      if (!preUserRolesGroup.length) {
        if (curUserRolesGroup.length === 1) {
          uni.switchTab({ url: "/pages/orderFood/index" });
        }
        if (curUserRolesGroup.length > 1) {
          uni.redirectTo({ url: "/pages/systemSelection/index" });
        }
      }
      //小程序只有一个权限角色（默认点餐）
      if (curUserRolesGroup.length === 1) {
        //首次进入 或者 清空缓存进入 时
        if (!preUserRolesGroup.length) {
          console.log("首次进入 或者 清空缓存进入 时");
          uni.switchTab({ url: "/pages/orderFood/index" });
          return Promise.resolve();
        }
        // 权限降级为单一普通角色
        if (preUserRolesGroup.length > 1) {
          console.log("权限降级为单一普通角色");
          await uni.showModal({
            title: "温馨提示",
            content: "检测到您的系统权限发生变化，即将重新进入业务系统",
            showCancel: false,
          });
          uni.switchTab({ url: "/pages/orderFood/index" });
          return Promise.resolve();
        }
        return Promise.resolve();
      }
      //多个角色时
      if (curUserRolesGroup.length > 1) {
        //首次进入 或者 清空缓存进入 时 （必须）需要重新选择系统
        if (!preUserRolesGroup.length) {
          console.log("首次进入 或者 清空缓存进入 时 （必须）需要重新选择系统");
          uni.redirectTo({ url: "/pages/systemSelection/index" });
          return Promise.resolve();
        }
        // 权限增加了 可以重新选择系统（用户决定）
        if (preUserRolesGroup.length === 1) {
          try {
            await uni.showModal({
              title: "温馨提示",
              content: "检测到您的系统权限发生变化，是否需要新选择业务系统？",
              showCancel: true,
            });
            uni.redirectTo({ url: "/pages/systemSelection/index" });
            return Promise.resolve();
          } catch (e) {
            return Promise.resolve();
          }
        }
        // 用户角色组 长度都都>1 并且长度一样，但是权限不一样时，需要重新选择系统
        if (
          preUserRolesGroup.length === curUserRolesGroup.length &&
          preUserRolesGroup.join(",").trim() !==
            curUserRolesGroup.join(",").trim()
        ) {
          console.log(
            "用户角色组 长度都都>1 并且长度一样，但是权限不一样时，需要重新选择系统"
          );
          await uni.showModal({
            title: "温馨提示",
            content: "检测到您的系统权限发生变化，请重新选择业务系统",
            showCancel: false,
          });
          uni.redirectTo({ url: "/pages/systemSelection/index" });
          return Promise.resolve();
        }
        // 权限增加了，需要重新选择系统（用户决定）
        if (curUserRolesGroup.length > preUserRolesGroup.length) {
          try {
            await uni.showModal({
              title: "温馨提示",
              content: "检测到您的系统权限发生变化，是否需要新选择业务系统？",
              showCancel: true,
            });
            uni.redirectTo({ url: "/pages/systemSelection/index" });
            return Promise.resolve();
          } catch (e) {
            return Promise.resolve();
          }
        }
        //权限减少了，必须重新选择系统
        if (curUserRolesGroup.length < preUserRolesGroup.length) {
          console.log("权限减少了，必须重新选择系统");
          await uni.showModal({
            title: "温馨提示",
            content: "检测到您的系统权限发生变化，请重新选择业务系统",
            showCancel: false,
          });
          uni.redirectTo({ url: "/pages/systemSelection/index" });
          return Promise.resolve();
        }
      }
    };

    return {
      userBaseInfo,
      userInfo,
      updateUserBaseInfo,
      clearUserBaseInfo,
      updateUserInfo,
      clearUserInfo,
      getUserInfo,
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

export default useUserStore;
