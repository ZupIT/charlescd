import { generatePath } from 'react-router';
import { portLegacyDevelopment } from 'core/utils/development';

export const generatePathV1 = (
  path: string,
  params: { [paramName: string]: string | number | boolean }
) => {
  const skipLegacyPort = {
    [portLegacyDevelopment]: `:${portLegacyDevelopment}`
  };

  return generatePath(path, { ...skipLegacyPort, ...params });
};

export const goToV2 = (path: string) => {
  window.location.href = path;
};
