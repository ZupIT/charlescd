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

import React, { Dispatch, SetStateAction } from 'react';
import { Props as IconProps } from 'core/components/Icon';

jest.mock('core/components/Icon/useDynamicImport', () => {
  return {
    __esModule: true,
    default: (name: string) => [name]
  }
});

jest.mock('react-svg', () => {
  return {
    __esModule: true,
    ReactSVG: ({ onClick, ...rest }: IconProps) => {
      return (
        <div>
          <div>
            <svg {...rest} />
          </div>
        </div>
      );
    }
  };
});
