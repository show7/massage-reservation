import { provide, inject } from "vue";
export default function useProvideInject() {
  const provideInit = (key: string, value: any) => {
    provide(key, value);
  };
  const injectInit = (key: string) => {
    const injectData = inject(key);
    return injectData;
  };
  return {
    provideInit,
    injectInit,
  };
}
