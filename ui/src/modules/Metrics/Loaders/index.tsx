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

import React from 'react';
import { Loader as LoaderCircleCard } from './circlesCard';
import { Loader as LoaderCircleAverageTime } from './circleAverageTime';
import { Loader as LoaderLegend } from './legend';
import { Loader as LoaderHistory } from './history';
import { Loader as LoaderReleases } from './releases';

const Loader = {
  CircleCard: () => <LoaderCircleCard />,
  CircleAverageTime: () => <LoaderCircleAverageTime />,
  Legend: () => <LoaderLegend />,
  History: () => <LoaderHistory />,
  Releases: () => <LoaderReleases />
};

export default Loader;
