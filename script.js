const btn = document.querySelector('#loginForm');

const CONFIG = {
  API_URL: '/api/v1/submit',
  TOKEN_KEY: '',
};

btn.addEventListener('submit', async (e) => {
  try {
  e.preventDefault();

  /* btn.classList.add("spinner"); */
  document.querySelector('.spin').style.display = 'block';
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDisplay = document.getElementById('errorMessage');
  //errorDisplay.style.display = 'none';

  const result = await handleLogin(username, password);

  
    if (result.status === 'success') {
      // Post to the API_URL
      window.location.href = '/dashboard';
    } else {
      errorDisplay.textContent = result.message;
      //errorDisplay.style.display = 'block';
    }
  } catch(err) {
    // TODO:  Implement spinner for summit button done

    /* btn.classList.remove("spinner"); */
    document.getElementById('spinner').style.display = 'none';
    // btn.form.disabled = false;
  }

  //
  //
});

async function handleLogin(username, password) {
  try {
    const loginData = {
      username: username.trim(),
      password: password,
    };

    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.status === 'success') {
      throw new Error(await response.text());
    }

    const data = await response.json();

    // Implement Store tokens
    // storeTokens(data);

    return {
      status: true,
    };

    //
    //
  } catch (error) {
    console.error('Login error: ', error);
    return {
      status: false,
      message: handleApiError(error),
    };
  }
}

const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return 'Invalid credentials.';
      default:
        return 'An error occurred. Please try again';
    }
  }

  return 'Network error. Please check your connection';
};

// const storeTokens = (tokens) => {
//   localStorage.setItem(CONFIG.TOKEN_KEY, tokens.token);
// };

// const clearTokens = () => {
//   localStorage.removeItem(CONFIG.TOKEN_KEY);
// };

// const isAuthenticated = () => {
//   const token = localStorage.getItem(CONFIG.TOKEN_KEY);
//   if (token) {
//     return true;
//   } else {
//     return false;
//   }
// };

// const getAuthToken = () => {
//   return localStorage.getItem(CONFIG.TOKEN_KEY);
// };

// const handleLogout = () => {
//   clearTokens();

//   return {
//     success: true,
//   };
// };
