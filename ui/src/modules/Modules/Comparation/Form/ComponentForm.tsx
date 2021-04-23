import { useState } from 'react';
import Styled from './styled';
import { useFormContext, ArrayField } from 'react-hook-form';
import { Component } from 'modules/Modules/interfaces/Component';
import { isRequiredAndNotBlank } from 'core/utils/validations';
import filter from 'lodash/filter';

interface Props {
  remove: (index?: number | number[] | undefined) => void;
  field: Component;
  fields: Partial<ArrayField>;
  index: number;
}

const ComponentForm = ({ field, fields, index, remove }: Props) => {
  const { register, unregister, getValues, errors } = useFormContext();
  const [editMoreOptions, setEditMoreOptions] = useState(false);
  const one = 1;

  const handleMoreOptions = (index: number) => {
    if (editMoreOptions) {
      unregister(`components[${index}].hostValue`);
      unregister(`components[${index}].gatewayName`);
      return setEditMoreOptions(!editMoreOptions);
    }
    setEditMoreOptions(!editMoreOptions);
    register(`components[${index}].hostValue`, isRequiredAndNotBlank);
    register(`components[${index}].gatewayName`, isRequiredAndNotBlank);
  };

  const duplicatedComponent = (value: string) => {
    const { components } = getValues();
    const found = filter(components, ({ name }) => name === value);
    return found.length === 1 ? true : 'duplicate component';
  }


  return (
    <Styled.Components.ColumnWrapper key={field.id} data-testid={`components[${index}]`}>
      <Styled.Components.Wrapper>
        {fields.length > one && (
          <Styled.Components.Trash
            name="trash"
            size="15px"
            color="light"
            onClick={() => remove(index)}
          />
        )}
        <Styled.Components.Input
          label="Enter name"
          name={`components[${index}].name`}
          error={errors?.components?.[index]?.name.message}
          ref={register({
            ...isRequiredAndNotBlank,
            validate: {
              ...isRequiredAndNotBlank.validate,
              duplicatedComponent
            }
          })}
          defaultValue={field.name}
        />
        <Styled.Components.Number
          name={`components[${index}].latencyThreshold`}
          label="Latency Threshold (ms)"
          ref={register(isRequiredAndNotBlank)}
          defaultValue={field.latencyThreshold}
        />
        <Styled.Components.Number
          name={`components[${index}].errorThreshold`}
          label="Http Error Threshold (%)"
          ref={register(isRequiredAndNotBlank)}
          defaultValue={field.errorThreshold}
        />
      </Styled.Components.Wrapper>
      <Styled.Subtitle onClick={() => handleMoreOptions(index)} color="dark">
        {editMoreOptions ? 'Hide and clean ' : 'Show '}
        advanced options (be careful, do not change this if you are not using
        istio gateway)
      </Styled.Subtitle>
      {editMoreOptions && (
        <>
          <Styled.FieldPopover>
            <Styled.Input
              label="Insert a host for virtual service use"
              name={`components[${index}].hostValue`}
              ref={register(isRequiredAndNotBlank)}
              defaultValue={field.hostValue}
            />
            <Styled.Popover
              title="Host name"
              icon="info"
              size="20px"
              link="https://istio.io/latest/docs/reference/config/networking/virtual-service/"
              linkLabel="View documentation"
              description="In some cases it will be necessary to change the host to expose your application, by default leave it empty.."
            />
          </Styled.FieldPopover>{' '}
          <Styled.FieldPopover>
            <Styled.Input
              label="Insert a ingress name if necessary"
              name={`components[${index}].gatewayName`}
              ref={register(isRequiredAndNotBlank)}
              defaultValue={field.gatewayName}
            />
            <Styled.Popover
              title="Istio ingress"
              icon="info"
              size="20px"
              link="https://istio.io/latest/docs/reference/config/networking/gateway/"
              linkLabel="View documentation"
              description="If your application use ingress gateway to be exposed it will be necessary to link with a virtual service using ingress name"
            />
          </Styled.FieldPopover>
        </>
      )}
    </Styled.Components.ColumnWrapper>
  );
};

export default ComponentForm;
