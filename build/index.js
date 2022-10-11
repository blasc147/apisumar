/* REQUIRES */
require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

/* MODULES */
const sql = require('./sql');
const session = require('./session');
const app = express();

/* USES */
app.use(bodyparser.json());
app.use(cors());
app.use(session.passport.initialize());

/* ROUTES */
app.get('/', function (req, res) {
  res.send('Welcome to the API/Back-end!');
});
app.post('/login', session.passport.authenticate('local', {
  failureRedirect: '/login'
}), function (req, res) {
  req.token = session.generateToken(req.user);
  res.json({
    token: req.token,
    user: req.user
  });
});
app.get('/me', session.check, function (req, res) {
  res.json(req.user);
});
app.get('/me', session.check, function (req, res) {
  res.json(req.user);
});

// Display all users
app.get('/prestaciones', session.check, (request, response) => {
  const dni = request.body.dni;
  const query = "SELECT s.afiApellido, s.afiNombre, s.afiClaseDoc, s.afiDNI, s.afiSexo, sp.FechaPrestacion, sp.idObj, sp.idDiag, sp.Observaciones, sp.cuie,sn.NomPres, e.Servicio	FROM Nacer_Chaco.dbo.SMIAfiliados s	INNER JOIN spsPracticas sp ON sp.ClaveBeneficiario = s.ClaveBeneficiario INNER JOIN spsNomenclador sn ON sn.idObj = sp.idObj AND sn.idDiag = sp.idDiag INNER JOIN Efectores e ON e.cuie = sp.cuie WHERE s.afiDNI = '" + dni + "' AND s.afiClaseDoc = 'P'";
  return sql(query, {}).then(result => {
    if (result !== null) response.send(result);else return done(null, false);
  });
});

/* START SERVER */
app.listen(process.env.PORT || 3000);