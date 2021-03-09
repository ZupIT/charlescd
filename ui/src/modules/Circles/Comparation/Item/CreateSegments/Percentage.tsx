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

import React, { Fragment, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Text from 'core/components/Text';
import get from 'lodash/get';
import {
  CIRCLE_STATUS,
  useCirclePercentage,
  useSaveCirclePercentage
} from 'modules/Circles/hooks';
import { getProfileByKey } from 'core/utils/profile';
import { Circle } from 'modules/Circles/interfaces/Circle';
import CirclePercentageList from '../Percentage/CirclePercentageList';
import AvailablePercentage from '../Percentage/AvailablePercentage';
import { CHARLES_DOC } from 'core/components/Popover';
import Loader from './Loader';
import SliderPercentage from './Slider';
import { editingPercentageLimit } from './helpers';
import Styled from './styled';

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
  const [responseSaveCircle, saveCircle, isSaving] = useSaveCirclePercentage(
    id
  );
  const [responseGetCircles, getFilteredCircles] = useCirclePercentage();
  const [limitPercentage, setLimitPercentage] = useState<number>(null);

  const onSubmitValue = () => {
    const authorId = getProfileByKey('id');
    const rangeValue = getValues('slider');
    saveCircle({ authorId, percentage: Number(rangeValue), name });
  };

  useEffect(() => {
    const sumPercentage = get(
      responseGetCircles,
      'content[0].sumPercentage',
      0
    );
    if (sumPercentage > 0) {
      // Calculate the available percentage based in active circles (all active percentage added is sumPercentage)
      return setLimitPercentage(100 - sumPercentage);
    }
    // if sumPercentage is zero, the total available will be 100%.
    return setLimitPercentage(100);
  }, [responseGetCircles]);

  useEffect(() => {
    getFilteredCircles('', CIRCLE_STATUS.active);
  }, [getFilteredCircles]);

  useEffect(() => {
    if (responseSaveCircle) {
      onSaveCircle(responseSaveCircle);
    }
  }, [responseSaveCircle, onSaveCircle]);

  const isUnable = !isEditing && limitPercentage === 0;

  const renderWarningNoPercentageAvailable = () => (
    <Text.h5 color="error">
      The sum of active segmentations has reached 100%, there is no available
      space for a new segmentation. Please adjust the others segmentations per
      percentage to make it possible to segment this circle
    </Text.h5>
  );

  const renderSlider = () => {
    const limit = isEditing
      ? editingPercentageLimit(limitPercentage, deployment, percentage)
      : limitPercentage;

    return (
      <Fragment>
        <Styled.HelpText color="dark">
          Add the proportion of users by the percentage factor available for the
          open sea
        </Styled.HelpText>
        <Styled.HelpText color="dark">Circle {name}</Styled.HelpText>
        <SliderPercentage limitValue={limit} isDisabled={isSaving} />
        {isSaving && <Loader />}
        <Styled.ButtonDefault
          id="percentage"
          type="submit"
          isLoading={isSaving}
          isDisabled={isSaving}
          isValid={isValid}
        >
          <Text.h6 color={isValid ? 'light' : 'dark'}>Save</Text.h6>
        </Styled.ButtonDefault>
      </Fragment>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitValue)}>
        <Styled.FieldPopover>
          <Text.h5 color="dark">Quantity available for consumption.</Text.h5>
          <Styled.Popover
            title=""
            icon="info"
            size="18px"
            link={`${CHARLES_DOC}/reference/circle-matcher`}
            description="The available quantity will be applied only after activating the circle"
          />
        </Styled.FieldPopover>
        <AvailablePercentage
          responseGetCircles={responseGetCircles}
          circle={circle}
        />
        <CirclePercentageList responseGetCircles={responseGetCircles} />
        {isUnable ? renderWarningNoPercentageAvailable() : renderSlider()}
      </form>
    </FormProvider>
  );
};

export default Percentage;
