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

import React, { useState, useRef, Ref, useImperativeHandle } from 'react';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Styled from './styled';

export interface Props {
  id?: string;
  name?: string;
}

const InputFile = React.forwardRef(
  (
    { id = 'inputFileId', name = 'file' }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File>();
    useImperativeHandle(ref, () => inputRef.current);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    };

    const removeFile = () => {
      setFile(undefined);
      inputRef.current.value = '';
    };

    return (
      <Styled.Wrapper>
        <Styled.InputWrapper>
          <label htmlFor={`${id}-${name}`} title={file?.name}>
            <Text.h5 align="center" weight="bold" color="dark">
              {file ? `${file.name}` : 'Choose file'}
            </Text.h5>
            {!file && <Icon name="upload" color="dark" />}
          </label>
          <Styled.InputFile
            id={`${id}-${name}`}
            type="file"
            name={name}
            ref={inputRef}
            data-testid={`input-file-${id}-${name}`}
            onChange={handleChange}
          />
        </Styled.InputWrapper>
        {file && <Icon name="trash" color="dark" onClick={removeFile} />}
      </Styled.Wrapper>
    );
  }
);

export default InputFile;
