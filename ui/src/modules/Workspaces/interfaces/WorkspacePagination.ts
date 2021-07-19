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

import { Workspace } from './Workspace';

interface Users {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface WorkspacePaginationItem {
  id: string;
  name: string;
  author?: {
    email?: string;
  };
  users?: Users;
  status?: string;
}

export interface WorkspacePagination {
  content: Workspace[];
  page: number;
  size: number;
  totalPages: number;
  last: boolean;
}
