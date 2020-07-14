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

import { SelectComponentsConfig, OptionTypeBase } from 'react-select';

export type Option = {
  [key: string]: string;
};

export interface Props {
  placeholder?: string;
  options?: Option[];
  defaultValue?: Option | Option[];
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
  onChange?: (event: unknown) => void;
  onInputChange?: (value: string) => void;
  customOption?: React.ReactNode;
  customMultiValue?: React.ReactNode;
  closeMenuOnSelect?: boolean;
  hideSelectedOptions?: boolean;
  components?: SelectComponentsConfig<OptionTypeBase>;
  label?: string;
}
