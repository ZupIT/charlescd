import React from 'react'
import map from 'lodash/map'
import { useRouter } from 'core/routing/hooks'
import MessageCard from 'containers/UserPanel/components/MessageCard'
import { useNotifications } from 'containers/Notification/hooks/useNotifications'
import { TemporaryTextForPlaceholder, StyledAlertTab } from 'containers/UserPanel/components/styled'
import Translate from 'components/Translate'
import { DASHBOARD_HYPOTHESES_DETAIL, DASHBOARD_HYPOTHESES_CARD, ERRORS } from 'core/constants/routes'
import { getPath } from 'core/helpers/routes'
import { useSelector } from 'core/state/hooks'

const minLength = 0

const AlertsTab = () => {
  const [, { markAsRead }] = useNotifications()
  const history = useRouter()
  const { list: notifications } = useSelector(state => state.notifications)

  const redirectTo = ({ referenceFields, id }) => {
    if (referenceFields) {
      const { hypothesis, card } = referenceFields

      markAsRead(id)

      if (card) history.push(getPath(DASHBOARD_HYPOTHESES_CARD, [hypothesis, card]))
      else history.push(getPath(DASHBOARD_HYPOTHESES_DETAIL, [hypothesis]))
    } else {
      history.push(ERRORS)
    }
  }

  const renderMessages = () => map(notifications, notification => (
    <MessageCard key={notification.id} message={notification} onClick={redirectTo} />
  ))

  const renderTextPlaceholder = () => (
    <TemporaryTextForPlaceholder>
      <StyledAlertTab.NoNotifications />
      <StyledAlertTab.NoNotificationText>
        <Translate id="general.notification.empty" />
      </StyledAlertTab.NoNotificationText>
    </TemporaryTextForPlaceholder>
  )

  return (notifications.length > minLength) ? renderMessages() : renderTextPlaceholder()
}

export default AlertsTab
