// 代码生成时间: 2025-10-24 14:03:22
// Import required modules
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Define the path to the index.html file
const indexPath = path.join(__dirname, 'index.html');

// Define the path to the highlight.js library
const highlightJsPath = path.join(__dirname, 'highlight.js');

// Create a BrowserWindow instance
let mainWindow;

// Function to create the window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Load the index.html file
    mainWindow.loadFile(indexPath);

    // Open the DevTools
    mainWindow.webContents.openDevTools();

    // Handle window close event
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit the application when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Preload script to handle window events and context
const preloadJsCode = `
    // Preload script to handle window events and context
    const { contextBridge, ipcRenderer } = require('electron');

    // Expose protected methods that allow the renderer process to use the ipcRenderer without
    // exposing the entire renderer context
    contextBridge.exposeInMainWorld('electronAPI', {
        // This function will be called in index.html when the user wants to load a file
        highlightCode: (fileContent) => {
            ipcRenderer.send('highlight-code', fileContent);
        }
    });
`;

// Write the preload script to a file
fs.writeFile(path.join(__dirname, 'preload.js'), preloadJsCode, (err) => {
    if (err) {
        console.error('Error writing preload.js file:', err);
    } else {
        console.log('Preload.js file written successfully.');
    }
});

// IPC listener to handle code highlighting
ipcMain.on('highlight-code', (event, arg) => {
    // Load the highlight.js library
    const hljs = require(highlightJsPath);
    
    // Perform syntax highlighting on the code
    const highlightedCode = hljs.highlightAuto(arg).value;
    
    // Send the highlighted code back to the renderer process
    event.reply('highlight-code-response', highlightedCode);
});