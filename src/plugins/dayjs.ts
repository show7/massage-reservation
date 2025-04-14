import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

// 使用插件
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(updateLocale);

// 设置本地化为中文，并将一周的起始日设置为星期一
dayjs.updateLocale("zh-cn", {
  weekStart: 1, // 1 表示星期一
  firstDayOfWeek: 1, // 确保一周的第一天是星期一
});
export default dayjs;
