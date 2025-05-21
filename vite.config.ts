import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import viteImagemin from "vite-plugin-imagemin";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // 需要放在 uni() 之前
    Components({
      // 自动加载组件的目录配置,默认的为 'src/components'
      dirs: ["src/components/**"],
      extensions: ["vue"], // 组件的有效文件扩展名
      // 自定义组件的解析器
      // 生成`components.d.ts`文件，全局组件的ts的全局声明,
      // 也接受自定义文件名的路径
      // 如果安装了typescript包default: true
      dts: "components.d.ts",
    }),
    uni(),
    AutoImport({
      dts: "auto-imports.d.ts",
      include: [
        /\.[tj]sx?$/, // ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: ["vue", "pinia"], // 自动导入vue、vue-router、pinia 内的部分api
    }),
  ],
  server: {
    watch: {
      usePolling: true, // 使用轮询，兼容性更好
    },
    proxy: {
      // 配置代理规则
      "/api/": {
        // 目标服务器地址，需替换为实际的后端接口地址
        target: "https://ktapp.kangtetuina.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
