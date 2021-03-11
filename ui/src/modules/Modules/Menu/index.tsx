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

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Can from 'containers/Can';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import LabeledIcon from 'core/components/LabeledIcon';
import Text from 'core/components/Text';
import { addParam } from 'core/utils/path';
import routes from 'core/constants/routes';
import { isParamExists } from 'core/utils/path';
import InfiniteScroll from 'core/components/InfiniteScroll';
import { useDispatch, useGlobalState } from 'core/state/hooks';
import { resetModulesAction } from '../state/actions';
import { useFindAllModules } from '../hooks/module';
import { Module } from '../interfaces/Module';
import MenuItem from './MenuItem';
import Styled from './styled';

const ModulesMenu = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState<string>('');
  const { getAllModules, loading } = useFindAllModules();
  const { list } = useGlobalState(({ modules }) => modules);
  const isEmptyList = isEmpty(list?.content) && !loading;

  const openNewModule = () => {
    if (!isParamExists('module', NEW_TAB)) {
      addParam('module', routes.modulesComparation, history, NEW_TAB);
    }
  };

  const onChange = useCallback(() => {
    const page = 0;
    dispatch(resetModulesAction());
    getAllModules(name, page);
  }, [dispatch, getAllModules, name]);

  useEffect(() => {
    onChange();
  }, [name, onChange]);

  const loadMore = (page: number) => {
    getAllModules(name, page);
  };

  const renderItem = ({ id, name }: Module) => (
    <MenuItem
      key={id}
      id={id}
      name={name}
    />
  );

  const renderEmpty = () => (
    <Styled.Empty>
      <Text.h3 color="dark">No Modules was found</Text.h3>
    </Styled.Empty>
  );

  const renderList = (data: Module[]) =>
    map(data, item => renderItem(item))

  const renderContent = () => (
    <InfiniteScroll
      hasMore={!list?.last}
      loadMore={loadMore}
      isLoading={loading}
      loader={<Styled.Loader />}
    >
      {isEmptyList ? renderEmpty() : renderList(list?.content)}
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
        <Styled.SearchInput resume onSearch={setName} />
        {renderContent()}
      </Styled.Content>
    </Fragment>
  );
};

export default ModulesMenu;
