const { app, BrowserWindow, screen, Notification, ipcMain } = require('electron')
const path = require("path");

var win;

const createWindow = () => {
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({
        width: width,
        height: height,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    win.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())
})

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

app.whenReady().then(() => {
    
})
