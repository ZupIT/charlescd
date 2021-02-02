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

import React, { Fragment, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import map from 'lodash/map';
import Can from 'containers/Can';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import LabeledIcon from 'core/components/LabeledIcon';
import Text from 'core/components/Text';
import { addParam } from 'core/utils/path';
import routes from 'core/constants/routes';
import { isParamExists } from 'core/utils/path';
import InfiniteScroll from 'core/components/InfiniteScroll';
import { useGlobalState } from 'core/state/hooks';
import { useFindAllModules } from '../hooks/module';
import MenuItem from './MenuItem';
import Loader from './Loaders';
import Styled from './styled';
import { Module } from '../interfaces/Module';

interface Props {
  onCreate?: () => void;
  onSelect?: (id: string) => void;
}

const ModulesMenu = ({ onCreate, onSelect }: Props) => {
  const { getAllModules, loading } = useFindAllModules();
  const { list } = useGlobalState(({ modules }) => modules);
  const history = useHistory();

  const openNewModule = () => {
    if (!isParamExists('module', NEW_TAB)) {
      addParam('module', routes.modulesComparation, history, NEW_TAB);
    }
  };

  const onSearch = (search: string) => {
    getAllModules(search);
  };

  const loadByPage = useCallback(
    (page: number, name?: string) => {
      getAllModules(name, page);
    },
    [getAllModules]
  );

  useEffect(() => {
    loadByPage(0);
  }, [loadByPage]);

  const renderItem = ({ id, name }: Module) => (
    <MenuItem key={id} id={id} name={name} />
  );

  const renderList = () => (
    <InfiniteScroll
      hasMore={!list.last}
      loadMore={loadByPage}
      isLoading={loading}
      loader={<Styled.Loader />}
    >
      {map(list?.content, item => renderItem(item))}
    </InfiniteScroll>
  );

  return (
    <Fragment>
      <Styled.Actions>
        <Can I="write" a="modules" passThrough>
          <Styled.Button onClick={openNewModule}>
            <LabeledIcon icon="plus-circle" marginContent="5px">
              <Text.h5 color="dark">Create Module</Text.h5>
            </LabeledIcon>
          </Styled.Button>
        </Can>
      </Styled.Actions>
      <Styled.Content>
        <Styled.SearchInput resume onSearch={onSearch} />
        <Styled.List>{loading ? <Loader.List /> : renderList()}</Styled.List>
      </Styled.Content>
    </Fragment>
  );
};

export default ModulesMenu;
