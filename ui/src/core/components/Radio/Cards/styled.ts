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

import styled from 'styled-components';
import ComponentText from 'core/components/Text';

interface LabelProps {
  icon?: string;
  value: string;
}

const RadioCards = styled.div`
  display: flex;
  flex-direction: column;
  width: 311px;
`;

const Radio = styled.div`
  :not(:first-child) {
    margin-top: 8px;
  }
`;

const Title = styled(ComponentText.h4)``;

const Description = styled(ComponentText.h5)``;

const Label = styled.label<LabelProps>`
  padding: ${({ icon }) =>
    icon ? '12px 30px 12px 30px' : '15px 33px 15px 33px'};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  border: 1px ${({ theme }) => theme.radio.card.unchecked.border} solid;
  background-color: ${({ theme }) => theme.radio.card.unchecked.background};
  cursor: pointer;

  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  pointer-events: none;

  :checked + ${Label} {
    background-color: ${({ theme }) => theme.radio.card.checked.background};
    border: 1px ${({ theme }) => theme.radio.card.checked.border} solid;
    transition: box-shadow 0.2s linear;

    :hover {
      box-shadow: 0px 0px 0px 2px
        ${({ theme }) => theme.radio.card.checked.border};
      /* transform: scale(1.1); */
    }

    ${Title}, ${Description} {
      color: ${({ theme }) => theme.radio.card.checked.color};
    }
  }

  :not(:checked) + ${Label} {
    background-color: ${({ theme }) => theme.radio.card.unchecked.background};
    transition: box-shadow 0.2s linear;

    :hover {
      box-shadow: 0px 0px 0px 2px
        ${({ theme }) => theme.radio.card.checked.border};
      /* transform: scale(1.1); */
    }

    ${Title}, ${Description} {
      color: ${({ theme }) => theme.radio.card.unchecked.color};
    }
  }
`;

export default {
  Input,
  Label,
  Title,
  Description,
  Radio,
  RadioCards
};
