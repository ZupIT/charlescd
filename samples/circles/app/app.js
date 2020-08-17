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
    return {}
  }
}

function removeDefaultCircle(content = []) {
  return content.filter(item => item.name !== 'Default');
}

async function listCircles() {
  const moove = document.querySelector('#moove-url');
  const activePath = `${moove.value}/v2/circles?active=true`;
  const inactivePath = `${moove.value}/v2/circles?active=false`;

  errorMessage();

  try {
    toggleLoading('#start-button');
    const responses = await Promise.all([
      fetch(activePath, { method: 'GET', headers: getHeaders() }),
      fetch(inactivePath, { method: 'GET', headers: getHeaders() }),
    ]);

    const contents = await Promise.all([
      getResponse(responses[0]),
      getResponse(responses[1])
    ]);

    const circles = contents.reduce((circles, current) => {
      const result = removeDefaultCircle(current.content);
      return circles.concat(result);
    }, []);

    resetSVG();
    initDefaultCircle(circles);
    hideElement('#form-config');
    showElement('#form-request');
    
  } catch (e) {
    errorMessage(e);
  } finally {
    toggleLoading('#start-button', 'start');
  }
}

async function tryOut() {
  const moove = document.querySelector('#moove-url');
  const identify = `${moove.value}/v2/circles/identify`;

  try {
    toggleLoading('#send-button');
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
  } finally {
    toggleLoading('#send-button', 'send');
  }
}

function rerender() {
  document.querySelector('#body').value = '';
  listCircles();
}