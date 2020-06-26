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

import React, { useEffect, memo, useCallback } from 'react';
import Styled from './styled';
import { Control } from 'react-hook-form';
import CustomOption from 'core/components/Form/Select/CustomOptions';
import useCircles, { CIRCLE_TYPES, CIRCLE_STATUS } from 'modules/Circles/hooks';
import { allOption } from 'core/components/Form/Select/MultiCheck/constants';
import { normalizeSelectOptions } from 'core/utils/select';

type Props = {
  control: Control<unknown>;
  setValue: Function;
};

const CircleFilter = ({ control, setValue }: Props) => {
  const [loading, filterCircles, , data] = useCircles(CIRCLE_TYPES.list);
  const circles = useCallback(() => {
    return normalizeSelectOptions(data?.content);
  }, [data]);

  useEffect(() => {
    if (data) {
      setValue('circles', [allOption, ...circles()]);
    }
  }, [data, circles, setValue]);

  useEffect(() => {
    filterCircles('', CIRCLE_STATUS.active);
  }, [filterCircles]);

  return (
    <Styled.MultiSelect
      control={control}
      name="circles"
      isLoading={loading}
      customOption={CustomOption.Check}
      options={circles()}
      label="Select Circles"
      defaultValue={[allOption]}
    />
  );
};

export default memo(CircleFilter);
