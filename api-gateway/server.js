const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const port = 6000;

// Proxies
app.use('/users', proxy('http://localhost:5000'));
app.use('/rdv', proxy('http://localhost:5002'));
app.use('/departments', proxy('http://localhost:5003'));
app.use('/dossierPatient', proxy('http://localhost:5004'));

app.listen(port, () => {
  console.log(`Le pere (API Gateway) running on port ${port}`);
});
