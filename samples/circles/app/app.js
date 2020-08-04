function resetSVG() {
  const content = document.querySelector('#content');
  const { defaultCircle } = getDefaultCircle();

  if (defaultCircle) {
    content.removeChild(defaultCircle);
  }

  const newSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  newSVG.id = 'circle-default';
  newSVG.setAttribute('width', '400');
  newSVG.setAttribute('height', '400');

  content.appendChild(newSVG);
}

async function getResponse(response) {
  try {
    return await response.json();
  } catch (e) {
    throw Error(e);
  }
}

async function listCircles() {
  const moove = document.querySelector('#moove-url');

  errorMessage();

  try {
    const response = await fetch(moove.value);
    const data = await getResponse(response);

    if (data && data.content) {
      resetSVG();
      initDefaultCircle(data.content);
      hideElement('#form-config');
      showElement('#form-request');
    }
  } catch (e) {
    errorMessage(e);
  }
}

function tryOut() {
  const moove = document.querySelector('#moove-url');
  const identify = `${moove.value}/v2/circles/identify`;
  console.log(identify);
}