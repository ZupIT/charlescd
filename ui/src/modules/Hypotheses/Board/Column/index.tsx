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

import React, {
  Ref,
  useRef,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  ReactNode
} from 'react';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import Styled from './styled';

export interface Props {
  name: string;
  className?: string;
  children: ReactNode;
  caption?: ReactNode;
  action?: ReactNode;
  full?: boolean;
}

const Column = forwardRef(
  (
    { name, className, children, caption, action, full, ...rest }: Props,
    ref: Ref<HTMLDivElement>
  ) => {
    const columnRef = useRef<HTMLDivElement>(null) as MutableRefObject<
      HTMLDivElement
    >;

    useImperativeHandle(ref, () => columnRef.current);

    return (
      <Styled.Wrapper ref={columnRef} {...rest} className={className}>
        <Styled.Header hasCaption={!isEmpty(caption)}>
          {caption || <Text.h4 color="dark">{name}</Text.h4>}
        </Styled.Header>
        <Styled.Column full={full} className="column">
          {children}
        </Styled.Column>
        {action}
      </Styled.Wrapper>
    );
  }
);

export default Column;
