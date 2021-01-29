import { GitFormData } from './interfaces';

export const buildConnectionPayload = (
  formData: GitFormData,
  gitType: string
) => {
  return {
    credentials: {
      address:
        gitType === 'GitHub'
          ? 'https://github.com'
          : formData.credentials.address,
      accessToken: formData.credentials.accessToken,
      serviceProvider: gitType.toUpperCase()
    }
  };
};
