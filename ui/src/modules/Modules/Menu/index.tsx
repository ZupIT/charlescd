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
import { useHistory } from 'react-router-dom';
import map from 'lodash/map';
import Can from 'containers/Can';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import LabeledIcon from 'core/components/LabeledIcon';
import Text from 'core/components/Text';
import { addParam } from 'core/utils/path';
import routes from 'core/constants/routes';
import { isParamExists } from 'core/utils/path';
import { useFindAllModules } from '../hooks/module';
import { Module } from '../interfaces/Module';
import MenuItem from './MenuItem';
import Loader from './Loaders';
import Styled from './styled';

interface MenuProps {
  items: Module[];
  isLoading?: boolean;
}

const ModuleList = ({ items }: MenuProps) => (
  <>
    {map(items, item => (
      <MenuItem key={item.id} id={item.id} name={item.name} />
    ))}
  </>
);

const ModuleMenu = ({ items, isLoading }: MenuProps) => {
  const { getAllModules } = useFindAllModules();
  const history = useHistory();

  const openNewModule = () => {
    if (!isParamExists('module', NEW_TAB)) {
      addParam('module', routes.modulesComparation, history, NEW_TAB);
    }
  };

  const onSearch = (search: string) => {
    getAllModules(search);
  };

  return (
    <>
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
        <Styled.List>
          {isLoading ? <Loader.List /> : <ModuleList items={items} />}
        </Styled.List>
      </Styled.Content>
    </>
  );
};

export default ModuleMenu;
