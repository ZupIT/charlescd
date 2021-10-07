// @ts-nocheck
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
import {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  Ref,
  UIEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import isEmpty from 'lodash/isEmpty';
import { formatJSON, handleKeyDown, shouldComplete } from './helper';
import Styled from './styled';

export interface Props {
  mode?: 'view' | 'edit';
  name?: string;
  data?: string | object;
  width?: string;
  height?: string;
}

const Editor = forwardRef(
  (
    { mode = 'edit', data, width = '100%', height = '100%', name }: Props,
    ref: Ref<HTMLTextAreaElement>
  ) => {
    const [content, setContent] = useState('');
    const editorRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
      if (!isEmpty(data)) {
        setContent(formatJSON(data));
      }
    }, [data]);

    const onChangeEditor = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { selectionStart, selectionEnd, value } = event.target;
      const { data } = event.nativeEvent as Event & { data: string };

      event.target.value =
        value.substring(0, selectionStart) +
        shouldComplete(data) +
        value.substring(selectionEnd, value.length);

      setContent(event.target.value);

      event.target.selectionStart = selectionStart;
      event.target.selectionEnd = selectionStart;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e);
      const { value } = e.target as HTMLTextAreaElement;
      setContent(value);
    };

    const onScrollTextarea = (event: UIEvent<HTMLTextAreaElement>) => {
      editorRef.current.scrollTop = event.currentTarget.scrollTop;
    };

    return (
      <Styled.Wrapper data-testid="editor" width={width} height={height}>
        <Highlight {...defaultProps} language="json" code={content}>
          {({ className, tokens, getLineProps, getTokenProps }) => (
            <Styled.Pre ref={editorRef} className={className}>
              {tokens.map((line, i) => (
                <Styled.Line
                  data-testid={`line-${i}`}
                  key={i}
                  {...getLineProps({ line, key: i })}
                >
                  <Styled.Number>{i + 1}</Styled.Number>
                  <span data-testid={`line-text-${i}`}>
                    {line.map((token, key) => {
                      const { className, children } = getTokenProps({
                        token,
                        key,
                      });
                      return (
                        <span key={key} className={className}>
                          {children}
                        </span>
                      );
                    })}
                  </span>
                </Styled.Line>
              ))}
            </Styled.Pre>
          )}
        </Highlight>
        <Styled.TextArea
          ref={ref}
          data-testid={`input-text-${name}`}
          name={name}
          spellCheck={false}
          onScroll={onScrollTextarea}
          readOnly={mode === 'view'}
          onKeyDown={onKeyDown}
          onChange={onChangeEditor}
          value={content}
        />
      </Styled.Wrapper>
    );
  }
);

export default Editor;
