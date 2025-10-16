// 代码生成时间: 2025-10-16 16:48:47
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// 供应链管理系统主类
class SupplyChainManagementSystem {
  constructor() {
    this.data = {}; // 存储供应链数据
    this.window = null; // 用于存储窗口对象
  }

  // 初始化系统
  init() {
    this.createWindow();
  }

  // 创建主窗口
  createWindow() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
      },
    });

    // 加载供应链管理系统的HTML页面
    this.window.loadFile('index.html');
  }

  // 加载数据
  loadSupplyChainData() {
    try {
      const data = fs.readFileSync('supply_chain_data.json', 'utf8');
      this.data = JSON.parse(data);
      console.log('供应链数据加载成功:', this.data);
    } catch (error) {
      console.error('加载供应链数据失败:', error);
    }
  }

  // 保存数据
  saveSupplyChainData() {
    try {
      const data = JSON.stringify(this.data, null, 2);
      fs.writeFileSync('supply_chain_data.json', data);
      console.log('供应链数据保存成功');
    } catch (error) {
      console.error('保存供应链数据失败:', error);
    }
  }

  // 添加供应链项
  addSupplyChainItem(item) {
    const id = uuidv4();
    this.data[id] = item;
    this.saveSupplyChainData();
  }

  // 更新供应链项
  updateSupplyChainItem(id, updatedItem) {
    if (this.data[id]) {
      this.data[id] = updatedItem;
      this.saveSupplyChainData();
    } else {
      console.error(`供应链项ID为${id}的项目不存在，无法更新`);
    }
  }

  // 删除供应链项
  deleteSupplyChainItem(id) {
    if (this.data[id]) {
      delete this.data[id];
      this.saveSupplyChainData();
    } else {
      console.error(`供应链项ID为${id}的项目不存在，无法删除`);
    }
  }
}

// Electron主进程启动
app.whenReady().then(() => {
  const system = new SupplyChainManagementSystem();
  system.init();
  system.loadSupplyChainData();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      system.createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

app.on('will-quit', () => {
  // 清理应用程序退出时的资源
});