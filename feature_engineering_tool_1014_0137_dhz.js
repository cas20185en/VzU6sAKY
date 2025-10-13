// 代码生成时间: 2025-10-14 01:37:24
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

// Function to load and process a CSV file
function loadCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => resolve(data))
      .on('end', () => console.log('CSV file processed successfully.'))
      .on('error', (error) => reject(error));
  });
}

// Function to handle window creation
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// Handle window close event
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app activation event
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Preload script for security
const preloadScript = `
const { ipcRenderer } = require('electron');

document.getElementById('load-file').addEventListener('click', () => {
  ipcRenderer.send('load-csv-file');
});

ipcRenderer.on('csv-data', (event, data) => {
  console.log(data);
  // Handle the CSV data here, for example, display in a table
});
`;

// Function to expose the loadCSVFile function to the preload script
function setupPreloadScript() {
  app.on('load-csv-file', (event, filePath) => {
    loadCSVFile(filePath)
      .then(data => event.reply('csv-data', data))
      .catch(error => console.error('Error loading CSV file:', error));
  });
}

setupPreloadScript();