// 代码生成时间: 2025-10-14 22:13:41
// Required modules
const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = require('is-dev');

// Social Media Manager class
class SocialMediaManager {
  constructor() {
    this.window = null;
  }

  // Creates the application window
  createWindow() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // Load the index.html of the app
    this.window.loadFile('index.html');

    // Open the DevTools.
    if (isDev) this.window.webContents.openDevTools();
  }

  // Starts the application
  startApp() {
    app.on('ready', () => {
      this.createWindow();
    });

    // Handle window close
    this.window.on('closed', () => {
      this.window = null;
    });
  }

  // Update function for application
  checkForUpdates() {
    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify();
    }
  }
}

// Create an instance of the SocialMediaManager
const manager = new SocialMediaManager();

// Start the application
manager.startApp();

// Check for updates
manager.checkForUpdates();
