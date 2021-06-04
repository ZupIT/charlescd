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
import Highlight, { defaultProps } from 'prism-react-renderer';
import { useState } from 'react';
import { formatJSON, shouldComplete } from './helper';
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
  const [content, setContent] = useState(formatJSON(data));

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

  return (
    <Styled.Wrapper width={width} height={height}>
      <Highlight {...defaultProps} language="json" code={content}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Styled.Pre className={className} style={style}>
            {tokens.map((line, i) => (
              <Styled.Editor key={i} {...getLineProps({ line, key: i })}>
                <Styled.Number>{i + 1}</Styled.Number>
                <span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </span>
              </Styled.Editor>
            ))}
          </Styled.Pre>
        )}
      </Highlight>
      <Styled.TextArea onChange={onChangeEditor} value={content} />
    </Styled.Wrapper>
  );
};

export default Editor;
