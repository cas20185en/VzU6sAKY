// 代码生成时间: 2025-10-25 07:23:52
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initializeQLearningEnvironment } = require('./q_learning_environment');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { app.quit(); }

// Create mainWindow, and load the index.html of the app.
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Initialize the Q-learning environment.
initializeQLearningEnvironment();

// Preload script that will be run before the rest of the pages in your app.
// It has access to Node.js and the `electron` module.
const preloadScript = `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  initializeEnvironment: () => ipcRenderer.invoke('initialize-environment'),
  updateEnvironment: (state) => ipcRenderer.invoke('update-environment', state),
  getEnvironmentState: () => ipcRenderer.sendSync('get-environment-state')
});
`;

// Q-learning environment module.
const qLearningEnvironment = {
  initializeQLearningEnvironment() {
    // Initialize the Q-learning environment here.
    // This could involve setting up the state space, action space, and Q-table.
    // For simplicity, this function is left empty.
    console.log('Q-learning environment initialized.');
  },
  // Add more methods to interact with the Q-learning environment.
};

module.exports = qLearningEnvironment;