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

import { dark as darkRelease } from './release';
import { dark as darkConfig } from './config';
import { dark as darkExpand } from './expand';
import { dark as darkBoard } from './board';
import { dark as darkMessage } from './message';
import { dark as darkMain } from './main';

const light = {};

const dark = {
  release: darkRelease,
  config: darkConfig,
  expand: darkExpand,
  board: darkBoard,
  message: darkMessage,
  main: darkMain
};

export { dark, light };
