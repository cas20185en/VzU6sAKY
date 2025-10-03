// 代码生成时间: 2025-10-04 01:34:21
const { app, BrowserWindow } = require('electron');
const cpuUsage = require('node-cpu-usage');
const os = require('os');
const isDev = require('electron-is-dev');

/**
 * 创建CPU使用率分析器窗口
 * @param {BrowserWindow} mainWindow 主窗口实例
 */
function createWindow(mainWindow) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true
    },
  });

  // 和开发模式下加载index.html，生产模式下加载打包后的index.html
  win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'dist/index.html')}`);

  // 打开开发者工具
  if (isDev) {
    win.webContents.openDevTools();
  }
}

/**
 * 主进程入口函数
 */
function start() {
  // 初始化Electron应用
  app.whenReady().then(() => {
    // 创建窗口
    createWindow();

    // 窗口全部关闭时退出应用
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  });

  // 处理应用激活事件
  app.on('activate', () => {
    // 在macOS上重开窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

/**
 * 获取CPU使用率
 * @returns {Promise<number>} CPU使用率百分比
 */
function getCPUUsage() {
  return new Promise((resolve, reject) => {
    cpuUsage((error, percentage) => {
      if (error) {
        reject(error);
      } else {
        resolve(percentage);
      }
    });
  });
}

// 每秒获取一次CPU使用率
setInterval(async () => {
  try {
    const cpuUsagePercentage = await getCPUUsage();
    console.log(`CPU Usage: ${cpuUsagePercentage}%`);
  } catch (error) {
    console.error('Failed to get CPU usage:', error);
  }
}, 1000);

// 启动应用
start();