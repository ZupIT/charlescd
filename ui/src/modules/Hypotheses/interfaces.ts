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

import { Card, Column } from './Board/interfaces';

export interface Author {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  isRoot: boolean;
  createdAt: string;
}

export interface Hypothesis {
  id: string;
  authorId?: string;
  name: string;
  description: string;
  author: Author;
  labels: string[];
  card: Card[];
  problemId?: string;
}

export interface HypothesisPaginationItem {
  id: string;
  name: string;
  createdAt: string;
}

export interface HypothesisPagination {
  content: HypothesisPaginationItem[];
  page: number;
  size: number;
  totalPages: number;
  last: boolean;
}

export interface HypothesesState {
  columns: Column[];
  hypotheses: Hypothesis[];
}
