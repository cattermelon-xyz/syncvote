export const subtractArray = ({
  minuend,
  subtrahend,
}: {
  minuend: number[];
  subtrahend: number[];
}) => {
  var set2 = new Set(subtrahend);
  var difference = minuend.filter((x) => !set2.has(x));
  return difference;
};
