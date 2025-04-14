<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(async () => {
  // try {
  //   // 检查是否有更新
  //   const { hasUpdate, updateManager }: UpdateCheckResult =
  //     await checkForUpdate();
  //   if (hasUpdate) {
  //     // 监听新版本下载成功事件
  //     updateManager.onUpdateReady(async () => {
  //       const isConfirmed: boolean = await promptForUpdate(updateManager);
  //       if (isConfirmed) {
  //         console.log("用户确认更新并重启应用");
  //       } else {
  //         console.log("用户取消更新");
  //       }
  //     });
  //     // 监听新版本下载失败事件
  //     updateManager.onUpdateFailed(() => {
  //       uni.showModal({
  //         title: "更新提示",
  //         content: "新版本下载失败，请检查网络后重试。",
  //         showCancel: false,
  //       });
  //     });
  //   }
  // } catch (error) {
  //   console.error("更新检查出错:", error);
  // }
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@forward "@/style/index.scss";
@import "@/static/iconfont/iconfont.css";
</style>
