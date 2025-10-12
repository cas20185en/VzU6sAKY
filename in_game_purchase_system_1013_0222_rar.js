// 代码生成时间: 2025-10-13 02:22:23
// 引入 Electron 主进程模块
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// 保存内购数据的文件名
const purchaseDataFile = 'purchases.json';

// 初始化内购数据
let purchases = [];

// 加载内购数据
function loadPurchases() {
  try {
    const data = fs.readFileSync(path.join(__dirname, purchaseDataFile), 'utf8');
    purchases = JSON.parse(data);
  } catch (error) {
    console.error('Error loading purchases:', error);
  }
}

// 保存内购数据
function savePurchases() {
  try {
    const data = JSON.stringify(purchases);
    fs.writeFileSync(path.join(__dirname, purchaseDataFile), data, 'utf8');
  } catch (error) {
    console.error('Error saving purchases:', error);
  }
}

// 处理内购请求
function handlePurchase(purchase) {
  try {
    if (!purchases.find(p => p.id === purchase.id)) {
      purchases.push(purchase);
      savePurchases();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error handling purchase:', error);
    return false;
  }
}

// 创建窗口并加载内购系统
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 当 Electron 完成初始化并准备好创建浏览器窗口时，调用此函数
app.on('ready', createWindow);

// 全局快捷方式
app.on('will-quit', () => {
  savePurchases();
});

// 监听未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// 预加载脚本，用于在渲染进程中暴露内购功能
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  purchase: (purchase) => ipcRenderer.invoke('purchase', purchase),
});

// 主进程中处理预加载脚本的通信
ipcRenderer.on('purchase', async (event, purchase) => {
  const result = await handlePurchase(purchase);
  event.returnValue = result;
});