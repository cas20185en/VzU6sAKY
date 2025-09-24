// 代码生成时间: 2025-09-24 13:44:02
const express = require('express');
const { app, BrowserWindow } = require('electron');

// 配置端口号
const PORT = 3000;

// 创建一个Express应用
const httpServer = express();

// HTTP请求处理函数
httpServer.get('/data', (req, res) => {
  // 模拟数据库查询
  const data = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  };

  // 发送响应
  res.json(data);
});

// 错误处理中间件
httpServer.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 启动HTTP服务器
httpServer.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

// Electron主进程
app.on('ready', () => {
  // 创建BrowserWindow实例
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 加载index.html
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();
});

// 确保HTTP服务器仅在Electron应用准备好后启动
app.on('ready', () => {
  httpServer.listen(PORT);
});
