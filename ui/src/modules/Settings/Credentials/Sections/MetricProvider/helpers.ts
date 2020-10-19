import { map } from 'lodash'
import { Option } from 'core/components/Form/Select/interfaces';
import { Plugin } from './interfaces'

export const serializePlugins = (plugins: Plugin[]): Option[] => map(plugins, (plugin: Plugin) => ({
  label: plugin.name,
  value: plugin.id,
  icon: 'prometheus'
}))

export const transformValues = (values: any) => {
  let data: any = {}
  for (let key in values) {
    if (key.indexOf('data') !== -1) {
      const nestedKey = key.split('.')[1]
      data[nestedKey] = values[key]
    }
  }

  return data
}
