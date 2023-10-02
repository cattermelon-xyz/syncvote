export const checkShouldCache = ({
  cacheOption,
  lastFetch,
}: {
  cacheOption: boolean;
  lastFetch: any;
}) => {
  const now = new Date().getTime();
  if (
    cacheOption &&
    lastFetch !== -1 &&
    now - lastFetch <= Number(import.meta.env.VITE_CACHED_TIME!)
  ) {
    return true;
  }
  return false;
};
