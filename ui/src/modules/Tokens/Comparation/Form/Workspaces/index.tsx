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

import { Fragment, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import take from 'lodash/take';
import size from 'lodash/size';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import { isRequired } from 'core/utils/validations';
import ContentIcon from 'core/components/ContentIcon';
import Card from 'core/components/Card';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { Mode } from '../../helpers';
import { MAX_ITEMS, MIN_ITEMS } from './Modal/Content/constants';
import Modal from './Modal';
import { iconByMode, labelByMode } from './helpers';
import Styled from './styled';

interface Props {
  mode?: Mode;
}

const Workspaces = ({ mode }: Props) => {
  const { register, setValue, watch } = useFormContext();
  const [isOpen, setIsOpen] = useState<boolean>();
  const [isShowMore, setIsShowMore] = useState<boolean>();
  const workspaces = watch('workspaces') as WorkspacePaginationItem[];
  const preview = isShowMore ? take(workspaces, MAX_ITEMS) : take(workspaces, MIN_ITEMS)
  const isAddMode = isEmpty(preview);

  useEffect(() => {
    register({ name: "workspaces" }, { required: isRequired() });
  }, [register]);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  const toggleShowMore = () => setIsShowMore(!isShowMore);

  const onContinue = (draft: WorkspacePaginationItem[]) => {
    toggleIsOpen();
    setValue('workspaces', draft);
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
        data-testid="circle-list-container-button"
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
        <Styled.Caption color="dark">Your token have access only on these workspaces</Styled.Caption>
        <Styled.Content>
          {preview && renderItems()}
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
