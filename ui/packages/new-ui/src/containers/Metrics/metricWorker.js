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

  const convertComponentsToSeries = components => {
    return components.map(({ name, data }) => ({ name, data: toList(data) }));
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

  const fetchUrl = (apiParams, headers) => {
    fetch(
      `https://darwin-api.continuousplatform.com/moove/metrics/${getMetricResource(
        apiParams
      )}`,
      { headers }
    )
      .then(response => {
        return response.json();
      })
      .then(response => {
        const data = buildChartSeries(response, apiParams.chartType);
        self.postMessage(data);
        setTimeout(
          () => fetchUrl(apiParams, headers),
          getRandomInt(5000, 15000)
        );
      })
      .catch(err => {
        console.error(err);
      });
  };

  self.addEventListener("message", event => {
    if (!event) return;
    const { apiParams, headers } = event.data;

    fetchUrl(apiParams, headers);
  });
};
