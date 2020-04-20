export const TOASTER_ACTION_TYPES = {
  ADD_TOAST: 'TOASTER/ADD_TOAST',
  REMOVE_TOAST: 'TOASTER/REMOVE_TOAST',
}

export const TOAST_TYPES = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  INFO: 'INFO',
  WARNING: 'WARNING',
}

export const toasterActions = {
  toastSuccess: message => ({
    type: TOASTER_ACTION_TYPES.ADD_TOAST, toast: TOAST_TYPES.SUCCESS, message,
  }),
  toastFailed: message => ({
    type: TOASTER_ACTION_TYPES.ADD_TOAST, toast: TOAST_TYPES.FAILED, message,
  }),
  toastInfo: message => ({
    type: TOASTER_ACTION_TYPES.ADD_TOAST, toast: TOAST_TYPES.INFO, message,
  }),
  toastWarning: message => ({
    type: TOASTER_ACTION_TYPES.ADD_TOAST, toast: TOAST_TYPES.WARNING, message,
  }),
  removeToast: () => ({ type: TOASTER_ACTION_TYPES.REMOVE_TOAST }),
}
