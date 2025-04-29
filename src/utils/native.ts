import { tabbarPathArray } from "@/config/tabbar.config";
const WX_MINI_APP_CONFIG = {};
//跳转类型 jumpmini:跳小程序,jumpweb:跳web,jumppath:跳小程序内页,jumpapp:跳app,disable:不跳转
enum JUMP_TYPE {
  MINI = "jumpmini",
  WEB = "jumpweb",
  SELF = "jumppath",
  APP = "jumpapp",
  DISABLE = "disable",
  ANCHOR = "homeAnchorPoint",
  PLATFROM_NAVIGATETO = "platfrom_navigateto", // 会员H5 使用微信SDK 直接跳转宿主小程序页面，本身
  JUMPEMBEDDEDMINI = "jumpEmbeddedMini",
}

interface JumpMiniParams {
  appId: string;
  url: string;
  extraData?: object;
  envVersion?: "release" | "develop" | "trial";
  success?: () => void;
  fail?: () => void;
  complete?: () => void;
  [prop: string]: any;
}
interface JumpWebParams {
  url: string;
  animationType?:
    | "auto"
    | "none"
    | "slide-in-right"
    | "slide-in-left"
    | "slide-in-top"
    | "slide-in-bottom"
    | "fade-in"
    | "zoom-out"
    | "zoom-fade-out"
    | "pop-in";
  animationDuration?: number;
  events?: object;
  success?: () => void;
  fail?: () => void;
  complete?: () => void;
  [prop: string]: any;
}
type JumpSelfParams = JumpWebParams;
interface JumpAnchorParams {
  nodeId: string;
  rootNode?: any;
}
interface JumpEmbeddedMiniParams {
  appId: string;
  url: string;
  extraData?: object;
  envVersion?: "develop" | "trial" | "release";
  shortLink?: string;
  success: () => void;
  fail: () => void;
  complete: () => void;
}
class Native {
  static push(
    type: JUMP_TYPE,
    params: JumpMiniParams | JumpWebParams | JumpAnchorParams
  ) {
    Native.methods(type, params);
  }
  static methods(
    type: JUMP_TYPE,
    params: JumpMiniParams | JumpWebParams | JumpAnchorParams
  ) {
    const actionMap = {
      [JUMP_TYPE.MINI]: {
        // 跳转到其他小程序
        handler({ url, ...arg }: JumpMiniParams) {
          // #ifdef MP-WEIXIN
          uni.navigateToMiniProgram({
            ...arg,
            path: url,
          });
          // #endif

          // #ifdef H5
          if (arg.appId in WX_MINI_APP_CONFIG) {
            // 在乐活H5中跳转乐活小程序 通过wxsdk直接填转
            //判断是否是tabBar页面
            const { tabBarPages = [] } =
              WX_MINI_APP_CONFIG[arg.appId as keyof typeof WX_MINI_APP_CONFIG];
            const path = url.startsWith("/") ? url : `/${url}`;
            const isTabBarURL = tabbarPathArray.includes(path);
            if (isTabBarURL) {
              //跳转tabbar
              WX.miniProgram.switchTab({
                url: path,
                ...arg,
              });
              return;
            }
            //跳转普通路径
            WX.miniProgram.navigateTo({
              url: path,
              ...arg,
            });
            return;
          }
          //跳转公共页
          WX.miniProgram.navigateTo({
            url: `/pages/jump/index?params=${encodeURIComponent(
              JSON.stringify({ url, ...arg })
            )}`,
          });
          // #endif
        },
      },
      [JUMP_TYPE.WEB]: {
        //跳转webview
        handler({ url, ...arg }: JumpWebParams) {
          // #ifdef MP-WEIXIN
          uni.navigateTo({
            url: `/pages/webview/index?url=${url}`,
            ...arg,
          });
          // #endif
          // #ifdef H5
          WX.miniProgram.navigateTo({
            url: `/pages/h5/index?url=${url}`,
            ...arg,
          });
          // #endif
        },
      },
      [JUMP_TYPE.SELF]: {
        // 跳转小程序内页
        handler({ url, ...arg }: JumpSelfParams) {
          if (tabbarPathArray.includes(url)) {
            //跳转tabbar页面
            uni.switchTab({
              url,
              ...arg,
            });
            return;
          }
          uni.navigateTo({
            url,
            ...arg,
          });
        },
      },
      [JUMP_TYPE.DISABLE]: {
        handler() {
          return false;
        },
      },
      [JUMP_TYPE.ANCHOR]: {
        handler({ nodeId = "", rootNode = "" }: JumpAnchorParams) {
          uni.pageScrollTo({
            scrollTop: 0,
            duration: 0,
          });
          setTimeout(() => {
            if (!nodeId) return;
            const query = rootNode
              ? uni.createSelectorQuery().in(rootNode)
              : uni.createSelectorQuery();
            query
              .select(`#${nodeId}`)
              .boundingClientRect((data: any) => {
                uni.pageScrollTo({
                  scrollTop: data.top,
                  duration: 300,
                });
              })
              .exec();
          }, 0);
        },
      },
      /**
       * @description: 平台跳转（小程序内部navigateTo，H5中走wx.miniProgram.navigateTo)
       * @return {*}
       */
      [JUMP_TYPE.PLATFROM_NAVIGATETO]: {
        handler({ url, ...arg }: JumpSelfParams) {
          // #ifdef MP-WEIXIN
          uni.navigateTo({
            url,
            ...arg,
          });
          // #endif
          // #ifdef H5
          WX.miniProgram.navigateTo({
            url,
            ...arg,
          });
          // #endif
        },
      },
      [JUMP_TYPE.JUMPEMBEDDEDMINI]: {
        handler({ url, ...arg }: JumpEmbeddedMiniParams) {
          // #ifdef MP-WEIXIN
          uni.openEmbeddedMiniProgram({
            path: url,
            ...arg,
          });
          // #endif

          // #ifdef H5
          if (arg.appId in WX_MINI_APP_CONFIG) {
            // 在乐活H5中跳转乐活小程序 通过wxsdk直接填转
            //判断是否是tabBar页面
            const { tabBarPages = [] } =
              WX_MINI_APP_CONFIG[arg.appId as keyof typeof WX_MINI_APP_CONFIG];
            const path = url.startsWith("/") ? url : `/${url}`;
            const isTabBarURL = tabBarPages.includes(path);
            if (isTabBarURL) {
              WX.miniProgram.switchTab({
                url: path,
                ...arg,
              });
              return;
            }
            WX.miniProgram.navigateTo({
              url: path,
              ...arg,
            });
            return;
          }
          WX.miniProgram.navigateTo({
            url: `/pages/jump/index?params=${encodeURIComponent(
              JSON.stringify({ url, ...arg })
            )}`,
          });
          // #endif
        },
      },
    };
    actionMap[type as keyof typeof actionMap] &&
      actionMap[type as keyof typeof actionMap].handler(params as any);
  }
}

export { Native, JUMP_TYPE };
