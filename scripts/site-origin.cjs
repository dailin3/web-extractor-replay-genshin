/** Detect remote dependencies without treating the deployed site's own HTTPS origin as external. */
function findExternalRequests(requests, entryUrl) {
  const origin = new URL(entryUrl).origin;
  return requests.filter(
    ({ url }) => /^https?:/.test(url) && new URL(url).origin !== origin,
  );
}
module.exports = { findExternalRequests };
