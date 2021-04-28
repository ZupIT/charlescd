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
import ComponentInput from 'core/components/Form/Input';
import TextComponent from 'core/components/Text';
import SelectComponent from 'core/components/Form/Select';
import Button from 'core/components/Button';
import { fadeIn } from 'core/assets/style/animate';
import Switch from 'core/components/Switch';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  animation: 0.3s ${fadeIn} linear;
  margin-top: 10px;
  margin-left: 40px;

  > :first-child {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    > :last-child {
      margin-left: 10px;
    }
  }
`;

const Form = styled.form`
  width: 269px;

  > :first-child {
    margin-bottom: 20px;
  }
`;

const Input = styled(ComponentInput)`
  margin-bottom: 20px;
`;

const Select = styled(SelectComponent.Single)`
  margin-top: 20px;
  width: 271px;
`;

const Field = styled.div`
  width: 500px;
  display: flex;
  flex-direction: row;
  align-items: center;

  > :first-child {
    width: 200px;
  }

  > * + * {
    margin-left: 10px;
  }
`;

const TestConnectionButton = styled(Button.Default)`
  margin-bottom: 30px;
  margin-top: 30px;
`;

const HealthSwitch = styled(Switch)`
  justify-content: start;

  i {
    width: 35px;
    height: 20px;

    ::after {
      width: 14px;
      height: 14px;
      left: ${({ active }) => (active ? '5px' : '1px')};
    }

    ::before {
      width: 31px;
      height: 16px;
    }
  }

  span {
    margin-left: 5px;
    margin-right: 15px;
  }
`;

const HealthWrapper = styled.div`
  margin-top: 20px;
  display: flex;
`;

const Placeholder = styled(TextComponent.h4)`
  pointer-events: none;
  margin-left: 47px;
  opacity: 60%;
  overflow: hidden;
  position: absolute;
  top: 21px
`;

const Wrapper = styled.div`
  position: relative;
`;

export default {
  Form,
  Content,
  Input,
  Field,
  Select,
  TestConnectionButton,
  HealthWrapper,
  HealthSwitch,
  Placeholder,
  Wrapper
};
