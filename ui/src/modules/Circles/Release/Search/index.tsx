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

import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useForm } from 'react-hook-form';
import { getProfileByKey } from 'core/utils/profile';
import { Deployment } from 'modules/Circles/interfaces/Circle';
import { useFindBuilds, useCreateDeployment } from '../hooks';
import { getBuildOptions } from './helpers';
import Styled from '../styled';

interface Props {
  circleId: string;
  onDeployed: (deploy: Deployment) => void;
}

const SearchRelease = ({ circleId, onDeployed }: Props) => {
  const authorId = getProfileByKey('id');
  const { control, handleSubmit, getValues } = useForm();
  const [lastTag, setLastTag] = useState('');
  const [buildOptions, setBuildOptions] = useState([]);
  const { getBuilds, response, loading } = useFindBuilds();
  const { createDeployment, response: deployed } = useCreateDeployment();

  useEffect(() => {
    getBuilds({ status: 'BUILT' });
  }, [getBuilds]);

  useEffect(() => {
    if (response) {
      const builds = getBuildOptions(response.content);
      setBuildOptions(builds);
    }
  }, [response]);

  useEffect(() => {
    if (deployed) {
      onDeployed(deployed);
    }
  }, [deployed, onDeployed]);

  const onSubmit = () => {
    const { buildId } = getValues();
    createDeployment({ authorId, circleId, buildId });
  };

  const onSearchChange = (value: string) => {
    if (value !== lastTag) {
      setLastTag(value);
      getBuilds({ tagName: value });
    }
  };

  return (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Styled.SearchWrapper data-testid="search-release">
        <Styled.Select
          name="buildId"
          label="Select a release name"
          options={buildOptions}
          control={control}
          isLoading={loading}
          onInputChange={debounce(onSearchChange, 500)}
          rules={{ required: true }}
        />
      </Styled.SearchWrapper>
      <Styled.Submit size="EXTRA_SMALL" type="submit">
        Deploy
      </Styled.Submit>
    </Styled.Form>
  );
};

export default SearchRelease;
