import os from 'os';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIP();
console.log(`\n🌐 Your CalTrak app is accessible at:`);
console.log(`   Frontend: http://${ip}:3000`);
console.log(`   Backend:  http://${ip}:3001`);
console.log(`\n📱 Family members can access it from their devices using:`);
console.log(`   http://${ip}:3000`);
console.log(`\n💡 Make sure both servers are running:`);
console.log(`   npm run dev    (frontend)`);
console.log(`   npm run server (backend)`);
