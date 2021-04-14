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

import { rest } from 'msw';
import { basePath } from 'core/providers/base';
import { TOKEN, TOKENS_LIST, TOKEN_CREATE, TOKEN_REGENERATE } from './responses';

export default [
  rest.get(`${basePath}/gate/api/v1/system-token`, (req, res, ctx) => {
    return res(
      ctx.json(TOKENS_LIST)
    )
  }),
  rest.get(`${basePath}/gate/api/v1/system-token/:token`, (req, res, ctx) => {
    return res(
      ctx.json(TOKEN)
    )
  }),
  rest.post(`${basePath}/gate/api/v1/system-token/:token/revoke`, (req, res, ctx) => {
    return res(
      ctx.json({})
    )
  }),
  rest.put(`${basePath}/gate/api/v1/system-token/:token/regenerate`, (req, res, ctx) => {
    return res(
      ctx.json(TOKEN_REGENERATE)
    )
  }),
  rest.post(`${basePath}/gate/api/v1/system-token`, (req, res, ctx) => {
    return res(
      ctx.json(TOKEN_CREATE)
    )
  })
];
