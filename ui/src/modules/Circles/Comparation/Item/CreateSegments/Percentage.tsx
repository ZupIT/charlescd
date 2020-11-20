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
import { useForm } from 'react-hook-form';
import Text from 'core/components/Text';
import { useSaveCircleWithFile } from 'modules/Circles/hooks';
import Loader from './Loader';
import Styled from './styled';
import Icon from 'core/components/Icon';
import SliderPercentage from './Slider';

interface Props {
  id: string;
  name: string;
  onSaveCircle: Function;
}

const Percentage = ({ id, name, onSaveCircle }: Props) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid }
  } = useForm({ mode: 'onChange' });
  const [response, saveCircle, isSaving] = useSaveCircleWithFile(id);
  const [showCircleList, setShowCircleList] = useState<boolean>(false);
  const [rangeValue, setRangeValue] = useState<number>(0);

  const onSubmitValue = () => {
    const values = getValues();
    const { keyName } = values;
    const file = values.file[0] as File;

    saveCircle({ file, keyName, name });
  };

  useEffect(() => {
    if (response) {
      onSaveCircle(response);
    }
  }, [response, onSaveCircle]);

  return (
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
        <Text.h4 color="light">Available in the open sea</Text.h4>
        <Text.h4 color="light">10%</Text.h4>
      </Styled.AvailableContainer>
      <Styled.CirclesListContainer
        onClick={() => setShowCircleList(!showCircleList)}
      >
        <Styled.CirclesListButton>
          <Icon name={showCircleList ? 'up' : 'alternate-down'} size="18" />
          <Text.h4 color="dark">See consumption by active circles.</Text.h4>
        </Styled.CirclesListButton>
        {showCircleList && (
          <>
            <Styled.AvailableContainer>
              <Text.h4 color="light">teste</Text.h4>
              <Text.h4 color="light">10%</Text.h4>
            </Styled.AvailableContainer>
          </>
        )}
      </Styled.CirclesListContainer>
      {/* // alert */}
      <Styled.HelpText color="dark">
        Add the proportion of users by the percentage factor available for the
        open sea
      </Styled.HelpText>
      <Styled.HelpText color="dark">Circle {name}</Styled.HelpText>
      <SliderPercentage
        value={rangeValue}
        setValue={setRangeValue}
        limitValue={40}
      />
      {isSaving && <Loader />}
      <Styled.ButtonDefault
        type="submit"
        isLoading={isSaving}
        isDisabled={isSaving}
        isValid={isValid}
      >
        <Text.h6 color={isValid ? 'light' : 'dark'}>Save</Text.h6>
      </Styled.ButtonDefault>
    </form>
  );
};

export default Percentage;
