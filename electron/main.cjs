// Processo principal do app desktop (Electron).
// Carrega o build de produção (dist/) localmente: funciona offline, sem servidor.
const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('node:path');

function criarJanela() {
  const win = new BrowserWindow({
    width: 1400,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    title: 'Parque Cidade Viva — maquete conceitual',
    backgroundColor: '#f4f6f2',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  // Links externos abrem no navegador padrão, nunca dentro do app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://')) {
      e.preventDefault();
      if (/^https?:/.test(url)) shell.openExternal(url);
    }
  });
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

// Reserva por software (SwiftShader) para o WebGL quando a GPU estiver ausente
// ou bloqueada (comum em PCs de laboratório). Com GPU disponível, ela é usada normalmente.
// Seguro aqui porque o app só carrega o próprio conteúdo local.
app.commandLine.appendSwitch('enable-unsafe-swiftshader');

Menu.setApplicationMenu(null);
app.whenReady().then(() => {
  criarJanela();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) criarJanela();
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
