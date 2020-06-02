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

import React, { useState, useEffect } from 'react';
import Modal from 'core/components/Modal';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { Circle } from 'modules/Circles/interfaces/Circle';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import Segments, { Rules } from 'modules/Circles/Segments';
import ImportCSV from './ImportCSV';
import { useSaveCircleManually } from 'modules/Circles/hooks';
import { getProfileByKey } from 'core/utils/profile';
import Styled from './styled';
import { getWarningText, WarningMessage } from './helpers';

type SegmentType = 'CREATE_MANUALLY' | 'IMPORT_CSV';

interface Props {
  onGoBack: Function;
  id: string;
  circle: Circle;
  onSaveCircle: Function;
}

const CreateSegments = ({ onGoBack, id, circle, onSaveCircle }: Props) => {
  const isEditing = id !== NEW_TAB;
  const [activeSegment, setActiveSegment] = useState<SegmentType>();
  const [saveCircleResponse, saveCircle, isSaving] = useSaveCircleManually(id);
  const [warningMessage, setWarningMessage] = useState<WarningMessage>();
  const isMatcherTypeSimpleKV = circle?.matcherType === 'SIMPLE_KV';
  const [rules, setRules] = useState<Rules>(circle?.rules);
  const isSegmentManually = activeSegment === 'CREATE_MANUALLY';
  const isSegmentImportCSV = activeSegment === 'IMPORT_CSV';

  useEffect(() => {
    if (isEditing && circle?.matcherType === 'REGULAR') {
      setActiveSegment('CREATE_MANUALLY');
    }
  }, [circle, isEditing]);

  useEffect(() => {
    if (saveCircleResponse) {
      onSaveCircle(saveCircleResponse);
    }
  }, [saveCircleResponse, onSaveCircle]);

  const saveCircleManually = (rules: Rules) => {
    const { name } = circle;
    const authorId = getProfileByKey('id');
    saveCircle({ ...circle, rules, name, authorId });
  };

  const onDismissWarningMessage = () => {
    setWarningMessage(undefined);
  };

  const onContinue = () => {
    if (warningMessage === 'IMPORT_CSV') {
      setWarningMessage(undefined);
      setActiveSegment('IMPORT_CSV');
    } else if (warningMessage === 'CSV_TO_MANUAL') {
      setWarningMessage(undefined);
      setActiveSegment('CREATE_MANUALLY');
      setRules(undefined);
    }
  };

  const handleClickCreateManually = () => {
    if (isEditing && isMatcherTypeSimpleKV && !activeSegment) {
      setWarningMessage('CSV_TO_MANUAL');
    } else {
      setActiveSegment('CREATE_MANUALLY');
    }
  };

  const handleClickImportCSV = () => {
    isEditing
      ? setWarningMessage('IMPORT_CSV')
      : setActiveSegment('IMPORT_CSV');
  };

  const renderWarning = () => (
    <Modal.Trigger
      title="Attention!"
      dismissLabel="Cancel"
      continueLabel="Continue"
      onContinue={onContinue}
      onDismiss={onDismissWarningMessage}
    >
      {getWarningText(warningMessage)}
    </Modal.Trigger>
  );

  return (
    <>
      {warningMessage && renderWarning()}
      <Styled.Layer>
        <Icon name="arrow-left" color="dark" onClick={() => onGoBack()} />
      </Styled.Layer>
      <Styled.Layer>
        <Text.h2 color="light">Create Segments</Text.h2>
        <Styled.HelpText color="dark">
          You can create a segment manually or importing a .CSV file to link
          multiple values to a key.
        </Styled.HelpText>
        <Styled.Actions>
          <Styled.ButtonIconRounded
            name="edit"
            color="dark"
            onClick={handleClickCreateManually}
            isActive={isSegmentManually}
          >
            Create manually
          </Styled.ButtonIconRounded>
          <Styled.ButtonIconRounded
            name="upload"
            color="dark"
            onClick={handleClickImportCSV}
            isActive={isSegmentImportCSV}
          >
            Import CSV
          </Styled.ButtonIconRounded>
        </Styled.Actions>
        <Styled.Content>
          {isSegmentImportCSV && (
            <ImportCSV
              id={id}
              name={circle?.name}
              onSaveCircle={onSaveCircle}
            />
          )}
          {isSegmentManually && (
            <Segments
              rules={rules}
              viewMode={false}
              onSubmit={saveCircleManually}
              isSaving={isSaving}
            />
          )}
        </Styled.Content>
      </Styled.Layer>
    </>
  );
};

export default CreateSegments;
