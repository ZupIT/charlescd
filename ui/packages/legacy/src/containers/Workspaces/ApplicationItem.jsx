import React from 'react'
import PropTypes from 'prop-types'
import UsersSVG from 'core/assets/svg/users.svg'
import Translate from 'components/Translate'
import Styled from './styled'

const ApplicationItem = ({ name, membersCount, onAppClick }) => (
  <Styled.Card.Wrapper
    shadowed
    small
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onAppClick && onAppClick(e)
    }}
    title={(
      <Styled.Card.Body>
        { name }
      </Styled.Card.Body>
    )}
    footer={(
      <Styled.Card.Footer.Wrapper>
        <Styled.Card.Footer.Item>
          <UsersSVG /> { membersCount } <Translate id="permissions.workspace.memberCount" />
        </Styled.Card.Footer.Item>
      </Styled.Card.Footer.Wrapper>
    )}
  />
)

ApplicationItem.defaultProps = {
  name: '',
  membersCount: 0,
  onAppClick: null,
}

ApplicationItem.propTypes = {
  name: PropTypes.string,
  membersCount: PropTypes.number,
  onAppClick: PropTypes.func,
}

export default React.memo(ApplicationItem)
