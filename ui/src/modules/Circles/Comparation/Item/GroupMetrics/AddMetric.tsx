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
import { useForm } from 'react-hook-form';
import Text from 'core/components/Text';
import { Option } from 'core/components/Form/Select/interfaces';
import { metricProviders } from 'core/constants/metrics-providers';
import Styled from './styled';
import { thresholdOptions } from './constants';
import AceEditorForm from 'core/components/Form/AceEditor';

interface Props {
  id?: string;
  onGoBack?: Function;
}

const AddMetric = ({ onGoBack }: Props) => {
  const { handleSubmit, register, control } = useForm();
  const [isBasicQuery, setIsBasicQuery] = useState(true);
  const [provider, setProvider] = useState<Option>();
  const onSubmit = (data: any) => {
    console.log(data);
  };

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
        <Text.h2 color="light">Add metric</Text.h2>
      </Styled.Layer>
      <Styled.Form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="create-metric"
      >
        <Styled.Layer>
          <Styled.Input
            name="metricName"
            ref={register({ required: true })}
            label="Type a nickname for metric"
          />

          <Styled.ProviderSelect
            control={control}
            name="url"
            label="Select a type server"
            options={metricProviders}
            onChange={option => setProvider(option)}
          />
          <Text.h5 color="dark">
            You can fill your query in a basic or advanced way:
          </Text.h5>
          <Styled.Actions>
            <Styled.ButtonIconRounded
              color="dark"
              onClick={() => setIsBasicQuery(true)}
              isActive={isBasicQuery}
            >
              Basic
            </Styled.ButtonIconRounded>
            <Styled.ButtonIconRounded
              color="dark"
              onClick={() => setIsBasicQuery(false)}
              isActive={!isBasicQuery}
            >
              Advanced
            </Styled.ButtonIconRounded>
          </Styled.Actions>

          {!isBasicQuery && (
            <>
              <Text.h5 color="dark">Type a query:</Text.h5>

              <Styled.AceEditorWrapper>
                <AceEditorForm
                  height="50px"
                  mode="json"
                  name="query"
                  control={control}
                />
              </Styled.AceEditorWrapper>
            </>
          )}

          <Styled.Title color="light">Threshold</Styled.Title>
          <Styled.Subtitle color="dark">
            Set the threshold to indicate when to reach the configured numeric
            value.
          </Styled.Subtitle>

          <Styled.ThresholdWrapper>
            <Styled.ThresholdSelect
              options={thresholdOptions}
              control={control}
              rules={{ required: true }}
              label="Conditional"
              name="condition"
            />

            <Styled.InputNumber
              name="threshold"
              label="Threshold"
              ref={register({ required: true })}
            />
          </Styled.ThresholdWrapper>

          <Styled.ButtonDefault
            type="submit"
            isLoading={false}
            isDisabled={false}
            isValid={false}
          >
            <Text.h6 color={'dark'}>Save</Text.h6>
          </Styled.ButtonDefault>
        </Styled.Layer>
      </Styled.Form>
    </>
  );
};

export default AddMetric;
