const jwt = require('jsonwebtoken');

const YOUR_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGM4NDJlMDg2ZGE1N2IxMTliZGRiMmEiLCJpYXQiOjE2OTA4NDc0NTksImV4cCI6MTY5MTQ1MjI1OX0.HLNQpRMzWsX1mZrVrFb36qw1lTrayqiDfwtOs6WIre4';
const SECRET_KEY_DEV = 'some-super-key';

try {
  const payload = jwt.verify(YOUR_JWT, SECRET_KEY_DEV);

  console.log('\x1b[31m%s\x1b[0m', `
Надо исправить. В продакшне используется тот же
секретный ключ, что и в режиме разработки.
`);
} catch (err) {
  if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
    console.log(
      '\x1b[32m%s\x1b[0m',
      'Всё в порядке. Секретные ключи отличаются'
    );
  } else {
    console.log(
      '\x1b[33m%s\x1b[0m',
      'Что-то не так',
      err
    );
  }
}
