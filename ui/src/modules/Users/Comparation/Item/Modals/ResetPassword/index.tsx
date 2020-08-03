/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Fragment, useState, useEffect } from 'react';
import Button from 'core/components/Button';
import Text from 'core/components/Text';
import InputAction from 'core/components/Form/InputAction';
import { User } from 'modules/Users/interfaces/User';
import { useResetPassword } from 'modules/Users/hooks';
import { copyToClipboard } from 'core/utils/clipboard';
import Styled from './styled';

interface Props {
  user: User;
  onClose: (arg: boolean) => void;
}

const ModalResetPassword = ({ user, onClose }: Props) => {
  const [isNewPassword, toggleNewPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { resetPassword, response, status } = useResetPassword();
  const TIMEOUT_COPIED = 1500;

  const handleOnClickReset = () => {
    resetPassword(user.id);
  };

  const handleCopyToClipboard = () => {
    setIsCopied(true);
    copyToClipboard(response?.newPassword);
  };

  useEffect(() => {
    if (response?.newPassword) {
      toggleNewPassword(true);
    }
  }, [status.isResolved, response]);

  useEffect(() => {
    let timeout = 0;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, TIMEOUT_COPIED);
    }

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <Styled.Modal onClose={() => onClose(false)}>
      <Text.h2 weight="bold" color="light">
        Reset password
      </Text.h2>
      <Text.h4 color="dark">
        Are you sure you want to reset <strong>{user.email}</strong>
        {`'`}s password?
      </Text.h4>
      <Button.Default
        id="reset-password"
        size="EXTRA_SMALL"
        isLoading={status.isPending}
        isDisabled={isNewPassword}
        onClick={handleOnClickReset}
      >
        Yes, reset password
      </Button.Default>
      {isNewPassword && (
        <Fragment>
          <Text.h4 color="dark">
            New password generated. Contact the user and send the new password.
          </Text.h4>
          <InputAction
            isDisabled
            name="new-password"
            icon={isCopied ? 'checkmark-circle' : 'copy'}
            iconColor={isCopied ? 'success' : 'dark'}
            defaultValue={response?.newPassword}
            onClick={handleCopyToClipboard}
          />
        </Fragment>
      )}
    </Styled.Modal>
  );
};

export default ModalResetPassword;
