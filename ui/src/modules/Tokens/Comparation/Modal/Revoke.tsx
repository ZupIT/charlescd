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

import Modal from 'core/components/Modal';
import Text from 'core/components/Text';

interface Props {
  onClose?: Function;
  onContinue?: Function;
  isLoading?: boolean;
  tokenName?: string;
}

const ModalRevoke = ({ onClose, onContinue, isLoading, tokenName }: Props) => {
  const handleDismiss = () => {
    onClose();
  }

  const handleContinue = () => {
    onContinue();
  }

  return (
    <Modal.Trigger
      title="Are you sure you want to revoke the following token:"
      itemName={tokenName}
      dismissLabel="Cancel, keep token"
      continueLabel="Yes, revoke token"
      isLoading={isLoading}
      onContinue={handleContinue}
      onDismiss={handleDismiss}
    >
      <Text.h4 color="dark">
        Any application or script using this token will no longer be able to access Charles C.D. APIs.
        You cannot undo this action. Do you want to continue?
      </Text.h4>
    </Modal.Trigger>
  )
}

export default ModalRevoke