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
  const toList = data => data.map(({ value, timestamp }) => [timestamp, value]);

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const buildParams = params =>
    new URLSearchParams({
      circleId: `${params.circleId}`,
      metricType: `${params.metricType}`,
      projectionType: params.projectionType
    });

  const areAllComponentsEmpty = (components) => {
    return components?.every(item => !item.data || item.data.length === 0)
  };

  const convertComponentsToSeries = components => {
    if (areAllComponentsEmpty(components)) {
      return [];
    }

    return components?.map(({ name, data }) => ({ name, data: toList(data) }));
  };

  const buildChartSeries = (response, chartType) => {
    return chartType === "COMPARISON"
      ? convertComponentsToSeries(response.components)
      : [{ name: "", data: toList(response.data) }];
  };

  const getMetricResource = apiParams => {
    const { circleId, chartType } = apiParams;
    const resource =
      chartType === "COMPARISON" ? `circle/${circleId}/components` : "";

    return `${resource}?${buildParams(apiParams)}`;
  };

  const fetchUrl = (apiParams, headers, basePath) => {
    fetch(
      `${basePath}/moove/metrics/${getMetricResource(
        apiParams
      )}`,
      { headers }
    )
      .then(response => {
        if (!response.ok) {
          throw Error(response.status);
        }
        return response.json();
      })
      .then(response => {
        const data = buildChartSeries(response, apiParams.chartType);
        self.postMessage(data);
        setTimeout(
          () => fetchUrl(apiParams, headers, basePath),
          getRandomInt(5000, 15000)
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

    fetchUrl(apiParams, headers, basePath);
  });
};
