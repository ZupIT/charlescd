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

import React, { ReactNode } from 'react';
import Layer from 'core/components/Layer';
import Styled from './styled';

interface Props {
  action: Function;
  children: ReactNode;
}

const SectionLayer = ({ children, action }: Props) => (
  <>
    <Styled.Layer>
      <Styled.Icon
        name="arrow-left"
        color="dark"
        onClick={() => action(null)}
      />
    </Styled.Layer>
    <Layer>{children}</Layer>
  </>
);

export default SectionLayer;
