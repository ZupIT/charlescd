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
import { useHistory } from 'react-router-dom';
import { FieldValues, useForm, FormContext } from 'react-hook-form';
import TabPanel from 'core/components/TabPanel';
import ContentIcon from 'core/components/ContentIcon';
import Text from 'core/components/Text';
import routes from 'core/constants/routes';
import AceEditor from 'core/components/AceEditor';
import ParametersForm from './ParametersForm';
import { buildParameters } from './helpers';
import Styled from './styled';
import ResultList from './ResultList';
import useCircleMatcher from './useCircleMatcher';
import { ParameterForm } from './interfaces';
import { blankParameter } from './constants';
import { delParam } from 'core/utils/path';
import { CIRCLE_MATCHER_TAB } from '../constants';

const SPACER = 2;

const CircleMatcher = () => {
  const history = useHistory();
  const [response, isLoading, identifyCircles] = useCircleMatcher();
  const formMethods = useForm({
    defaultValues: { parameters: [blankParameter] },
    mode: 'onChange'
  });
  const [formattedParameters, setFormattedParameters] = useState('');
  const { watch } = formMethods;
  const watchParameters = watch('parameters');

  useEffect(() => {
    const parameters = buildParameters(watchParameters as ParameterForm[]);
    const value = JSON.stringify(parameters, null, SPACER);
    setFormattedParameters(value);
  }, [watchParameters]);

  const onSubmit = (data: FieldValues) => {
    const parameters = buildParameters(data.parameters as ParameterForm[]);
    identifyCircles(parameters);
  };

  const renderJsonEditor = () => {
    return (
      <Styled.EditorWrapper>
        <AceEditor mode="json" value={formattedParameters} />
      </Styled.EditorWrapper>
    );
  };

  const onClose = () => {
    delParam('circle', routes.circlesComparation, history, CIRCLE_MATCHER_TAB);
  };

  return (
    <Styled.Wrapper data-testid="circle-matcher">
      <TabPanel
        title={'Circle matcher'}
        onClose={onClose}
        name="circle-matcher"
        size="15px"
      >
        <Styled.Layer>
          <ContentIcon icon="circle-matcher">
            <Text.h2 color="light">Circle matcher</Text.h2>
          </ContentIcon>
          <Styled.Content>
            {renderJsonEditor()}
            <FormContext {...formMethods}>
              <ParametersForm onSubmit={onSubmit} />
            </FormContext>
          </Styled.Content>
        </Styled.Layer>
        <ResultList circles={response} isLoading={isLoading} />
      </TabPanel>
    </Styled.Wrapper>
  );
};

export default CircleMatcher;
