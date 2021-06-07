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

export const formatJSON = (jsonStr: string | object) => {
  try {
    const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
    return JSON.stringify(data, null, 2);
  } catch (e) {
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

const TAB = '  ';

export const insertValue = (e: any, value: string, caretPosition = TAB.length) => {
  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;
  const targetValue = e.target.value;

  e.target.value =
    targetValue.substring(0, start) +
    value +
    targetValue.substring(end);

  e.target.selectionEnd = end + caretPosition;
  e.target.selectionStart = end + caretPosition;
}

export const getLastTabs = (e: any) => {
  const value = e.target.value;
  const lastLine = value
    .substring(0, e.target.selectionEnd)
    ?.split('\n')
    ?.reverse();

  return lastLine[0].split('"')[0]?.replace(/\{|\[/g, "");
}

export const onPressTab = (e: any) => {
  e.preventDefault();
  insertValue(e, TAB);
}

export const onPressEnter = (e: any) => {
  e.preventDefault();
  const start = e.target.selectionStart;
  const lastChar = e.target.textContent.substring(start - 1, start);

  if (['{', '['].includes(lastChar)) {
    const lastTabs = getLastTabs(e);
    const tabs = lastTabs + TAB;
    const insertion = `\n${tabs}`;
    const complete = isEmpty(lastTabs)
      ? `\n`
      : `${tabs + tabs}\n${tabs + TAB}`;
    const len = isEmpty(lastTabs) 
      ? insertion.length
      : insertion.length + (TAB.length * 2);

    insertValue(e, `${insertion + complete}`, len);

  } else if (lastChar === ',') {
    const tabs = getLastTabs(e);
    const insertion = `\n${tabs}`;
    insertValue(e, `${insertion}`, insertion.length);
  } else {
    insertValue(e, '\n', 1);
  }
}

export const handleKeyDown = (e: any) => {
  if (e.key === 'Tab') {
    onPressTab(e);
  } else if (e.key === 'Enter') {
    onPressEnter(e);
  }
}