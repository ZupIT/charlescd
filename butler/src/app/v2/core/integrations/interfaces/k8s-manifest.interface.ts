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

interface Cookie {
  regex: string
}

interface RequestSet {
  'x-circle-source': string
}

interface ResponseSet {
  'x-circle-source': string
}

interface XCircleId {
  exact: string
}

interface Request {
  set: RequestSet
}

interface Response {
  set: ResponseSet
}

interface Headers {
  cookie?: Cookie
  'x-circle-id'?: XCircleId,
  'unreachable-cookie-name'?: XCircleId
}

interface RouteHeaders {
  request: Request
  response: Response
}

interface Match {
  headers: Headers
}

interface Destination {
  host: string
  subset?: string
}

interface Route {
  destination: Destination
  headers?: RouteHeaders
}

interface Labels {
  component: string
  tag: string
  circleId: string
}

interface Spec {
  host?: string
  subsets?: Subset[]
  hosts?: string[]
  http?: Http[]
  gateways?: string[]
}

interface ManifestMetadata {
  name: string
  namespace: string
}

export interface Http {
  match?: Match[]
  route: Route[]
}

export interface Subset {
  labels: Labels
  name: string
}

export interface K8sManifest {
  apiVersion: string
  kind: string
  metadata: ManifestMetadata
  spec: Spec
}