const useQuerySelect = async ({ instance, className }) => {
  const getelectorInfo = () => {
    return new Promise((resolve) => {
      const queryThis = uni.createSelectorQuery().in(instance);
      queryThis
        .select(className)
        .boundingClientRect((data: any) => {
          resolve(data);
          console.log(className, data);
        })
        .exec();
    });
  };
  const data = await getelectorInfo();
  return {
    ...data,
  };
};
export default useQuerySelect;
