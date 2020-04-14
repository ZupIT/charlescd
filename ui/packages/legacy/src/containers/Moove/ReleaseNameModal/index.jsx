import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import AddRcSVG from 'core/assets/svg/add-rc.svg'
import { Translate } from 'components/index'
import Styled from './styled'
import { KUBERNETES_LABELS } from 'core/constants/kubernetes'

const ReleaseNameModal = ({ onSubmit, onClose }) => {
  const { register, getValues, triggerValidation, errors } = useForm()
  const [ disableDeploy, setDisableDeploy ] = useState(true)

  const onClick = () => onSubmit(get(getValues(), 'tagName'))

  const triggerValidateReleaseName = async (tagName) => {
    if (!isEmpty(tagName)) {
      const result = await triggerValidation("tagName");
      return result
    }
    return false
  }

  const checkReleaseName = async () => {
    const { tagName } = getValues()
    const isReleaseNameValid = await triggerValidateReleaseName(tagName)

    setDisableDeploy(
      isEmpty(tagName) ||
      !isReleaseNameValid
    )
  }


  return (
    <Styled.ModalLayed onClose={onClose} size="medium" vertical>
      <AddRcSVG />
      <Styled.Content>
        <div>
          <Styled.Title>
            <Translate id="moove.column.enterTagName" />
          </Styled.Title>
          <Styled.InputGroup
            label="release-darwin-"
            name="tagName"
            onChange={checkReleaseName}
            properties={register({
              required: true,
              minLength: {
                value: KUBERNETES_LABELS.LABEL_VERSION_MIN,
              },
              maxLength: {
                value: KUBERNETES_LABELS.LABEL_VERSION_MAX,
              },
            })}
          />
          {errors.tagName && (
            <Styled.Error>
              <Translate id="moove.column.enterTagName.error" />
            </Styled.Error>
          )}
        </div>
        <Styled.Actions>
          <Styled.Button transparent onClick={onClose}>
            <Translate id="general.cancel" />
          </Styled.Button>
          <Styled.Button
            primary
            margin="0 -5px 0 0"
            onClick={onClick}
            properties={{ disabled: disableDeploy }}
          >
            <Translate id="general.generate" />
          </Styled.Button>
        </Styled.Actions>
      </Styled.Content>
    </Styled.ModalLayed>
  )
}

export default ReleaseNameModal
