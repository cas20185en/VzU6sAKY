// 代码生成时间: 2025-10-10 20:21:52
 * Features:
 * - Add new inventory items
 * - Update existing inventory items
 * - Delete inventory items
 * - View inventory items
 */

// Import necessary Electron modules and other required libraries
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Define the main window
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html of the app
  mainWindow.loadFile('index.html');

  // Open the DevTools for easier debugging
  mainWindow.webContents.openDevTools();

  // Handle window close event
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Create main window when Electron is ready
app.on('ready', createWindow);

// Handle window all closed event on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create window when user initiates app from dock
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Inventory management functions
class InventoryManager {
  // Initialize inventory data storage
  constructor() {
    this.filePath = path.join(__dirname, 'inventory.json');
    this.loadData();
  }

  // Load inventory data from file
  loadData() {
    try {
      fs.readFile(this.filePath, (err, data) => {
        if (err) throw err;
        this.inventoryData = JSON.parse(data);
      });
    } catch (error) {
      console.error('Error loading inventory data:', error);
      this.inventoryData = {};
    }
  }

  // Add new item to inventory
  addItem(item) {
    try {
      this.inventoryData[item.id] = item;
      this.saveData();
    } catch (error) {
      console.error('Error adding item to inventory:', error);
    }
  }

  // Update existing item in inventory
  updateItem(item) {
    try {
      if (this.inventoryData[item.id]) {
        this.inventoryData[item.id] = item;
        this.saveData();
      } else {
        console.error('Item not found in inventory');
      }
    } catch (error) {
      console.error('Error updating item in inventory:', error);
    }
  }

  // Delete item from inventory
  deleteItem(itemId) {
    try {
      if (this.inventoryData[itemId]) {
        delete this.inventoryData[itemId];
        this.saveData();
      } else {
        console.error('Item not found in inventory');
      }
    } catch (error) {
      console.error('Error deleting item from inventory:', error);
    }
  }

  // Save inventory data to file
  saveData() {
    try {
      fs.writeFile(this.filePath, JSON.stringify(this.inventoryData), (err) => {
        if (err) throw err;
        console.log('Inventory data saved');
      });
    } catch (error) {
      console.error('Error saving inventory data:', error);
    }
  }
}

// Instantiate the inventory manager
const inventoryManager = new InventoryManager();

// Export the inventory manager for use in renderer process
module.exports = inventoryManager;