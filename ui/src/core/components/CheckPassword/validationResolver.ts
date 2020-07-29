import forEach from 'lodash/forEach';
import { checkPoints } from './helpers';

type CheckPassword = {
  password: string;
  confirmPassword: string;
  oldPassword: string;
};

interface Error {
  [key: string]: {
    type: string;
    message: string;
  };
}

export const validationResolver = (data: CheckPassword) => {
  const error: Error = {};

  forEach(checkPoints, checkPoint => {
    const isValid = checkPoint.rule(data.password, data.confirmPassword);
    const field =
      checkPoint.name !== 'Confirm password' ? 'password' : 'confirmPassword';

    if (!isValid) {
      error[field] = {
        type: checkPoint.name as string,
        message: checkPoint.message as string
      };
    }
  });

  return {
    values: {},
    errors: error
  };
};
