export const setExpandMode = (status: boolean) => {
  localStorage.setItem('sidebar.mode', JSON.stringify(status));
};

export const getExpandMode = (defaultStatus = true) => {
  const mode = JSON.parse(localStorage.getItem('sidebar.mode'));
  if (mode === null) {
    setExpandMode(defaultStatus);
  }

  return mode === null ? defaultStatus : mode;
};
