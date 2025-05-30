const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/test',
  method: 'GET'
};

console.log('Checking if server is running...');

const req = http.request(options, (res) => {
  console.log(`Server response status code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Server response:', data);
    console.log('✅ Server is running correctly!');
  });
});

req.on('error', (error) => {
  console.error('❌ Server check failed:', error.message);
  console.log('\nPossible issues:');
  console.log('1. Server is not running - start it with "node Index.js"');
  console.log('2. Server is running on a different port - check PORT in Index.js');
  console.log('3. Firewall is blocking connections - check firewall settings');
});

req.end();