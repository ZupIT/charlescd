import React from 'react'
import size from 'lodash/size'
import ShieldSVG from 'core/assets/svg/icon-shield-blue.svg'
import UsersSVG from 'core/assets/svg/users.svg'
import Translate from 'components/Translate'
import { DropdownMenu } from 'components'
import Styled from './styled'

const GroupItem = ({ name, roles, membersCount, options, onGroupClick }) => (
  <Styled.Card.Wrapper
    shadowed
    small
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onGroupClick && onGroupClick()
    }}
    title={(
      <Styled.Card.Body>
        { name }
        <DropdownMenu
          dark
          style={{ marginRight: '-10px' }}
          options={options}
        />
      </Styled.Card.Body>
    )}
    footer={(
      <Styled.Card.Footer.Wrapper>
        <Styled.Card.Footer.Item>
          <ShieldSVG /> { size(roles) } <Translate id="permissions.group.permissionCount" />
        </Styled.Card.Footer.Item>
        <Styled.Card.Footer.Item>
          <UsersSVG /> { membersCount } <Translate id="permissions.group.memberCount" />
        </Styled.Card.Footer.Item>
      </Styled.Card.Footer.Wrapper>
    )}
  />
)

GroupItem.defaultProps = {
  membersCount: 0,
}

export default GroupItem
