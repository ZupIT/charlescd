// @ts-nocheck
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

import { Fragment, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import CardConfig from 'core/components/Card/Config';
import Text from 'core/components/Text';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import ModalTrigger from 'core/components/Modal/Trigger';
import { FORM_CIRCLE_MATCHER } from './constants';
import { useDeleteCircleMatcher } from './hooks';
import FormCircleMatcher from './Form';

interface Props {
  form: string;
  setForm: Function;
  data: string;
  onChange: () => void;
}

const CircleMatcher = ({ form, setForm, onChange, data }: Props) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isAction, setIsAction] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { deleteCircleMatcher } = useDeleteCircleMatcher();

  useEffect(() => {
    if (data) setIsAction(false);
  }, [data]);

  const onRemove = async () => {
    setIsLoading(true);

    try {
      setIsAction(true);
      setShowConfirmation(false);
      await deleteCircleMatcher();
      onChange();
      setIsLoading(false);
    } catch (e) {}
  };

  const renderConfirmation = () => (
    <ModalTrigger
      title="Remove Circle Matcher"
      dismissLabel="Cancel"
      continueLabel="Yes, remove"
      isLoading={isLoading}
      onContinue={() => onRemove()}
      onDismiss={() => setShowConfirmation(false)}
    >
      <Text tag="H4" color="light">
        This operation will remove all data from this workspace to the Circle
        Matcher.
      </Text>
    </ModalTrigger>
  );

  const renderSection = () => (
    <Section
      name="Circle Matcher"
      icon="circle-matcher"
      showAction={isAction}
      action={() => setForm(FORM_CIRCLE_MATCHER)}
      type="Required"
    >
      {data && (
        <CardConfig
          icon="circle-matcher"
          description={data}
          onClose={() => setShowConfirmation(true)}
        />
      )}
    </Section>
  );

  const renderForm = () =>
    isEqual(form, FORM_CIRCLE_MATCHER) && (
      <Layer action={() => setForm(null)}>
        <FormCircleMatcher
          onFinish={() => {
            setForm(null);
            onChange();
          }}
        />
      </Layer>
    );

  return (
    <Fragment>
      {showConfirmation && renderConfirmation()}
      {form ? renderForm() : renderSection()}
    </Fragment>
  );
};

export default CircleMatcher;
