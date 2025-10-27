// 代码生成时间: 2025-10-27 10:57:43
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// 定义一个类，用于文件搜索和索引
class FileSearchIndexTool {
  constructor() {
    this.searchResults = [];
  }

  // 初始化ELECTRON应用
  initApp() {
    // 创建ELECTRON窗口
    this.createWindow();
    // 监听ELECTRON应用事件
    app.on('ready', this.setupIpcListeners());
  }

  // 创建ELECTRON窗口
  createWindow() {
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
      },
    });

    mainWindow.loadFile('index.html');
  }

  // 设置IPC事件监听器
  setupIpcListeners() {
    ipcMain.handle('search-files', async (event, searchQuery) => {
      try {
        this.searchResults = await this.searchFiles(searchQuery);
        return this.searchResults;
      } catch (error) {
        console.error('Error searching files:', error);
        return [];
      }
    });
  }

  // 搜索文件函数
  async searchFiles(searchQuery) {
    const results = [];
    // 使用find命令在文件系统中搜索文件
    const findProcess = spawn('find', ['/Users', '-name', searchQuery]);
    findProcess.stdout.on('data', (data) => {
      results.push(data.toString().trim());
    });
    findProcess.stderr.on('data', (data) => {
      console.error('Error searching files:', data.toString());
    });
    findProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`find process exited with code ${code}`);
      }
    });

    // 等待find命令完成
    await new Promise((resolve) => findProcess.on('close', resolve));
    return results;
  }
}

// 实例化FileSearchIndexTool类并初始化ELECTRON应用
const fileSearchIndexTool = new FileSearchIndexTool();
fileSearchIndexTool.initApp();