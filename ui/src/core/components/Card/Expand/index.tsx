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

import React, { useRef, ReactNode, Fragment } from 'react';
import useOutsideClick from 'core/hooks/useClickOutside';
import ExpandArtifact from './Artifact';
import ExpandModule from './Module';
import ExpandItem from './Item';
import Styled from './styled';

export interface Props {
  className?: string;
  children?: ReactNode;
  onClick: () => void;
}

const CardExpand = ({ onClick, children, className }: Props) => {
  const ref = useRef<HTMLDivElement>();

  useOutsideClick(ref, () => onClick());

  return (
    <Fragment>
      <Styled.Expand ref={ref} className={className}>
        {children}
      </Styled.Expand>
      <Styled.Action onClick={onClick} />
    </Fragment>
  );
};

CardExpand.Item = ExpandItem;
CardExpand.Artifact = ExpandArtifact;
CardExpand.Module = ExpandModule;

export default CardExpand;
