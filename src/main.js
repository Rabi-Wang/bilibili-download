const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const createWindow = () => {
    Menu.setApplicationMenu(null)
    let win = new BrowserWindow({
        width: 1300,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            // preload: path.join(__dirname, 'components/DownloadInfoModal.js')
        }
    })

    // win.loadFile('./src/gui/html/index.html')

    win.loadURL('http://localhost:3000')
    win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})