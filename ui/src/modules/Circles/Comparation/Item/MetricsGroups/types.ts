export type DataSource = {
  id: string;
  createdAt: string;
  name: string;
  pluginId: string;
  health: boolean;
  data: DataSourceData;
};

export type DataSourceData = {
  url: string;
};
