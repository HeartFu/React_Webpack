const fs = require('fs');
const path = require('path');
//fs.readFileSync('../src/')

const remain = process.argv.slice(2);

// 文件删除方法
deleteFolderRecursive = function (path) {
  const files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      const curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);

  }

};

// 字符串正则替换
function replaceStr(str, data) {
  Object.keys(data).forEach(function (item) {
    const reg = new RegExp("\\$\\{\\s*" + item + "\\s*\\}", "g");
    str = str.replace(reg, data[item]);
  });
  return str;
}

// 名字转化方法
function parseName(fileName) {
  const names = fileName.split('-');
  let resultName = "";
  names.forEach(function (item, i) {
    if (i != 0) {
      item = item.charAt(0).toUpperCase() + item.substr(1);
    }
    resultName += item;
  });
  return resultName;
}

// 初始化类型校验
if (remain[0] === "page" || remain[0] === "component") {
  // 参数校验
  if (!remain[1]) {
    console.error("传入参数不正确!");
    return;
  }

  // 参数转化
  const data = {
    className: parseName(remain[1]),
    fileName: remain[1]
  }

  const pagePath = path.join(__dirname, remain[0] === "page"?"../src/pages":"../src/components");
  const pageDir = path.join(pagePath, data.className);

  // 文件校验
  if (fs.existsSync(pageDir)) {
    console.warn("该文件已存在!");
    // deleteFolderRecursive(pageDir); //方便测试
    return;
  }
  const result = fs.mkdirSync(pageDir);
  // 创建vue文件
  const vueFile = fs.readFileSync(path.join(__dirname, './tempJs/index.vue'));
  fs.writeFileSync(path.join(pageDir, remain[1] + ".vue"), replaceStr(vueFile.toString(), data), { encoding: 'utf-8', mode: 438, flag: 'w' });

  // 创建js文件
  const indexFile = fs.readFileSync(path.join(__dirname, './tempJs/index.js'));
  fs.writeFileSync(path.join(pageDir, "index.js"), replaceStr(indexFile.toString(), data), { encoding: 'utf-8', mode: 438, flag: 'w' });

  // 创建less文件
  const lessFile = fs.readFileSync(path.join(__dirname, './tempJs/index.less'));
  fs.writeFileSync(path.join(pageDir, remain[1] + ".less"), replaceStr(lessFile.toString(), data), { encoding: 'utf-8', mode: 438, flag: 'w' });

  if (remain[0] === "page") {
    const routePath = path.join(__dirname, '../src/routes.js');
    const routes = require(routePath);


    let routeWriteStr = "module.exports = [";

    // 改变文件路由
    routes.forEach(function (item, i) {
      if (i != 0) {
        routeWriteStr += "\r\n";
      }

      routeWriteStr += "{";

      Object.keys(item).forEach(function (it, j) {
        routeWriteStr += "\r\n\t";
        routeWriteStr += it + ": "
        if (typeof item[it] !== "function") {
          routeWriteStr += "\"" + item[it] + "\"";
        } else {
          routeWriteStr += item[it];
        }
        if (j != it.length - 1) {
          routeWriteStr += ","
        }
      });


      routeWriteStr += "\r\n},";
    });

    routeWriteStr += "{\r\n\
  path: '/" + data.className + "',\r\n\
  name: '" + data.className + "',\r\n\
  component: function (resolve) {\r\n\
  \trequire(['./pages/" + data.className + "'], resolve);\r\n\
  }\r\n}";
    routeWriteStr += "];"
    console.log(routeWriteStr);
    //fs.rmdirSync(routePath);
    fs.writeFileSync(routePath, routeWriteStr);
  }
}
