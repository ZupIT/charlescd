export const saveCookie = (key, value) => {
  document.cookie = `${key}=${value}; path=/;`
}
