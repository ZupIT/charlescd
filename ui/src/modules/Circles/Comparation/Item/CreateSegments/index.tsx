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
import Styled from './styled';
import { getWarningText, WarningMessage } from './helpers';
import Percentage from './Percentage';

type SegmentType = 'CREATE_MANUALLY' | 'IMPORT_CSV' | 'PERCENTAGE';

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
  const isMatcherTypePercentage = circle?.matcherType === 'PERCENTAGE';
  const isMatcherTypeManually = circle?.matcherType === 'REGULAR';

  const [rules, setRules] = useState<Rules>(circle?.rules);
  const isSegmentManually = activeSegment === 'CREATE_MANUALLY';
  const isSegmentImportCSV = activeSegment === 'IMPORT_CSV';
  const isPercentage = activeSegment === 'PERCENTAGE';

  useEffect(() => {
    if (!isEditing) {
      return;
    } else if (isEditing && isMatcherTypeManually) {
      setActiveSegment('CREATE_MANUALLY');
    } else if (isEditing && isMatcherTypePercentage) {
      setActiveSegment('PERCENTAGE');
    } else {
      setActiveSegment('IMPORT_CSV');
    }
  }, [circle, isEditing, isMatcherTypeManually, isMatcherTypePercentage]);

  useEffect(() => {
    if (saveCircleResponse) {
      onSaveCircle(saveCircleResponse, false);
    }
  }, [saveCircleResponse, onSaveCircle]);

  const saveCircleManually = (rules: Rules) => {
    const { name } = circle;
    saveCircle({ ...circle, rules, name });
  };

  const onDismissWarningMessage = () => {
    setWarningMessage(undefined);
  };

  const onContinue = () => {
    if (
      warningMessage === 'CSV_TO_MANUAL' ||
      warningMessage === 'PERCENTAGE_TO_MANUAL'
    ) {
      setWarningMessage(undefined);
      setActiveSegment('CREATE_MANUALLY');
      setRules(undefined);
    } else if (
      warningMessage === 'MANUAL_TO_CSV' ||
      warningMessage === 'PERCENTAGE_TO_CSV'
    ) {
      setWarningMessage(undefined);
      setActiveSegment('IMPORT_CSV');
    } else {
      setWarningMessage(undefined);
      setActiveSegment('PERCENTAGE');
    }
  };

  const handleClickCreateManually = () => {
    if (isEditing && isMatcherTypeSimpleKV) {
      setWarningMessage('CSV_TO_MANUAL');
    } else if (isEditing && isMatcherTypePercentage) {
      setWarningMessage('PERCENTAGE_TO_MANUAL');
    } else {
      setActiveSegment('CREATE_MANUALLY');
    }
  };

  const handleClickImportCSV = () => {
    if (isEditing && isMatcherTypeManually) {
      setWarningMessage('MANUAL_TO_CSV');
    } else if (isEditing && isMatcherTypePercentage) {
      setWarningMessage('PERCENTAGE_TO_CSV');
    } else {
      setActiveSegment('IMPORT_CSV');
    }
  };

  const handleClickPercentage = () => {
    if (isEditing && isMatcherTypeManually) {
      setWarningMessage('MANUAL_TO_PERCENTAGE');
    } else if (isEditing && isMatcherTypeSimpleKV) {
      setWarningMessage('CSV_TO_PERCENTAGE');
    } else {
      setActiveSegment('PERCENTAGE');
    }
  };

  const renderWarning = () => (
    <Modal.Trigger
      title="Attention!"
      dismissLabel="Cancel"
      continueLabel="Continue"
      onContinue={onContinue}
      onDismiss={onDismissWarningMessage}
    >
      <Text.h4 color="light">{getWarningText(warningMessage)}</Text.h4>
    </Modal.Trigger>
  );
  return (
    <>
      {warningMessage && renderWarning()}
      <Styled.Layer>
        <Icon name="arrow-left" color="dark" onClick={() => onGoBack()} />
      </Styled.Layer>
      <Styled.Layer>
        <Text.h2 weight="bold" color="light">
          {isEditing ? 'Edit' : 'Create'} Segments
        </Text.h2>
        <Styled.HelpText color="dark">
          You can create a segment manually or importing a .CSV file to link
          multiple values to a key, or segment by percentage.
        </Styled.HelpText>
        <Styled.Actions>
          <Styled.ButtonIconRounded
            name="manually"
            icon="manually"
            color="dark"
            onClick={handleClickCreateManually}
            isActive={isSegmentManually}
          >
            Create manually
          </Styled.ButtonIconRounded>
          <Styled.ButtonIconRounded
            name="upload"
            icon="upload"
            color="dark"
            onClick={handleClickImportCSV}
            isActive={isSegmentImportCSV}
          >
            Import CSV
          </Styled.ButtonIconRounded>
          <Styled.ButtonIconRounded
            name="percentage"
            icon="percentage"
            color="dark"
            onClick={handleClickPercentage}
            isActive={isPercentage}
          >
            Percentage
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
          {isPercentage && (
            <Percentage
              id={id}
              circle={circle}
              onSaveCircle={onSaveCircle}
              isEditing={isEditing}
            />
          )}
        </Styled.Content>
      </Styled.Layer>
    </>
  );
};

export default CreateSegments;
