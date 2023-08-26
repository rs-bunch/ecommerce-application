import Toastify from 'toastify-js';

const notifyInfo = (text: string): ReturnType<typeof Toastify> =>
  Toastify({
    text,
    className: 'info',
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
  });

const notifyError = (text: string): ReturnType<typeof Toastify> =>
  Toastify({
    text,
    className: 'error',
    style: {
      background: 'linear-gradient(to right, #ff0c0c, #ffaa6c)',
    },
  });

export { notifyInfo, notifyError };
