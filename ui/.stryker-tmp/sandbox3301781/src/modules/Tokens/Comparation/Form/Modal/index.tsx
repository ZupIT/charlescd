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
// @ts-nocheck


import { useState, useEffect } from 'react';
import Text from 'core/components/Text';
import InputAction from 'core/components/Form/InputAction';
import { copyToClipboard } from 'core/utils/clipboard';
import Styled from './styled';
import Icon from 'core/components/Icon';
import LabeledIcon from 'core/components/LabeledIcon';

interface Props {
  title: string;
  tokenName: string;
  description: string;
  token: string;
  onClose?: () => void;
}

const ModalCopyToken = ({ title, tokenName, description, token, onClose }: Props) => {
  const [isCopied, setIsCopied] = useState(false);
  const TIMEOUT_COPIED = 1500;

  const handleCopyToClipboard = () => {
    setIsCopied(true);
    copyToClipboard(token);
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, TIMEOUT_COPIED);
    }

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <Styled.Modal onClose={onClose}>
      <Text tag="H2" weight="bold" color="light" data-testid="modal-token-title">
        {title}
      </Text>
      <LabeledIcon icon='token'>
        {tokenName}
      </LabeledIcon>
      <Text tag="H5" color="dark" data-testid="modal-token-subtitle">
        {description}
      </Text>
      <InputAction
        isDisabled
        name="new-token"
        icon={isCopied ? 'checkmark-circle' : 'copy'}
        iconColor={isCopied ? 'success' : 'dark'}
        defaultValue={token}
        onClick={handleCopyToClipboard}
      />
      <Styled.Warning>
        <Icon name="warning" color="warning" />
        <Text tag="H5" color="dark" id="modal-token-warning">
          Make sure you copy the above token now. We don't store it and you will
          not be able to see it again.
        </Text>
      </Styled.Warning>
    </Styled.Modal>
  );
};

export default ModalCopyToken;
