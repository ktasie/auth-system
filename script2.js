// Declare all variables.
const domStrings = {
  loginForm: document.querySelector('#loginForm'),
  spinner: document.querySelector('.spin'),
  errorParagraph: document.querySelector('#errorMessage'),
  username: document.querySelector('#username'),
  password: document.querySelector('#password'),
  container: document.querySelector('.container'),
};

// Listen to a submit event.
domStrings.loginForm.addEventListener('submit', async function (e) {
  try {
    e.preventDefault();

    domStrings.spinner.style.display = 'block';
    domStrings.container.style.filter = 'blur(4px)';

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      username: domStrings.username.value,
      password: domStrings.password.value,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    const response = await fetch('/api/v1/submit', requestOptions);

    const result = await response.json();

    // If it returns a failed event.
    if (result.status === 'fail') {
      throw new Error(result.message);
    }

    // Redirect page if a response existsg
    window.location.href = '/dashboard';
  } catch (err) {
    domStrings.errorParagraph.textContent = err.message;
    domStrings.username.value = '';
    domStrings.password.value = '';
    domStrings.spinner.style.display = 'none';
    domStrings.container.style.filter = 'none';
  }
});
