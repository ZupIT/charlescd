import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { i18n } from 'core/helpers/translate'
import map from 'lodash/map'
import { StyledResume } from './styled'

const Resume = (props) => {
  const { className, name, tags, intl, onClick } = props

  return (
    <StyledResume.Wrapper className={className}>
      <StyledResume.Name>{i18n(intl, name)}</StyledResume.Name>
      <StyledResume.Tags>
        <StyledResume.Divider />
        {map(tags, (tag, idx) => (
          <StyledResume.Tag onClick={() => onClick(tag)} key={`${tag}-${idx}`}>{tag}</StyledResume.Tag>
        ))}
      </StyledResume.Tags>
    </StyledResume.Wrapper>
  )
}

Resume.defaultProps = {
  onClick: null,
}

Resume.propTypes = {
  name: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  onClick: PropTypes.func,
}

export default injectIntl(Resume)
