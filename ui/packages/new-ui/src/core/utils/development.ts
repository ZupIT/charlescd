export const portLegacyDevelopment = '3001';
export const hostLegacyDevelopment = `http://localhost:${portLegacyDevelopment}`;

export const isDevelopmentLegacyHost = () => {
  const { hostname } = window.location;

  return process.env.NODE_ENV !== 'production'
    ? hostLegacyDevelopment
    : `https://${hostname}`;
};
