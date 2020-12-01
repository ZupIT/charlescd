import { GitFormData } from './interfaces';

export const buildTestConnectionPayload = (
  formData: GitFormData,
  gitType: string
) => {
  return {
    credentials: {
      address: formData.credentials.address,
      accessToken: formData.credentials.accessToken,
      serviceProvider: gitType.toUpperCase()
    }
  };
};
