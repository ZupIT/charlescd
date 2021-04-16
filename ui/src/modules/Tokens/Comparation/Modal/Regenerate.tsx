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
  onClose: Function;
  onContinue: Function;
  isLoading?: boolean;
}

const ModalRegenerate = ({ onClose, onContinue, isLoading }: Props) => {
  return (
    <Modal.Trigger
      title="Are you sure you want to regenerate this token?"
      dismissLabel="Cancel, keep token"
      continueLabel="Yes, regenerate token"
      onContinue={onContinue}
      onDismiss={onClose}
      isLoading={isLoading}
    >
      <Text.h4 color="dark">
        Any application or script using this token will no loger be able ato accesss Charles C.D. APIs.
        You can not undo this action. Do you want to continue?
      </Text.h4>
    </Modal.Trigger>
  )
}

export default ModalRegenerate