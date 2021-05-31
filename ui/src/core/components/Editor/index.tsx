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
import { printJSONByString } from './helper';
import Styled from './styled';

const obj = '{"login":"leandroqo","email":"leandro.queiroz@zup.com.br"}';

const Editor = () => {
  const { content, count } = printJSONByString(obj);
  return (
    <Styled.Wrapper>
      <Styled.Numbers>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <li key={index}>{index}</li>
          ))}
      </Styled.Numbers>
      <Styled.Content>{content}</Styled.Content>
    </Styled.Wrapper>
  );
};

export default Editor;
