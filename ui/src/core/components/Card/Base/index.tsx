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
import Styled from './styled';

export interface Props {
  children: ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Card = forwardRef(
  (
    { children, className, onClick, ...rest }: Props,
    ref: Ref<HTMLDivElement>
  ) => {
    const cardRef = useRef<HTMLDivElement>(null) as MutableRefObject<
      HTMLDivElement
    >;

    useImperativeHandle(ref, () => cardRef.current);

    return (
      <Styled.Card
        ref={cardRef}
        className={className}
        onClick={onClick}
        {...rest}
      >
        {children}
      </Styled.Card>
    );
  }
);

export default Card;
