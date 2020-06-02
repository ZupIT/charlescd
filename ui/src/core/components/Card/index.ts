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

import CardBase from 'core/components/Card/Base';
import CardConfig from 'core/components/Card/Config';
import CardCircle from 'core/components/Card/Circle';
import CardHeader from 'core/components/Card/Header';
import CardBody from 'core/components/Card/Body';
import CardExpand from 'core/components/Card/Expand';
import CardRelease from 'core/components/Card/Release';
import CardRole from 'core/components/Card/Role';
import CardBoard from 'core/components/Card/Board';

const Card = {
  Base: CardBase,
  Body: CardBody,
  Circle: CardCircle,
  Release: CardRelease,
  Header: CardHeader,
  Config: CardConfig,
  Expand: CardExpand,
  Role: CardRole,
  Board: CardBoard
};

export default Card;
