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

import isEmpty from 'lodash/isEmpty';
import { KeyboardEvent } from 'react';

export const formatJSON = (jsonStr: string | object) => {
  try {
    const data = typeof jsonStr === 'string' && !isEmpty(jsonStr) ? JSON.parse(jsonStr) : jsonStr;
    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error(e);
    return "";
  }
}

type Key = "{" | "[" | "'"| '"';

export const shouldComplete = (key: string) => {
  const keys = {
    "{": "}",
    "[": "]",
    "'": "'",
    '"': '"'
  }
  
  return keys[key as Key] || "";
}

export const TAB = '  ';

export const insertValue = (e: KeyboardEvent, value: string, caretPosition = TAB.length) => {
  const target = e.target as HTMLTextAreaElement;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  const targetValue = target.value;

  target.value =
    targetValue.substring(0, start) +
    value +
    targetValue.substring(end);

  target.selectionEnd = end + caretPosition;
  target.selectionStart = end + caretPosition;
}

export const getLastTabs = (target: HTMLTextAreaElement) => {
  const value = target.value;
  const lastLine = value
    .substring(0, target.selectionEnd)
    ?.split('\n')
    ?.reverse();

  return lastLine[0].split('"')[0]?.replace(/\{|\[/g, "");
}

export const onPressTab = (e: KeyboardEvent) => {
  e.preventDefault();
  insertValue(e, TAB);
}

export const onPressEnter = (e: KeyboardEvent) => {
  e.preventDefault();
  const target = e.target as HTMLTextAreaElement;
  const start = target.selectionStart;
  const lastChar = target.textContent.substring(start - 1, start);

  if (['{', '['].includes(lastChar)) {
    const lastTabs = getLastTabs(target);
    const tabs = lastTabs + TAB;
    const insertion = `\n${tabs}`;
    const complete = isEmpty(lastTabs)
      ? `\n`
      : `${tabs}\n${lastTabs}`;
    const len = insertion.length;

    insertValue(e, `${insertion + complete}`, len);

  } else if (lastChar === ',') {
    const tabs = getLastTabs(target);
    const insertion = `\n${tabs}`;
    insertValue(e, `${insertion}`, insertion.length);
  } else {
    insertValue(e, '\n', 1);
  }
}

export const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    onPressTab(e);
  } else if (e.key === 'Enter') {
    onPressEnter(e);
  }
}