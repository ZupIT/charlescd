function getHeaders() {
  return new Headers({
    'Content-Type': 'application/json',
    'Authorization': document.querySelector('#auth-url').value,
    'x-workspace-id': document.querySelector('#workspace-id').value
  });
}

function getBody() {
  try {
    errorMessage('');
    const body = document.querySelector('#body').value || '{}';

    return JSON.stringify(JSON.parse(body), null);
  } catch(e) {
    errorMessage(e);
  }
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
    const response = await fetch(moove.value, { method: 'GET', headers: getHeaders() });
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

async function tryOut() {
  // const moove = document.querySelector('#moove-url');
  // const identify = `${moove.value}/v2/circles/identify`;
  const identify = 'https://run.mocky.io/v3/d7c6fff9-5162-4a85-b1ab-48ebb44c3f80';

  try {
    const response = await fetch(identify, { 
      method: 'POST', 
      headers: getHeaders(),
      body: getBody()
    });

    const data = await getResponse(response);
    const [circle] = data || [{}];

    addUser(circle.id);
  } catch (e) {
    errorMessage(e);
  }
}