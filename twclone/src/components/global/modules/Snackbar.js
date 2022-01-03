export default function setSnackbar(message) {
  const snackbar = document.getElementById('snackbar');
  const [text] = snackbar.children;
  text.textContent = message;
  snackbar.className = 'snackbar';
  setTimeout(() => { snackbar.className = 'disabled'; }, 3000);
}
