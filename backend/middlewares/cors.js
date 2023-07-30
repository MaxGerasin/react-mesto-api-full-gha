const allowedCors = [
  'https://api.mesto.maxgerasin.nomoreparties.co',
  'http://api.mesto.maxgerasin.nomoreparties.co',
  'https://mesto.maxgerasin.nomoreparties.co',
  'http://mesto.maxgerasin.nomoreparties.co',
  'https://localhost:3000',
  'http://localhost:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }

  next();
};
