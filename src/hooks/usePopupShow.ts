import { watchEffect, inject, ref, provide } from "vue";
export default (props?: { [key: string]: unknown }, cb?: () => void) => {
  const modal = ref();
  const show = ref(false);
  const scrollShow = inject("scrollShow") as (val: boolean) => void;
  watchEffect(() => {
    if (props?.show) {
      console.log(modal.value, 111111111);
      modal.value?.open();
      cb && cb();
      scrollShow && scrollShow(true);
    } else {
      modal.value?.close();
      scrollShow && scrollShow(false);
    }
  });
  const provideFun = () => {
    const scroll = (value: boolean) => {
      show.value = value;
    };
    provide("scrollShow", scroll);
    console.log(111122222);
  };
  return {
    modal,
    show,
    provideFun,
  };
};
