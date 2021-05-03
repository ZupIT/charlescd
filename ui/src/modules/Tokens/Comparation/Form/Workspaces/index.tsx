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

import { Fragment, useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import take from 'lodash/take';
import size from 'lodash/size';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import ContentIcon from 'core/components/ContentIcon';
import Card from 'core/components/Card';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { Mode } from '../../helpers';
import { MAX_ITEMS, MIN_ITEMS } from './Modal/Content/constants';
import Modal from './Modal';
import { iconByMode, labelByMode } from './helpers';
import Styled from './styled';
import { Option } from './Modal/constants';

interface Props {
  mode?: Mode;
}

const Workspaces = ({ mode }: Props) => {
  const { register, setValue, getValues, watch, trigger } = useFormContext();
  const [isOpen, setIsOpen] = useState<boolean>();
  const [isShowMore, setIsShowMore] = useState<boolean>();
  const workspaces = watch('workspaces') as WorkspacePaginationItem[];
  const watchAllWorkspaces = watch('allWorkspaces') as boolean;
  const preview = isShowMore ? take(workspaces, MAX_ITEMS) : take(workspaces, MIN_ITEMS)
  const isAddMode = isEmpty(preview);

  const validateWorkspaces = useCallback(() => {
    const { allWorkspaces, workspaces } = getValues();

    return allWorkspaces || workspaces?.length ? true : 'required';
  }, [getValues]);

  useEffect(() => {
    register({ name: "allWorkspaces" });
    register({ name: "workspaces" }, { validate: validateWorkspaces });
  }, [register, validateWorkspaces]);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  const toggleShowMore = () => setIsShowMore(!isShowMore);

  const onContinue = (draft: WorkspacePaginationItem[], option: Option) => {
    toggleIsOpen();
    if (option.value === 'ALL') {
      setValue('workspaces', []);
      setValue('allWorkspaces', true);
    } else {
      setValue('workspaces', draft);
      setValue('allWorkspaces', false);
    }

    trigger('workspaces');
  }

  const renderItems = () => (
   map(preview, (workspace) => (
      <Card.Config
        key={workspace?.id}
        icon="workspaces"
        description={workspace?.name}
      />
    ))
  )

  const ShowMore = () => (
    size(workspaces) > MIN_ITEMS &&
      <Styled.ShowMore
        data-testid="showmore-toggle"
        onClick={toggleShowMore}
      >
        <Icon
          color="light"
          name={isShowMore ? 'up' : 'alternate-down'}
          size="18"
        />
        <Text.h4 color="dark">Showing {size(preview)} of {size(workspaces)} workspaces</Text.h4>
      </Styled.ShowMore>
  )

  const renderModal = () => 
    isOpen &&
      <Modal
        workspaces={workspaces}
        onClose={toggleIsOpen}
        onContinue={onContinue}
      />
  
  return (
    <Fragment>
      {renderModal()}
      <ContentIcon icon="workspaces">
        <Text.h2 color="light">Associated Workspaces</Text.h2>
        <Styled.Caption color="dark">
          {
            watchAllWorkspaces
              ? 'Your token has access to all workspaces (including new ones)'
              : 'Your token have access only on these workspaces'
          }
        </Styled.Caption>
        <Styled.Content>
          {preview && !watchAllWorkspaces && renderItems()}
        </Styled.Content>
        <ShowMore />
        {mode === 'create' && <Styled.Button
          name={iconByMode(isAddMode)}
          icon={iconByMode(isAddMode)}
          color="dark"
          onClick={toggleIsOpen}
        >
          {labelByMode(isAddMode)}
        </Styled.Button>}
      </ContentIcon>
    </Fragment>
  )
}

export default Workspaces;
