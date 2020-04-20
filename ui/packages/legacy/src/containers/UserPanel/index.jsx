import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { getUserProfileData } from 'core/helpers/profile'
import ArrowDown from 'core/assets/svg/arrow-down.svg'
import ArrowUp from 'core/assets/svg/arrow-up.svg'
import BellDark from 'core/assets/svg/bell-dark.svg'
import Avatar from 'components/Avatar'
import { useOnClickOutside } from 'core/helpers/hooks'
import { useNotifications } from 'containers/Notification/hooks/useNotifications'
import ProfileTabMenu from './components/ProfileTabMenu'
import { TAB } from './constants'
import { useNotifications as useNotificationsLegacy } from '../../notifications'
import Styled from './styled'

const UserPanel = (props) => {
  const { filled, inverted, className } = props
  const [toolbarOpen, setToolbarOpen] = useState(false)
  const [{ unread }] = useNotificationsLegacy()
  const [{ count }, { markAsViewed }] = useNotifications()
  const [activeTab, setActiveTab] = useState(unread ? TAB.NOTIFICATIONS : TAB.DEFAULT)
  const wrapperRef = useRef(null)

  useOnClickOutside(wrapperRef, () => setToolbarOpen(false))

  const handleToolbar = (tab) => {
    setToolbarOpen(!toolbarOpen)
    setActiveTab(tab)
  }

  const showNotifications = () => {
    handleToolbar(TAB.NOTIFICATIONS)
    markAsViewed()
  }

  return (
    <Styled.Wrapper
      inverted={inverted}
      filled={filled}
      className={className}
      toolbarOpen={toolbarOpen}
      ref={wrapperRef}
    >
      <Styled.Column>
        <Styled.AlertCountWrapper onClick={showNotifications}>
          {!!count && (
            <Styled.AlertCount>{count}</Styled.AlertCount>
          )}
          <BellDark />
        </Styled.AlertCountWrapper>
        <Styled.ToggleToolbarWrapper onClick={() => handleToolbar(TAB.PROFILE)}>
          <Styled.UserContainer>
            <Styled.Thumbnail>
              <Avatar src={getUserProfileData('photoUrl')} />
            </Styled.Thumbnail>
          </Styled.UserContainer>
          <Styled.ArrowWrapper>
            { toolbarOpen ? <ArrowUp /> : <ArrowDown /> }
          </Styled.ArrowWrapper>
        </Styled.ToggleToolbarWrapper>
      </Styled.Column>
      { toolbarOpen && (
        <ProfileTabMenu
          activeTab={activeTab}
          openToolbar={toolbarOpen}
          toggleToolbar={setToolbarOpen}
        />
      )}
    </Styled.Wrapper>
  )
}

UserPanel.defaultProps = {
  filled: false,
  inverted: false,
  className: '',
}

UserPanel.propTypes = {
  filled: PropTypes.bool,
  inverted: PropTypes.bool,
  className: PropTypes.string,
}

export default UserPanel
