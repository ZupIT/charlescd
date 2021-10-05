export const saveCookie = (key, value) => {
  document.cookie = `${key}=${value}; path=/;`
}

export const getCircleId = () => {
  const name = 'x-circle-id=';
  const ca = document.cookie.split(';');
  const circle = ca.find(item => item.indexOf(name) !== -1);
  const circleId = circle ? circle.replace(name, '') : 'UNMATCHED'

  return circleId;
}
