const pty = require('node-pty');

const shell = pty.spawn('powershell.exe', [
  '-NoLogo',
  '-NoProfile',
  '-Command',
  '$PSVersionTable.PSVersion.ToString()'
], {
  name: 'xterm-256color',
  cols: 80,
  rows: 24,
  cwd: process.cwd(),
  env: process.env
});

shell.onData(data => process.stdout.write(data));
shell.onExit(({ exitCode }) => {
  console.log('\nPowerShell exited with code:', exitCode);
});
