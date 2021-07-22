import map from 'lodash/map';
import { Option } from 'core/components/Form/Select/interfaces';
import { Plugin } from './interfaces';

export const serializePlugins = (plugins: Plugin[]): Option[] =>
  map(plugins, (plugin: Plugin) => ({
    label: plugin.name,
    value: plugin.id,
    icon: 'prometheus'
  }));
