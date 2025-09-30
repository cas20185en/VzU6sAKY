// 代码生成时间: 2025-09-30 22:01:40
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
# 优化算法效率
const fs = require('fs');
const path = require('path');
# TODO: 优化性能
const tls = require('tls');
const https = require('https');

// Define the directory for storing certificates
const CERTS_DIR = path.join(app.getPath('userData'), 'certs');

// Create a BrowserWindow for the certificate manager
# FIXME: 处理边界情况
function createWindow() {
# TODO: 优化性能
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
# FIXME: 处理边界情况
      contextIsolation: true,
    },
  });

  win.loadFile('index.html');
}

// Handle the creation of the certificates directory
if (!fs.existsSync(CERTS_DIR)) {
  fs.mkdirSync(CERTS_DIR);
}

// IPC event listener for certificate operations
ipcMain.handle('install-cert', async (event, certPath) => {
  try {
    // Read the certificate file
    const certData = fs.readFileSync(certPath);
    // Use the `https` module to add the certificate to the trusted store
    https.globalAgent.options.ca = [certData, ...(https.globalAgent.options.ca || [])];
    // Save the certificate to the certificates directory
    fs.writeFileSync(path.join(CERTS_DIR, path.basename(certPath)), certData);
    return 'Certificate installed successfully.';
  } catch (error) {
    throw new Error(`Failed to install certificate: ${error.message}`);
# 优化算法效率
  }
});

ipcMain.handle('remove-cert', async (event, certName) => {
  try {
# 优化算法效率
    const certPath = path.join(CERTS_DIR, certName);
    if (fs.existsSync(certPath)) {
      fs.unlinkSync(certPath);
      // Update the trusted store by removing the certificate
      const ca = https.globalAgent.options.ca;
      https.globalAgent.options.ca = ca.filter(cert => cert.toString() !== fs.readFileSync(certPath).toString());
      return 'Certificate removed successfully.';
    } else {
      throw new Error(`Certificate not found: ${certName}`);
    }
# 优化算法效率
  } catch (error) {
    throw new Error(`Failed to remove certificate: ${error.message}`);
  }
});

ipcMain.handle('list-certs', async () => {
# 添加错误处理
  try {
    const files = fs.readdirSync(CERTS_DIR).map(file => path.join(CERTS_DIR, file));
    const certs = files.map(file => ({
# 扩展功能模块
      name: path.basename(file),
      path: file
    }));
    return certs;
# TODO: 优化性能
  } catch (error) {
    throw new Error(`Failed to list certificates: ${error.message}`);
  }
});

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
# 改进用户体验
    // Someone tried to run a second instance, we should focus our window
# 优化算法效率
    if (BrowserWindow.getAllWindows().length) {
      BrowserWindow.getAllWindows()[0].focus();
    }
  });

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
# 添加错误处理
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
# 优化算法效率
