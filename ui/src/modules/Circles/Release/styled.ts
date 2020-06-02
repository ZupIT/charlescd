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
import Text from 'core/components/Text';
import FormComponent from 'core/components/Form';
import IconComponent from 'core/components/Icon';
import ComponentIcon from 'core/components/Icon';
import ButtonComponent from 'core/components/Button';
import { slideInRight } from 'core/assets/style/animate';
import LayerComponent from 'core/components/Layer';

const Icon = styled(ComponentIcon)`
  animation: ${slideInRight} 1s forwards;
`;

const Layer = styled(LayerComponent)`
  margin-left: 40px;
`;

const Subtitle = styled(Text.h5)`
  margin: 20px 0 10px;
`;

const Form = styled.form`
  margin-top: 40px;
`;

const Input = styled(FormComponent.Input)`
  width: 190px;
  margin: 10px 0 20px;
`;

const Trash = styled(IconComponent)`
  visibility: hidden;
`;

const WrapperTrash = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0 5px 5px 0;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  left: -40px;
  top: 0;

  :hover ${Trash} {
    visibility: visible;
  }
`;

const moduleWrapper = styled.div`
  position: relative;
  display: flex;
  width: 490px;
  margin-top: 20px;
  justify-content: space-between;

  :hover ${Trash} {
    visibility: visible;
  }
`;

const Select = styled(FormComponent.Select)``;

const SelectWrapper = styled.div`
  width: 150px;
`;

const SearchWrapper = styled.div`
  width: 180px;
  margin-bottom: 40px;
`;

const Error = styled(Text.h6)`
  margin-top: 5px;
`;

const Info = styled(Text.h5)`
  margin-top: 40px;
  margin-bottom: 10px;
`;

const AddModule = styled(ButtonComponent.Default)`
  display: flex;
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.button.default.outline.border};
  margin-bottom: 40px;
  padding: 0 20px;
  border-radius: 4px;
  align-items: center;
  color: ${({ theme }) => theme.button.default.outline.color};

  > i {
    margin-right: 5px;
  }
`;

const Submit = styled(ButtonComponent.Default)`
  width: 80px;
`;

export default {
  Layer,
  Icon,
  Subtitle,
  Form,
  Input,
  Select,
  SelectWrapper,
  SearchWrapper,
  Error,
  Submit,
  Module: {
    Trash: WrapperTrash,
    Icon: Trash,
    Wrapper: moduleWrapper,
    Button: AddModule,
    Info
  }
};
