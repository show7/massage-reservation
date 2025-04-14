import { dayjs } from "@/plugins";
import { BASE_URL } from "@/api/config/BASE_URL";
export type UpdateCheckResult = {
  hasUpdate: boolean;
  updateManager: UniApp.UpdateManager;
};

// 封装检查更新的函数，返回一个 Promise
export function checkForUpdate(): Promise<UpdateCheckResult> {
  return new Promise((resolve) => {
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      resolve({ hasUpdate: res.hasUpdate, updateManager });
    });
  });
}

// 封装提示用户更新的函数，返回一个 Promise
export function promptForUpdate(
  updateManager: UniApp.UpdateManager
): Promise<boolean> {
  return new Promise((resolve) => {
    uni.showModal({
      title: "更新提示",
      content: "新版本已经准备好，是否重启应用？",
      success: (res) => {
        if (res.confirm) {
          // 用户点击确认，应用更新
          updateManager.applyUpdate();
        }
        resolve(res.confirm);
      },
    });
  });
}

// 定义 countdown 函数，接收一个表示目标时间的字符串作为参数
export class CountdownManager {
  private targetTime: dayjs.Dayjs;
  private timerId: NodeJS.Timer | null = null;

  constructor(targetTimeStr: string) {
    this.targetTime = dayjs(targetTimeStr);
    if (!this.targetTime.isValid()) {
      console.error("传入的时间格式无效");
    }
  }

  private updateCountdown(): string | false {
    const now = dayjs();
    const diff = this.targetTime.diff(now);

    if (diff <= 0) {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      return false;
    }

    const seconds = Math.floor(diff / 1000);

    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      return `${hours}小时`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}分钟`;
    } else {
      return `${seconds}秒`;
    }
  }

  start(callback: (result: { status: boolean; text: string }) => void): void {
    if (this.timerId) {
      console.log("倒计时已经在运行中，无需重复启动。");
      return;
    }
    const initialResult = this.updateCountdown();
    if (initialResult === false) {
      console.log("倒计时已经结束，无法启动。");
      callback({ status: false, text: "" });
      return;
    }
    callback({ status: true, text: initialResult });
    this.timerId = setInterval(() => {
      const result = this.updateCountdown();
      if (result === false) {
        if (this.timerId) {
          clearInterval(this.timerId);
          this.timerId = null;
        }
        callback({ status: false, text: "" });
        console.log("倒计时结束");
      } else {
        callback({ status: true, text: result });
      }
    }, 1000);
  }

  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      console.log("倒计时已停止。");
    } else {
      console.log("倒计时未在运行，无需停止。");
    }
  }
}

/**
 * 获取当前周的每一天的日期，星期一作为一周的开始，星期日作为一周的最后一天
 * @returns {string[]} 包含星期一到星期日的日期字符串数组
 */
export function getCurrentWeekDays(date: Date): string[] {
  const today = date ? new Date(date) : new Date();
  const dayOfWeek = today.getDay(); // 获取今天是星期几（0 是星期日，1 是星期一，...，6 是星期六）
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // 计算与本周星期一的日期差
  const monday = new Date(today.setDate(diff)); // 设置日期为本周星期一

  // 格式化日期为 YYYY-MM-DD
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const day = String(monday.getDate()).padStart(2, "0");
  console.log(`${year}-${month}-${day}`, date);
  const weekDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(
      dayjs(`${year}-${month}-${day}`).add(i, "day").format("YYYY-MM-DD")
    );
  }

  return weekDays;
}

// 导出一个函数，用于下载文件流
// 定义 uni.request 的响应类型
interface UniRequestResponse {
  statusCode: number;
  data: ArrayBuffer;
}

// 定义 uni.getFileSystemManager().saveFile 的响应类型
interface UniSaveFileResponse {
  savedFilePath: string;
}

// 下载文件流函数
export function downloadFileStream(
  url: string,
  data: object
): Promise<{ file: ArrayBuffer; filename: string }> {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      data,
      method: "GET",
      responseType: "arraybuffer",
      success: (res: UniRequestResponse) => {
        console.log("下载文件流成功");
        if (res.statusCode === 200) {
          resolve({
            file: res.data,
            filename: res?.header["Content-Disposition"]
              .split("filename=")[1]
              .replaceAll('"', ""),
          });
        } else {
          reject(new Error(`请求失败，状态码：${res.statusCode}`));
        }
      },
      fail: (err: any) => {
        reject(err);
      },
    });
  });
}

// 保存文件函数
export function saveFile(fileData: ArrayBuffer, name: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fs = uni.getFileSystemManager();
    const fileNmae = name;
    const tempFilePath = `${uni.env.USER_DATA_PATH}/${fileNmae}`;
    console.log("下载文件------getFileSystemManager", tempFilePath, fileNmae);
    fs.writeFile({
      filePath: tempFilePath,
      data: fileData,
      encoding: "binary", // 使用二进制编码
      success() {
        fs.saveFile({
          tempFilePath,
          success: (saveRes) => {
            const savedFilePath = saveRes.savedFilePath;
            // 打开文件
            resolve(savedFilePath);
          },
          fail: (saveErr) => {
            reject();
            console.error("文件保存失败", saveErr);
          },
        });
        console.log("下载文件------writeFile");
      },
      fail: (err: any) => {
        reject(err);
      },
    });
  });
}

// 打开文件函数
export function openDocument(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.openDocument({
      filePath,
      fileType: "xlsx",
      showMenu: true,
      success: () => {
        resolve();
      },
      fail: (err: any) => {
        reject(err);
      },
    });
  });
}

export enum TIME_TYPE {
  DAY = "D",
  HOUER = "H",
  MINUTE = "M",
  SECOND = "S",
}

enum TIME_TRANSFORM_SECOND {
  D = 60 * 60 * 24,
  H = 60 * 60,
  M = 60,
  S = 1,
}
export class Storage {
  /**
   * @param {缓存key} storagekey
   * @param {需要存储的缓存值} value
   * @param {过期时间,默认0表示永久有效(单位：秒)} expire
   * @param {过期时间单位{H,M,S},默认S} expireUnit
   */
  static set(
    key: string,
    value: any,
    expire = 0,
    expireUnit: TIME_TYPE = TIME_TYPE.SECOND
  ) {
    const obj = {
      data: value, //存储的数据
      time: Date.now() / 1000, //记录存储的时间戳
      expire: expire * TIME_TRANSFORM_SECOND[expireUnit], //记录过期时间，单位秒
      expireUnit,
    };
    console.log(obj.expire, "expireexpireexpireexpire");
    uni.setStorageSync(key, JSON.stringify(obj));
  }
  static get(key: string, childKey?: string) {
    let val = uni.getStorageSync(key);
    if (!val) {
      return null;
    }
    val = JSON.parse(val);
    if (val.expire && Date.now() / 1000 - val.time > val.expire) {
      uni.removeStorageSync(key);
      return null;
    }
    return childKey ? val.data[childKey] : val.data;
  }
  /**
   * @description: 是否存在缓存中
   * @param {*} key
   * @return {*}
   */
  static has(key: string) {
    let value;
    try {
      const res = uni.getStorageInfoSync();
      value = res.keys.includes(key);
    } catch (e) {
      console.log(e);
    }
    return value;
  }
  /**
   * @description: 移除某一项缓存
   * @param {string} key
   * @return {*}
   */
  static remove(key: string) {
    try {
      uni.removeStorageSync(key);
    } catch (e) {
      //TODO handle the exception
      console.log(e);
    }
  }
  /**
   * @description: 清楚所有缓存
   * @return {*}
   */
  static clear() {
    try {
      uni.clearStorageSync();
    } catch (e) {
      console.log(e);
    }
  }
}

// 选择图片通用方法
export const chooseImage = (sourceType?: string[]) => {
  return new Promise((resolve, reject) => {
    uni.chooseMedia({
      count: 1,
      mediaType: ["image"],
      success: (res) => {
        console.log("选择图片成功", res);
        resolve(res.tempFiles);
      },
      fail: (err) => {
        console.error("选择图片失败", err);
        reject(err);
      },
    });
  });
};

// 导出一个名为uploadFile的函数，用于上传文件
export const uploadFile = (filePath: string, formData?: any) => {
  // 返回一个Promise对象
  return new Promise((resolve, reject) => {
    // 调用uni.uploadFile方法上传文件
    uni.uploadFile({
      // 上传文件的URL
      url: `${BASE_URL}/common/upload`,
      filePath: filePath,
      name: "file",

      formData,
      async success({ data }) {
        const fileData = JSON.parse(data || "{}");
        console.log("upload_pictures_res", fileData);
        resolve(fileData);
      },
      fail(res) {
        reject(res);
        console.log("upload失败", res);
      },
    });
  });
};

type Fn = (...params: any[]) => void;
export const promisiy = (api: Fn) => {
  // 第1层接收需要转换格式的方法
  return (options: object, ...params: any[]) => {
    //第2层接收该方法参数 options 是api的参数 ； params是自定义的其他参数
    return new Promise((resolve, reject) => {
      //第3层返回Promise对象
      const extras = {
        success: resolve,
        fail: reject,
      };
      api({ ...options, ...extras }, ...params);
    });
  };
};
