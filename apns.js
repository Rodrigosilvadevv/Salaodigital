const http2 = require('http2');
const jwt = require('jsonwebtoken');

const APNS_KEY_ID = process.env.APNS_KEY_ID;
const APNS_TEAM_ID = process.env.APNS_TEAM_ID;
const APNS_KEY_P8 = (process.env.APNS_KEY_P8 || '').replace(/\\n/g, '\n');
const BUNDLE_ID = 'com.barber.SalaoDigital';

let cachedJwt = null;
let cachedAt = 0;

const getJwt = () => {
  const now = Math.floor(Date.now() / 1000);
  if (cachedJwt && now - cachedAt < 3000) return cachedJwt;
  cachedJwt = jwt.sign({ iss: APNS_TEAM_ID, iat: now }, APNS_KEY_P8, {
    algorithm: 'ES256',
    header: { alg: 'ES256', kid: APNS_KEY_ID },
  });
  cachedAt = now;
  return cachedJwt;
};

function sendIosPush(deviceToken, title, body, data = {}) {
  return new Promise((resolve, reject) => {
    const client = http2.connect('https://api.push.apple.com');
    client.on('error', reject);

    const payload = JSON.stringify({
      aps: { alert: { title, body }, sound: 'default' },
      ...data,
    });

    const req = client.request({
      ':method': 'POST',
      ':path': `/3/device/${deviceToken}`,
      authorization: `bearer ${getJwt()}`,
      'apns-topic': BUNDLE_ID,
      'apns-push-type': 'alert',
      'apns-priority': '10',
    });

    let status = 0;
    let resp = '';
    req.on('response', (h) => { status = h[':status']; });
    req.on('data', (c) => { resp += c; });
    req.on('end', () => {
      client.close();
      console.log('APNs', status, resp);
      status === 200 ? resolve(true) : reject(new Error(`APNs ${status} ${resp}`));
    });
    req.on('error', (e) => { client.close(); reject(e); });
    req.end(payload);
  });
}

module.exports = { sendIosPush };