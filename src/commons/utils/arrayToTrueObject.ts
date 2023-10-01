export const arrayToTrueObject = (array: string[]) => {
  return array.reduce((acc, cur) => {
    acc[cur] = true;
    return acc;
  }, {});
};
