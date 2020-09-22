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

import React from 'react';
import AceEditorComponent from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-dracula';
import Styled from './styled';

export interface Props {
  onChange?: (value: string) => void;
  theme?: string;
  mode: string;
  value?: string;
  readOnly?: boolean;
  height?: string;
}

const AceEditor = ({
  onChange,
  value,
  theme = 'dracula',
  mode,
  readOnly = true,
  height = '150px'
}: Props) => {
  return (
    <Styled.Wrapper>
      <AceEditorComponent
        mode={mode}
        theme={theme}
        onChange={onChange}
        value={value}
        fontSize={12}
        showPrintMargin={false}
        setOptions={{ useWorker: false }}
        editorProps={{ $blockScrolling: true }}
        height={height}
        highlightActiveLine={false}
        readOnly={readOnly}
      />
    </Styled.Wrapper>
  );
};

export default AceEditor;
