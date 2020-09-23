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
import map from 'lodash/map';
import { useHistory } from 'react-router';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import Menu from 'core/components/Menu';
import Can from 'containers/Can';
import { Link as LinkRouter } from 'react-router-dom';
import routes from 'core/constants/routes';
import { CirclePaginationItem } from '../interfaces/CirclesPagination';
import { menuFilterItems, CIRCLE_MATCHER_TAB } from '../constants';
import { CIRCLE_STATUS } from '../hooks';
import MenuItem from './MenuItem';
import Loader from './Loaders';
import Styled from './styled';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import { addParam, isParamExists } from 'core/utils/path';

interface Props {
  items: CirclePaginationItem[];
  status: string;
  onSearch: (name: string) => void;
  onSelect: (selected: string) => void;
  isLoading: boolean;
}

const CirclesFilter = ({
  items,
  status,
  onSearch,
  onSelect,
  isLoading
}: Props) => {
  const history = useHistory();
  const renderItems = () =>
    map(items, ({ id, name }: CirclePaginationItem) => (
      <MenuItem key={id} id={id} name={name} />
    ));

  const circleStatus = status === CIRCLE_STATUS.active ? 'Active' : 'Inactive';

  const goToCircleComparison = (tab: string) => {
    if (!isParamExists('circle', tab)) {
      addParam('circle', routes.circlesComparation, history, tab);
    }
  };

  return (
    <>
      <Styled.Actions>
        <Can I="write" a="circles" passThrough>
          <Styled.A onClick={() => goToCircleComparison(NEW_TAB)}>
            <LabeledIcon icon="plus-circle" marginContent="5px">
              <Text.h5 color="dark">Create circle</Text.h5>
            </LabeledIcon>
          </Styled.A>
        </Can>
        <Menu actions={menuFilterItems} active={status} onSelect={onSelect}>
          <LabeledIcon icon="filter" marginContent="5px">
            <Text.h5 color="dark">{circleStatus}</Text.h5>
          </LabeledIcon>
        </Menu>
        <Styled.A onClick={() => goToCircleComparison(CIRCLE_MATCHER_TAB)}>
          <Styled.Icon name="circle-matcher" color="dark" size="15px" />
        </Styled.A>
        <Styled.A as={LinkRouter} to={routes.circlesMetrics}>
          <Styled.Icon name="activity" color="dark" />
        </Styled.A>
      </Styled.Actions>
      <Styled.SearchInput resume onSearch={onSearch} />
      <Styled.Content>
        <Styled.List>{isLoading ? <Loader.List /> : renderItems()}</Styled.List>
      </Styled.Content>
    </>
  );
};

export default CirclesFilter;
