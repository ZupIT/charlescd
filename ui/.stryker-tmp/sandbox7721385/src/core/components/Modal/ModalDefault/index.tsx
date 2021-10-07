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


import { useRef } from 'react';
import Icon from 'core/components/Icon';
import useOutsideClick from 'core/hooks/useClickOutside';
import Styled from './styled';

export interface Props {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onClose: () => void;
  isOutsideClick?: boolean;
}

const ModalDefault = ({
  children,
  className,
  isOpen = true,
  onClose,
  isOutsideClick,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>();

  useOutsideClick(modalRef, () => {
    if (isOutsideClick) {
      onClose();
    }
  });

  return (
    <Styled.Wrapper
      data-testid='modal-default'
      className={className}
      isOpen={isOpen}
    >
      <Styled.Background className="modal-background" />
      <Styled.Dialog className="modal-dialog" ref={modalRef}>
        <Styled.Container className="modal-container">
          <Styled.Button>
            <Icon name="cancel" color="dark" size="22px" onClick={onClose} />
          </Styled.Button>
          <Styled.Content className="modal-content">{children}</Styled.Content>
        </Styled.Container>
      </Styled.Dialog>
    </Styled.Wrapper>
  );
};

export default ModalDefault;
