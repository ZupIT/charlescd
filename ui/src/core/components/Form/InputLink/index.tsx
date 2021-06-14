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

import Styled from './styled';

export interface Props {
  name: string;
  href: string;
  className?: string;
}

const InputLink = ({ name, href, className }: Props) => {
  return (
    <Styled.Wrapper className={className} data-testid={`input-link-${name}`}>
      <Styled.Input name={name} disabled defaultValue={href} />
      <Styled.Link href={href} target="_blank">
        <Styled.Icon name="external-link" color="dark" size="15px" />
      </Styled.Link>
    </Styled.Wrapper>
  );
};

export default InputLink;
