// 代码生成时间: 2025-10-20 14:55:23
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// 定义会员积分系统类
class LoyaltyPointsSystem {
  constructor() {
    this.users = {}; // 存储会员数据
  }

  // 加载会员数据
  loadUsers() {
    try {
      const data = fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8');
      this.users = JSON.parse(data);
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = {};
    }
  }

  // 保存会员数据
  saveUsers() {   
    try {
      const data = JSON.stringify(this.users);
      fs.writeFileSync(path.join(__dirname, 'users.json'), data);
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // 添加会员
  addUser(userId, userName) {
    if (this.users[userId]) {
      throw new Error('User already exists.');
    }
    this.users[userId] = {
      id: userId,
      name: userName,
      points: 0
    };
    this.saveUsers();
  }

  // 更新会员积分
  updatePoints(userId, points) {
    if (!this.users[userId]) {
      throw new Error('User not found.');
    }
    this.users[userId].points += points;
    this.saveUsers();
  }

  // 获取会员信息
  getUserInfo(userId) {
    return this.users[userId] || null;
  }
}

// 初始化会员积分系统
const loyaltySystem = new LoyaltyPointsSystem();
loyaltySystem.loadUsers();

// 创建窗口用于显示会员积分系统
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  win.loadFile('index.html');

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('loyalty-system-ready', loyaltySystem);
  });
}

app.whenReady().then(createWindow);