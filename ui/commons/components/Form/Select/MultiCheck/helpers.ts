import { ActionMeta, OptionTypeBase } from 'react-select';
import { allOption } from './constants';
import { Option } from '../interfaces';

export const handleChange = (
  selected: Option[],
  event: ActionMeta<OptionTypeBase>,
  onChange: (event: Option[]) => void,
  options: Option[]
) => {
  if (selected !== null && selected.length > 0) {
    if (selected[selected.length - 1].value === allOption.value) {
      return onChange([allOption, ...options]);
    }
    let result: Option[] = [];
    if (selected.length === options.length) {
      if (selected.includes(allOption)) {
        result = selected.filter(option => option.value !== allOption.value);
      } else if (event.action === 'select-option') {
        result = [allOption, ...options];
      }
      return onChange(result);
    }
  }

  return onChange(selected);
};
