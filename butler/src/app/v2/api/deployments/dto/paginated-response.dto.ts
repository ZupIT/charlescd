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

export class PaginatedResponse<T> {

  public readonly last: boolean

  constructor(public readonly items: T[],
    public readonly size: number,
    public readonly page: number,
    totalPages: number) {

    this.last = this.isLast(totalPages)
  }

  private isLast(totalPages: number): boolean {
    return totalPages > 0 ? 
      this.page === (totalPages -1) :
      true
  }
}
