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

import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Text from 'core/components/Text';
import {
  CIRCLE_STATUS,
  useCirclePercentage,
  useSaveCirclePercentage
} from 'modules/Circles/hooks';
import Loader from './Loader';
import Styled from './styled';
import Icon from 'core/components/Icon';
import SliderPercentage from './Slider';
import { getProfileByKey } from 'core/utils/profile';
import { Circle } from 'modules/Circles/interfaces/Circle';
import Modal from 'core/components/Modal';

interface Props {
  id: string;
  circle: Circle;
  onSaveCircle: Function;
  isEditing: boolean;
}

interface SliderForm {
  slider: string;
}

const Percentage = ({ id, circle, onSaveCircle, isEditing }: Props) => {
  const { name, percentage, deployment } = circle;
  const methods = useForm<SliderForm>({ mode: 'onChange' });
  const {
    handleSubmit,
    getValues,
    formState: { isValid }
  } = methods;
  const [response, saveCircle, isSaving] = useSaveCirclePercentage(id);
  const [responseGetCircles, getFilteredCircles] = useCirclePercentage();
  const [showCircleList, setShowCircleList] = useState<boolean>(false);
  const [limitPercentage, setLimitPercentage] = useState<number>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const onSubmitValue = () => {
    const authorId = getProfileByKey('id');
    const rangeValue = getValues('slider');
    saveCircle({ authorId, percentage: Number(rangeValue), name });
  };

  useEffect(() => {
    if (responseGetCircles?.content[0]?.sumPercentage) {
      setLimitPercentage(100 - responseGetCircles.content[0].sumPercentage);
    } else {
      setLimitPercentage(100);
    }
  }, [responseGetCircles]);

  useEffect(() => {
    getFilteredCircles('', CIRCLE_STATUS.active);
  }, [getFilteredCircles]);

  useEffect(() => {
    if (response && isEditing) {
      onSaveCircle(response, false);
    } else if (response) {
      setShowModal(true);
    }
  }, [response, onSaveCircle]);

  const editingPercentageLimit = () => {
    if (limitPercentage > 0 && deployment) {
      return limitPercentage + percentage;
    }
    if (limitPercentage > 0 && !deployment) {
      return limitPercentage;
    }
    return percentage;
  };

  const onContinue = () => {
    onSaveCircle(response, true);
  };

  const onDismissWarningMessage = () => {
    onSaveCircle(response, false);
  };

  const renderWarning = () => (
    <Modal.Trigger
      title="Your request has been registered!"
      dismissLabel="No, active later"
      continueLabel="Yes, active now"
      onContinue={onContinue}
      onDismiss={onDismissWarningMessage}
    >
      It is importante to remember that this setting will be applied after
      activating the circle after the first deployment.
      <br />
      Do you want to active now?
    </Modal.Trigger>
  );

  const renderNewCircle = () => {
    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitValue)}>
          {showModal && renderWarning()}
          <Styled.FieldPopover>
            <Text.h5 color="dark">Quantity available for consumption.</Text.h5>
            <Styled.Popover
              title=""
              icon="info"
              size="18px"
              description="The available quantity will be applied only after activating the circle"
            />
          </Styled.FieldPopover>
          <Styled.AvailableContainer>
            <Styled.AvailableItem>
              <Text.h4 color="light">Available in the open sea</Text.h4>
              <Text.h4 color="light">{limitPercentage}%</Text.h4>
            </Styled.AvailableItem>
          </Styled.AvailableContainer>
          <Styled.CirclesListContainer
            onClick={() => setShowCircleList(!showCircleList)}
          >
            <Styled.CirclesListButton>
              <Icon name={showCircleList ? 'up' : 'alternate-down'} size="18" />
              <Text.h4 color="dark">See consumption by active circles.</Text.h4>
            </Styled.CirclesListButton>
            {showCircleList && (
              <Styled.AvailableContainer>
                {responseGetCircles?.content[0]?.circles.map(circle => (
                  <Styled.AvailableItem key={circle.id}>
                    <Text.h4 color="light">{circle.name}</Text.h4>
                    <Text.h4 color="light">{circle.percentage}%</Text.h4>
                  </Styled.AvailableItem>
                ))}
              </Styled.AvailableContainer>
            )}
          </Styled.CirclesListContainer>
          {/* // alert */}

          {limitPercentage === 0 ? (
            <Text.h5 color="error">
              The sum of active segmentations has reached 100%, there is no
              available space for a new segmentation. Please adjust the others
              segmentations per percentage to make it possible to segment this
              circle
            </Text.h5>
          ) : (
            <>
              <Styled.HelpText color="dark">
                Add the proportion of users by the percentage factor available
                for the open sea
              </Styled.HelpText>
              <Styled.HelpText color="dark">Circle {name}</Styled.HelpText>
              <SliderPercentage limitValue={limitPercentage} />
              {isSaving && <Loader />}
              <Styled.ButtonDefault
                type="submit"
                isLoading={isSaving}
                isDisabled={isSaving}
                isValid={isValid}
              >
                <Text.h6 color={isValid ? 'light' : 'dark'}>Save</Text.h6>
              </Styled.ButtonDefault>
            </>
          )}
        </form>
      </FormProvider>
    );
  };

  const renderEditingCircle = () => {
    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitValue)}>
          <Styled.FieldPopover>
            <Text.h5 color="dark">Quantity available for consumption.</Text.h5>
            <Styled.Popover
              title=""
              icon="info"
              size="18px"
              description="The available quantity will be applied only after activating the circle"
            />
          </Styled.FieldPopover>
          <Styled.AvailableContainer>
            <Styled.AvailableItem>
              <Text.h4 color="light">Available in the open sea</Text.h4>
              <Text.h4 color="light">{limitPercentage}%</Text.h4>
            </Styled.AvailableItem>
            <Styled.AvailableItem>
              <Text.h4 color="light">Percent configured.</Text.h4>
              <Text.h4 color="light">
                {circle.percentage ? circle.percentage : 0}%
              </Text.h4>
            </Styled.AvailableItem>
          </Styled.AvailableContainer>
          <Styled.CirclesListContainer
            onClick={() => setShowCircleList(!showCircleList)}
          >
            <Styled.CirclesListButton>
              <Icon name={showCircleList ? 'up' : 'alternate-down'} size="18" />
              <Text.h4 color="dark">See consumption by active circles.</Text.h4>
            </Styled.CirclesListButton>
            {showCircleList && (
              <Styled.AvailableContainer>
                {responseGetCircles?.content[0]?.circles.map(circle => (
                  <Styled.AvailableItem key={circle.id}>
                    <Text.h4 color="light">{circle.name}</Text.h4>
                    <Text.h4 color="light">{circle.percentage}%</Text.h4>
                  </Styled.AvailableItem>
                ))}
              </Styled.AvailableContainer>
            )}
          </Styled.CirclesListContainer>
          <>
            <Styled.HelpText color="dark">
              Add the proportion of users by the percentage factor available for
              the open sea
            </Styled.HelpText>
            <Styled.HelpText color="dark">Circle {name}</Styled.HelpText>
            <SliderPercentage limitValue={editingPercentageLimit()} />
            {isSaving && <Loader />}
            <Styled.ButtonDefault
              type="submit"
              isLoading={isSaving}
              isDisabled={isSaving}
              isValid={isValid}
            >
              <Text.h6 color={isValid ? 'light' : 'dark'}>Save</Text.h6>
            </Styled.ButtonDefault>
          </>
        </form>
      </FormProvider>
    );
  };

  return isEditing ? renderEditingCircle() : renderNewCircle();
};

export default Percentage;
