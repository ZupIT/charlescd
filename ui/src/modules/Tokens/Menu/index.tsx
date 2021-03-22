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

import { Fragment, useCallback, useEffect, useState } from 'react';
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
// import { useDispatch, useGlobalState } from 'core/state/hooks';
// import { resetModulesAction } from '../state/actions';
import { useFindAll } from '../hooks';
import { Token } from '../interfaces';
import MenuItem from './MenuItem';
import Styled from './styled';

const TokensMenu = () => {
  // const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState<string>('');
  const { getAll, response, status } = useFindAll();
  // const { list } = useGlobalState(({ modules }) => modules);
  const isEmptyList = isEmpty(response?.content) && !status.isPending;

  const handleCreate = () => {
    if (!isParamExists('token', NEW_TAB)) {
      addParam('token', routes.tokensComparation, history, NEW_TAB);
    }
  };

  const onChange = useCallback(() => {
    const page = 0;
    // dispatch(resetModulesAction());
    getAll(name, page);
  }, [getAll, name]);

  useEffect(() => {
    onChange();
  }, [name, onChange]);

  const loadMore = (page: number) => {
    getAll(name, page);
  };

  const renderItem = ({ id, name }: Token) => (
    <MenuItem
      key={id}
      id={id}
      name={name}
    />
  );

  const renderEmpty = () => (
    <Styled.Empty>
      <Text.h3 color="dark">No token was found</Text.h3>
    </Styled.Empty>
  );

  const renderList = (data: Token[]) =>
    map(data, item => renderItem(item))

  const renderContent = () => (
    <InfiniteScroll
      hasMore={!response?.last}
      loadMore={loadMore}
      isLoading={status.isPending}
      loader={<Styled.Loader />}
    >
      {isEmptyList ? renderEmpty() : renderList(response?.content)}
    </InfiniteScroll>
  );

  return (
    <Fragment>
      <Styled.Actions>
        <Can I="write" a="modules" passThrough>
          <Styled.Button onClick={handleCreate}>
            <LabeledIcon icon="plus-circle" marginContent="5px">
              <Text.h5 color="dark">Create access token</Text.h5>
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

export default TokensMenu;
