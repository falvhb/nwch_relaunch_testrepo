/*eslint no-lonely-if: 0*/

var RESPONSE_BODY = 'OK';

function probeStatus(req, res) {
  res.set('Content-Type', 'text/plain; charset=UTF-8');
  if (req.method === 'POST') {
    RESPONSE_BODY = req.body.body || 'OK';
  } else {
    if (RESPONSE_BODY !== 'OK') {
      res.status(503);
    }
  }
  res.send(RESPONSE_BODY);
}

module.exports = probeStatus;

