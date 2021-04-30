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
import find from 'lodash/find';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Deployment } from 'modules/Circles/interfaces/Circle';
import Metadata from '../Metadata';
import { useFindBuilds, useCreateDeployment } from '../hooks';
import { getBuildOptions, getMetadata, toKeyValue } from './helpers';
import Styled from '../styled';
import { Option } from 'core/components/Form/Select/interfaces';
import { Scope } from '../Metadata/interfaces';

interface Props {
  circleId: string;
  onDeployed: (deploy: Deployment) => void;
}

const defaultValues = {
  buildId: '',
  circleId: '',
  metadata: {
    content: [{
      key: '', value: ''
    }]
  }
};

const SearchRelease = ({ circleId, onDeployed }: Props) => {
  const form = useForm({
    defaultValues,
    mode: 'onChange',
  });
  const { control, handleSubmit, getValues, setValue, formState: { isValid } } = form;
  const metadataFields = useFieldArray({ control, name: 'metadata.content' });
  const [lastTag, setLastTag] = useState('');
  const [buildOptions, setBuildOptions] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const { getBuilds, response, loading } = useFindBuilds();
  const { createDeployment, response: deployed } = useCreateDeployment();

  useEffect(() => {
    getBuilds({ status: 'BUILT' });
  }, [getBuilds]);

  useEffect(() => {
    if (metadata) {
      setValue('metadata.content', metadata);
    }
  }, [metadata, setValue]);

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
    const { buildId, metadata } = getValues();

    createDeployment({
      circleId,
      buildId,
      metadata: {
        scope: Scope.APPLICATION,
        content: toKeyValue(metadata)
      }
    });
  };

  const onSelect = (option: Option) => {
    if (response) {
      const build = find(response.content, ['id', option.value]);
      const metadata = getMetadata(build);
      setMetadata(metadata);
    }
  }

  const onSearchChange = (value: string) => {
    if (value !== lastTag) {
      setLastTag(value);
      getBuilds({ tagName: value });
    }
  };

  return (
    <FormProvider {...form}>
      <Styled.Form onSubmit={handleSubmit(onSubmit)}>
        <Styled.SearchWrapper data-testid="search-release">
          <Styled.Select
            name="buildId"
            label="Select a release name"
            options={buildOptions}
            control={control}
            isLoading={loading}
            onInputChange={debounce(onSearchChange, 500)}
            onChange={onSelect}
            rules={{ required: true }}
          />
        </Styled.SearchWrapper>
        {metadata && <Metadata fieldArray={metadataFields} />}
        <Styled.Submit size="EXTRA_SMALL" type="submit" isDisabled={!isValid}>
          Deploy
        </Styled.Submit>
      </Styled.Form>
    </FormProvider>
  );
};

export default SearchRelease;
