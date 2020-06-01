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

/* eslint-disable */
export default () => {
  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const fetchUrl = (circleId, headers, basePath) => {
    fetch(
      `${basePath}/moove/metrics/circle/${circleId}/components/health`,
      { headers }
    )
      .then(response => {
        if (!response.ok) {
          throw Error(response.status);
        }
        return response.json();
      })
      .then(response => {
        self.postMessage(response);
        setTimeout(
          () => fetchUrl(circleId, headers, basePath),
          getRandomInt(3000, 6000)
        );
      })
      .catch(error => {
        if (error.message === 401 ) {
          self.postMessage({ unauthorized: true});
        }
        console.log(error);
      });
  };

  self.addEventListener("message", event => {
    if (!event) return;
    const { apiParams, headers, basePath } = event.data;

    fetchUrl(apiParams.id, headers, basePath);
  });
};
