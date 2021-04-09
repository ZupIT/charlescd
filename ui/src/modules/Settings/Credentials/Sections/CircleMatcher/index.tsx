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
import Card from 'core/components/Card';
import Text from 'core/components/Text';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import Modal from 'core/components/Modal';
import { FORM_CIRCLE_MATCHER } from './constants';
import { useCircleMatcher } from './hooks';
import FormCircleMatcher from './Form';

interface Props {
  form: string;
  setForm: Function;
  data: string;
}

const CircleMatcher = ({ form, setForm, data }: Props) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isAction, setIsAction] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { remove, responseRemove } = useCircleMatcher();

  useEffect(() => {
    setIsAction(true);
    setShowConfirmation(false);
  }, [responseRemove]);

  useEffect(() => {
    if (data) setIsAction(false);
  }, [data]);

  const onRemove = () => {
    setIsLoading(true);
    remove();
  };

  const renderConfirmation = () => (
    <Modal.Trigger
      title="Remove Circle Matcher"
      dismissLabel="Cancel"
      continueLabel="Yes, remove"
      isLoading={isLoading}
      onContinue={() => onRemove()}
      onDismiss={() => setShowConfirmation(false)}
    >
      <Text.h4 color="light">
        This operation will remove all data from this workspace to the Circle Matcher.
      </Text.h4>
    </Modal.Trigger>
  );

  const renderSection = () => (
    <Section
      name="Circle Matcher"
      icon="circle-matcher"
      showAction={isAction}
      action={() => setForm(FORM_CIRCLE_MATCHER)}
      type="Required"
    >
      {data && !responseRemove && (
        <Card.Config
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
        <FormCircleMatcher onFinish={() => setForm(null)} />
      </Layer>
    );

  return (
    <Fragment>
      {showConfirmation && renderConfirmation()}
      {form ? renderForm() : renderSection()}
    </Fragment>
  )
};

export default CircleMatcher;
