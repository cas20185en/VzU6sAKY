// 代码生成时间: 2025-09-23 11:29:49
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { Chart } = require('chart.js');

/**
 * 创建一个交互式图表生成器的Electron应用程序
 */
class InteractiveChartGenerator {
  constructor() {
    this.window = null;
  }

  /**
   * 初始化Electron应用程序
   */
  init() {
    app.on('ready', () => this.createWindow());
  }

  /**
   * 创建浏览器窗口
   */
  createWindow() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // 加载应用的HTML文件
    this.window.loadFile('index.html');

    // 打开开发者工具
    this.window.webContents.openDevTools();

    // 窗口关闭时退出应用
    this.window.on('closed', () => {
      this.window = null;
      app.quit();
    });
  }
}

/**
 * 启动Electron应用程序
 */
const appInstance = new InteractiveChartGenerator();
appInstance.init();

// 在主进程中引入图表库，以便在渲染器进程中使用
appInstance.window.webContents.on('dom-ready', () => {
  appInstance.window.webContents.send('init-chart', Chart);
});

// 在index.html中，你将需要引入Chart.js库，并编写用于生成图表的脚本。
// 这里是一个简单的例子，如何在渲染器进程中使用传入的Chart对象：

/* <script>
// 监听从主进程发送的图表初始化消息
window.addEventListener('message', (event) => {
  if (event.data.type === 'init-chart') {
    // 接收Chart对象
    const Chart = event.data.chart;

    // 创建一个图表实例
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
});
</script> */