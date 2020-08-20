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
import Text from 'core/components/Text';
import Styled from './styled';
import AddMetric from './AddMetric';

interface Props {
  id: string;
  onGoBack: Function;
}

const GroupMetrics = ({ onGoBack }: Props) => {
  return <AddMetric />;
  // return (
  //   <>
  //     <Styled.Layer>
  //       <Styled.Icon
  //         name="arrow-left"
  //         color="dark"
  //         onClick={() => onGoBack()}
  //       />
  //     </Styled.Layer>
  //     <Styled.Layer>
  //       <Text.h2 color="light">Add metrics group</Text.h2>
  //       <Styled.ButtonAdd
  //         name="add"
  //         icon="add"
  //         color="dark"
  //         onClick={() => null}
  //       >
  //         Add metrics group
  //       </Styled.ButtonAdd>
  //     </Styled.Layer>
  //   </>
  // );
};

export default GroupMetrics;
