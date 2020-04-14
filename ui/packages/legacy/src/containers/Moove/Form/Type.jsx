import React, { Fragment } from 'react'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import capitalize from 'lodash/capitalize'
import Label from 'components/Label'
import PersonCircleIcon from 'core/assets/svg/person-circle.svg'
import GithubLightIcon from 'core/assets/svg/github-light.svg'
import { CARD_LIST_INFOS } from 'containers/Moove/constants'
import Resume from 'containers/Resume'
import PropTypes from 'prop-types'
import CardList from '../CardList'
import { StyledForm } from './styled'

const Type = ({ value, onComplete }) => {

  const handleOnSelectItem = (typeValue, resumeFn) => {
    const firstSelectItem = find(typeValue, ({ selected }) => selected)

    onComplete(firstSelectItem ?.id)
    resumeFn()
  }

  const handleSelectItem = (typeValue, resumeFn) => {
    return !isEmpty(typeValue) && handleOnSelectItem(typeValue, resumeFn)
  }

  return (
    <StyledForm.Wrapper>
      <Resume initial={!!value} name="general.type" tags={[capitalize(value)]}>
        {resumeFn => (
          <Fragment>
            <Label id="moove.create.selectType" />
            <CardList
              list={[
                { icon: <PersonCircleIcon />, ...CARD_LIST_INFOS.ACTION },
                { icon: <GithubLightIcon />, ...CARD_LIST_INFOS.FEATURE },
              ]}
              onSelectItem={typeValue => handleSelectItem(typeValue, resumeFn)}
            />
          </Fragment>
        )}
      </Resume>
    </StyledForm.Wrapper>
  )
}

Type.propTypes = {
  value: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
}

Type.defaultProps = {
  value: '',
}

export default Type
