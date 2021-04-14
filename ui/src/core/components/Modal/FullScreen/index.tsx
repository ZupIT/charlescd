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

import React from 'react';
import Icon from 'core/components/Icon';
import Styled from './styled';

interface Props {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onClose: (event?: React.MouseEvent<unknown, MouseEvent>) => void;
  onCopy: (event?: React.MouseEvent<unknown, MouseEvent>) => void;
}

const ModalFullScreen = ({
  children,
  className,
  isOpen = true,
  onClose,
  onCopy
}: Props) => (
    <Styled.Wrapper
      data-testid="modal-default"
      className={className}
      isOpen={isOpen}
    >
        <Styled.Container className="modal-container">
            <Styled.Header>
              <Icon name="collapse" color="light" size="18px" onClick={onClose} />
              <Icon name="copy" color="light" size="18px" onClick={onCopy} />
            </Styled.Header>
            <Styled.Content className="modal-content">{children}</Styled.Content>
        </Styled.Container>
    </Styled.Wrapper>
  );

export default ModalFullScreen;
