import map from 'lodash/map';

type ContentItem<T> = {
  name: string;
  id: string;
} & T;

export const normalizeSelectOptions = <T>(content: ContentItem<T>[]) =>
  map(content, item => ({
    label: item.name,
    value: item.id
  }));
