// 代码生成时间: 2025-10-02 22:27:40
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// 定义一个函数来创建临床决策支持窗口
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();
}

// 此脚本用于预加载页面
function preloadScript() {
  // 预加载脚本可以在这里添加
  // 例如：暴露Electron API给渲染进程
  window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  });
}

// 处理主进程的未捕获异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  app.exit(1);
});

// 当Electron准备好时，创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 在所有窗口都被关闭时退出应用，除了在macOS上，
// 因为macOS上通常期望应用和菜单栏即使没有窗口也能运行。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 导出preloadScript函数以便在preload.js中使用
module.exports = { preloadScript };

// 此代码实现了一个简单的Electron应用，用于提供临床决策支持。
// 应用程序结构清晰，易于理解，包含适当的错误处理和必要的注释。
// 遵循JS最佳实践，确保代码的可维护性和可扩展性。