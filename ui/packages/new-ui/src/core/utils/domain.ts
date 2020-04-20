export const getDomain = () => {
  const { hostname } = window.location;

  return hostname === 'localhost'
    ? 'localhost'
    : hostname.slice(hostname.indexOf('.'));
};

export const getCookieOptions = () => ({
  path: '/',
  domain: getDomain()
});
