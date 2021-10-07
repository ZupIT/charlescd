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
// @ts-nocheck


import { Fragment, useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import ContentIcon from 'core/components/ContentIcon';
import Text from 'core/components/Text';
import { Mode } from '../../helpers';
import Modal from './Modal';
import ModalView from '../../View/Modal';
import Styled from './styled';
import { Option } from './Modal/constants';
import { iconByMode, labelByMode } from './helpers';

interface Props {
  mode?: Mode;
  tokenWorkspaces: string[];
  allWorkspaces: boolean;
}

const Workspaces = ({ mode, tokenWorkspaces, allWorkspaces }: Props) => {
  const { register, setValue, getValues, watch, trigger } = useFormContext();
  const [isOpen, setIsOpen] = useState<boolean>();
  const [isViewOpen, setIsViewOpen] = useState<boolean>();
  const workspaces = watch('workspaces') as WorkspacePaginationItem[];
  const watchAllWorkspaces = watch('allWorkspaces') as boolean;
  const [isAddMode, setIsAddMode] = useState<boolean>(true);

  const validateWorkspaces = useCallback(() => {
    const { allWorkspaces, workspaces } = getValues();

    return allWorkspaces || workspaces?.length ? true : 'required';
  }, [getValues]);

  useEffect(() => {
    register({ name: 'allWorkspaces' });
    register({ name: 'workspaces' }, { validate: validateWorkspaces });
  }, [register, validateWorkspaces]);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  const toggleIsViewOpen = () => setIsViewOpen(!isViewOpen);

  const onContinue = (draft: WorkspacePaginationItem[], option: Option) => {
    toggleIsOpen();
    setIsAddMode(false);
    if (option.value === 'ALL') {
      setValue('workspaces', []);
      setValue('allWorkspaces', true);
    } else {
      setValue('workspaces', draft);
      setValue('allWorkspaces', false);
    }

    trigger('workspaces');
  };

  const renderModalAddWorkspaces = () => 
    isOpen &&
      <Modal
        workspaces={workspaces}
        onClose={toggleIsOpen}
        onContinue={onContinue}
      />

  const renderModalViewWorkspaces = () => 
    isViewOpen &&
      <ModalView
        allWorkspaces={allWorkspaces}
        tokenWorkspaces={tokenWorkspaces}
        onClose={toggleIsViewOpen}
      />
  
  return (
    <Fragment>
      {renderModalAddWorkspaces()}
      {renderModalViewWorkspaces()}
      <ContentIcon icon="workspaces">
        <Text tag="H2" color="light">
          Associated Workspaces
        </Text>
        <Styled.Caption tag="H5" color="dark">
          {watchAllWorkspaces
            ? 'Your token has access to all workspaces (including new ones)'
            : 'Your token have access only on these workspaces'}
        </Styled.Caption>
        {mode === 'create' && 
          <Styled.Button
            name={iconByMode(isAddMode)}
            icon={iconByMode(isAddMode)}
            color="dark"
            onClick={toggleIsOpen}
          >
            {labelByMode(isAddMode)}
          </Styled.Button>}
        {mode === 'view' && 
          <Styled.Button
            name='view'
            icon='view'
            color="dark"
            onClick={toggleIsViewOpen}
          >
            View workspaces
          </Styled.Button>}
      </ContentIcon>
    </Fragment>
  );
};

export default Workspaces;
