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

import { Author } from 'modules/Hypotheses/interfaces';
import { Module } from 'modules/Modules/interfaces/Module';
import { Deployment } from 'modules/Circles/interfaces/Circle';

export interface Column {
  id: string;
  name: string;
  builds?: Build[];
  cards?: Card[];
}

export type BuildStatus = 'BUILDING' | 'BUILT';

export interface Build {
  id: string;
  createdAt: string;
  features: Feature[];
  tag: string;
  status: BuildStatus;
  deployments: Deployment[];
}

export interface CardMovement {
  source: Column;
  destination: Column;
}

export interface NewRelease {
  authorId: string;
  features: string[];
  hypothesisId: string;
  tagName: string;
}

export type CardType = 'ACTION' | 'FEATURE';

export interface Feature {
  id: string;
  name: string;
  branchName: string;
  branches?: string[];
  author: Author;
  modules: Module[];
}

export interface Card {
  id: string;
  name: string;
  createdAt: string;
  labels: string[];
  modules?: string[];
  type: CardType;
  hypothesisId: string;
  feature: Feature;
  members?: Author[];
  comments?: Comment[];
  index: number;
  description?: string;
  column?: Column;
  author?: Author;
}

export interface Comment {
  id: string;
  comment: string;
  author: Author;
  createdAt: string;
}

export interface CreateCardParams {
  name: string;
  hypothesisId: string;
}
