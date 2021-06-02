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
import { useRef, useState } from 'react';
import { getLines, formatJSON, shouldComplete } from './helper';
import Styled from './styled';

export interface Props {
  mode?: 'view' | 'edit';
  data?: string | object;
  width?: string;
  height?: string;
}

const Editor = ({
  mode = 'edit',
  data = '',
  width = '100%',
  height = '100%',
}: Props) => {
  const numberRef = useRef<HTMLUListElement>(null);
  const [content, setContent] = useState(formatJSON(data));

  const renderNumbers = (json: string) => (
    <Styled.Numbers ref={numberRef}>
      {Array(getLines(json))
        .fill(1)
        .map((_, index) => (
          <li key={index}>{index + 1}</li>
        ))}
    </Styled.Numbers>
  );

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

  const onScrollEditor = (event: any) => {
    numberRef.current?.scrollTo(0, event.target.scrollTop);
  };

  return (
    <Styled.Wrapper width={width} height={height}>
      {renderNumbers(content)}
      <Styled.Editor
        disabled={mode === 'view'}
        onChange={onChangeEditor}
        onScroll={onScrollEditor}
        value={content}
      ></Styled.Editor>
    </Styled.Wrapper>
  );
};

export default Editor;
