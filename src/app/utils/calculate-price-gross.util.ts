export const calculateGrossFromNet = (priceNet: number, vatRate = 0.23): number => {
  const netInCents = Math.round(priceNet * 100);
  const grossInCents = Math.round(netInCents * (1 + vatRate));

  return grossInCents / 100;
};
