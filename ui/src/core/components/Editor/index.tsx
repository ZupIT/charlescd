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
import { useState } from 'react';
import { getLines, printJSONByString, shouldComplete } from './helper';
import Styled from './styled';

const obj = '{"login":"leandroqo","email":"leandro.queiroz@zup.com.br"}';

export interface EditorProps {
  mode?: 'view' | 'edit';
}

const Editor = ({ mode = 'view' }: EditorProps) => {
  const [content, setContent] = useState('');

  const renderNumbers = (json: string) => (
    <Styled.Numbers>
      {Array(getLines(json))
        .fill(0)
        .map((_, index) => (
          <li key={index}>{index}</li>
        ))}
    </Styled.Numbers>
  );

  const renderView = () => {
    const json = printJSONByString(obj);

    return (
      <>
        {renderNumbers(json)}
        <Styled.Content>{json}</Styled.Content>
      </>
    );
  };

  const onChangeEditor = (event: any) => {
    const { selectionStart, selectionEnd, value } = event.target;
    const { data } = event.nativeEvent;

    event.target.value =
      value.substring(0, selectionStart) +
      shouldComplete(data) +
      value.substring(selectionEnd, value.length);

    setContent(event.target.value);

    event.target.selectionStart = selectionStart;
    event.target.selectionEnd = selectionStart;
  };

  const renderEditor = () => (
    <>
      {renderNumbers(content)}
      <Styled.Editor onChange={onChangeEditor}></Styled.Editor>
    </>
  );

  return (
    <Styled.Wrapper>
      {mode === 'view' ? renderView() : renderEditor()}
    </Styled.Wrapper>
  );
};

export default Editor;
