const { app, BrowserWindow } = require('electron')
const path = require('path')

var connect = require('connect')
var serveStatic = require('serve-static')

const server = connect()

server.use(
  '/',
  serveStatic(path.join(__dirname, 'dist'), {
    index: ['index.html', '/']
  })
)

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,   // forbit CSP
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // win.webContents.openDevTools();     // openDevTools

  const port = 9526;
  server.listen(port, function () {
    console.log(`Server is running at http://localhost:${port}`)
    setTimeout(() => {
      win.loadURL(`http://localhost:${port}`);
    }, 500);     // delay 500ms to load URL
  })

  // Close the server when the main window is closed
  win.on('closed', function () {
    win = null;
    server.close();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.on('uncaughtException', (error) => {
  console.error(error);
});