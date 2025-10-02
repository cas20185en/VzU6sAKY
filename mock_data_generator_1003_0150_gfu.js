// 代码生成时间: 2025-10-03 01:50:23
 * comments, and maintainability.
 */

// Import required modules
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { faker } = require('@faker-js/faker');

// Configure the mock data generation
const mockDataConfig = {
  userCount: 5,
  productNameLength: 10,
  productDescriptionLength: 50
};

// Function to generate a user
function generateUser(index) {
  return {
    id: index + 1,
    name: faker.name.findName(),
    email: faker.internet.email(),
    username: faker.internet.userName()
  };
}

// Function to generate a product
function generateProduct(index) {
  return {
    id: index + 1,
    name: faker.commerce.productName({ words: mockDataConfig.productNameLength }),
    description: faker.commerce.productDescription({ words: mockDataConfig.productDescriptionLength })
  };
}

// Function to generate mock data
function generateMockData() {
  try {
    // Generate users
    const users = [];
    for (let i = 0; i < mockDataConfig.userCount; i++) {
      users.push(generateUser(i));
    }

    // Generate products
    const products = [];
    for (let i = 0; i < mockDataConfig.userCount; i++) {
      products.push(generateProduct(i));
    }

    // Combine and return the mock data
    return { users, products };
  } catch (error) {
    console.error('Failed to generate mock data:', error);
    return null;
  }
}

// Main Electron app
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Preload script to handle data generation
const preloadScript = `
  // Export the generateMockData function for the main window
  export function generateMockData() {
    return ${generateMockData.toString()}();
  }
`;

// Write the preload script to a file
fs.writeFileSync(path.join(__dirname, 'preload.js'), preloadScript);
