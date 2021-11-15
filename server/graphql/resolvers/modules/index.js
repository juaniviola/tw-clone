export default async function wrapAsync(fn, params) {
  try {
    const result = await fn(params);
    return result;
  } catch (_) { return null; }
}
