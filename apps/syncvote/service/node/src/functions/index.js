function isArraySubset(subset, superset) {
  return subset.some((item) => superset.includes(item));
}

module.exports = {
  isArraySubset,
};
