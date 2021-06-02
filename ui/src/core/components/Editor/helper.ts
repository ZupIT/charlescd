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

export const getLines = (content = "") => {
  const len = content.match(/\n/g)?.length || 0;
  return len + 1;
};

export const printJSONByString = (jsonStr: string) => {
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2);
  } catch (e) {
    console.error(e);
  }
}

type Key = "{" | "(" | "[" | "'"| '"';

export const shouldComplete = (key: string) => {
  const keys = {
    "{": "}",
    "(": ")",
    "[": "]",
    "'": "'",
    '"': '"'
  }
  
  return keys[key as Key] || "";
}