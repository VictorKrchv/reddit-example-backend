export const generateRandomNumber = (count = 6) => {
  return Number(
    Array.from({ length: count })
      .map(() => Math.floor(Math.random() * 11))
      .join(''),
  );
};
