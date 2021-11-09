const wrapAsync = async (fn, params) => {
  try {
    const result = await fn(params);
    return result;
  } catch (_) { return null; }
};

export default wrapAsync;
