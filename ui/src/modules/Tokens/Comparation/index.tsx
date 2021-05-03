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

import { Redirect } from 'react-router-dom';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { getAllParams } from 'core/utils/path';
import routes from 'core/constants/routes';
import Styled from './styled';
import Tab from './Tab';

const Comparation = () => {
  const tokensParams = getAllParams('token');

  const renderTabs = () => 
    map(tokensParams, param => (
      <Tab key={param} param={param} />
    ))

  return (
    <Styled.ScrollX>
      <Styled.Wrapper>
        {isEmpty(tokensParams) ? (
          <Redirect to={routes.tokens} />
        ) : (
          renderTabs()
        )}
      </Styled.Wrapper>
    </Styled.ScrollX>
  );
};

export default Comparation;
