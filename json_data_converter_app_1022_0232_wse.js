// 代码生成时间: 2025-10-22 02:32:23
 * convert JSON data from one format to another (e.g., pretty print,
 * minify, etc.). It demonstrates a clear structure, error handling,
 * and follows best practices for maintainability and extensibility.
 */

const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Function to create a new BrowserWindow
function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  // Load the index.html of the app.
  win.loadFile('index.html');

  // Open the DevTools.
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})

// Handle errors
app.on('will-quit', () => {
  console.log('App will quit');
})

// Preload script for context isolation
const preload = `
  // Preload script here
  const { contextBridge, ipcRenderer } = require('electron');

  contextBridge.exposeInMainWorld('electronAPI', {
    // Function to convert JSON data
    convertJSON: (data, formatType) => ipcRenderer.invoke('convert-json', { data, formatType })
  });
`;

// Write the preload script to a file
fs.writeFileSync(path.join(__dirname, 'preload.js'), preload, 'utf8');

// IPC message handler for converting JSON data
const { ipcMain } = require('electron');
ipcMain.handle('convert-json', async (event, args) => {
  try {
    const { data, formatType } = args;
    // Convert data based on the formatType
    let convertedData;
    switch (formatType) {
      case 'pretty':
        convertedData = JSON.stringify(JSON.parse(data), null, 2);
        break;
      case 'minify':
        convertedData = JSON.stringify(JSON.parse(data));
        break;
      default:
        throw new Error('Unsupported format type');
    }
    return convertedData;
  } catch (error) {
    console.error('Error converting JSON data:', error);
    throw error;
  }
});