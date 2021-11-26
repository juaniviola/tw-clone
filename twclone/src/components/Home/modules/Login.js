const setLoading = (isLoading) => {
  const button = document.getElementById('signin_btn');
  const [loader, text] = button.children;
  const [username] = document.getElementsByName('username');
  const [password] = document.getElementsByName('password');
  const [email] = document.getElementsByName('email');
  const [fullName] = document.getElementsByName('fullName');

  if (isLoading) {
    button.disabled = true;
    text.className = 'disabled';
    loader.className = 'loading_btn';
    username.disabled = true;
    password.disabled = true;
    if (!!email || !!fullName) {
      email.disabled = true;
      fullName.disabled = true;
    }
  } else {
    text.className = '';
    loader.className = 'disabled';
    button.disabled = false;
    username.disabled = false;
    password.disabled = false;
    if (!!email || !!fullName) {
      email.disabled = false;
      fullName.disabled = false;
    }
  }
};

const setError = (message) => {
  const errorToast = document.getElementById('error_toast');
  const [textErrorToast] = errorToast.children;

  errorToast.className = 'error_toast';
  textErrorToast.innerHTML = '❌ '.concat(message);
};

export { setLoading, setError };
