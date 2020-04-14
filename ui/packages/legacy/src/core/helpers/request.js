import { toasterActions } from 'containers/Toaster/state/actions'

export function onSaveError(error, dispatch) {
  const errorMessage = error?.response?.data?.message
  const defaultErrorMessage = 'message.error.unexpected'
  dispatch(toasterActions.toastFailed(errorMessage || defaultErrorMessage))
}
