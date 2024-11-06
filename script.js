const btn = document.querySelector('#loginForm');

const CONFIG = {
  API_URL: '/api/v1/submit',
};

const handleApiError = (error) => {
  if (error.status) {
    return error.message;
  } else {
    switch (error.message) {
      case 'Access Denied':
        window.location.href = '/';
      case 'Invalid token':
        window.location.href = '/';
      default:
        return error.message;
    }
  }
  return 'An error occured. Please try again';
};

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

    if (!response.ok) {
      throw new Error(await response.text());
    }

    // Implement Store tokens
    // storeTokens(data);

    return {
      status: true,
    };

    //
    //
  } catch (error) {
    let errorMessage;

    try {
      const parsedError = JSON.parse(error.message);
      errorMessage = handleApiError(parsedError);
    } catch (parseError) {
      errorMessage = handleApiError(error);
    }

    return {
      status: false,
      message: errorMessage,
    };
  }
}

btn.addEventListener('submit', async (e) => {
  e.preventDefault();

  /* btn.classList.add("spinner"); */
  document.getElementById('spinner').style.display = 'block';
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDisplay = document.getElementById('errorMessage');
  errorDisplay.style.display = 'none';

  setTimeout(async () => {
    const result = await handleLogin(username, password);

    try {
      if (result.status) {
        window.location.href = '/dashboard';
      } else {
        errorDisplay.textContent = result.message;
        errorDisplay.style.display = 'block';
      }
    } finally {
      // TODO:  Implement spinner for summit button done

      /* btn.classList.remove("spinner"); */
      document.getElementById('spinner').style.display = 'none';
      // btn.form.disabled = false;
    }
  }, 1000);

  //
  //
});

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
