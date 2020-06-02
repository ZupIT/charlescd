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

import React, { useState } from 'react';
import Text from 'core/components/Text';
import RadioGroup from 'core/components/RadioGroup';
import CreateRelease from './Create';
import SearchRelease from './Search';
import { radios } from './constants';
import Styled from './styled';
import { Deployment } from '../interfaces/Circle';

interface Props {
  id: string;
  onGoBack: Function;
  onCreateRelease: (deploy: Deployment) => void;
}

const Release = ({ id, onGoBack, onCreateRelease }: Props) => {
  const [type, setType] = useState('');

  return (
    <>
      <Styled.Layer>
        <Styled.Icon
          name="arrow-left"
          color="dark"
          onClick={() => onGoBack()}
        />
      </Styled.Layer>
      <Styled.Layer>
        <Text.h2 color="light">Add release</Text.h2>
        <Styled.Subtitle color="dark">
          You can create a release manually or search for existing releases.
        </Styled.Subtitle>

        <RadioGroup
          name="type"
          items={radios}
          onChange={({ currentTarget }) => setType(currentTarget.value)}
        />
        {type === 'create' && (
          <CreateRelease
            circleId={id}
            onDeployed={(deploy: Deployment) => onCreateRelease(deploy)}
          />
        )}
        {type === 'search' && (
          <SearchRelease
            circleId={id}
            onDeployed={(deploy: Deployment) => onCreateRelease(deploy)}
          />
        )}
      </Styled.Layer>
    </>
  );
};

export default Release;
