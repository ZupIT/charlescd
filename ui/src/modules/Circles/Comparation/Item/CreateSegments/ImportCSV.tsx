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

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Text from 'core/components/Text';
import { ReactComponent as ExampleSVG } from 'core/assets/svg/example-csv.svg';
import InputFile from 'core/components/Form/InputFile';
import { useSaveCircleWithFile } from 'modules/Circles/hooks';
import Loader from './Loader';
import Styled from './styled';

interface Props {
  id: string;
  name: string;
  onSaveCircle: Function;
}

const ImportCSV = ({ id, name, onSaveCircle }: Props) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid }
  } = useForm({ mode: 'onChange' });
  const [response, saveCircle, isSaving] = useSaveCircleWithFile(id);

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
      <Styled.HelpText color="dark">
        To import a file, your table must have only one column and be formatted
        according to the example below:
      </Styled.HelpText>
      <ExampleSVG />
      <Styled.HelpText color="dark">
        Type the name in cell A1 of your file (this will be your key):
      </Styled.HelpText>
      <Styled.Input
        label="Type a key"
        ref={register({ required: true })}
        name="keyName"
      />
      <Styled.InputWrapper>
        <Styled.HelpText color="dark">
          Select the .CSV to upload:
        </Styled.HelpText>
        <InputFile ref={register({ required: true })} />
      </Styled.InputWrapper>
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

export default ImportCSV;
