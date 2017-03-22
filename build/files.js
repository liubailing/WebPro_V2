'use strict';
var glob = require("glob");
var path = require("path");
var chalk = require('chalk')
var htmlWebpackPlugin = new require("html-webpack-plugin");
var config = require('../config')

var env = config.build.env;
var filesPath={
    jsVendor:["vendor"],
    js :"../src/js",
    jsIgnore:["libs"],
    jsDist:"/src/js/",
    template:"../src/tpl",
    templateDist:"/src/tpl/"
}

var result = {
    entries: {},
    html_plugins: []
}

function getFiles(pathDir, filetye) {
    var pattern = pathDir + "/**";
    var files = glob.sync(pattern, { nodir: true });
    //eval("var re = /(.+)\."+ filetye+"$/;");
    var re = new RegExp("(.+)." + filetye + "$", "g");
    var res = []
    files.forEach(function(fname) {
        if (fname.match(re) && fname.indexOf("/libs/") < 0) {
            res.push(fname);
        }
    })
    return res;
}

console.log(chalk.cyan('get  jsfiles config ... \n'))
//得到JS的 entries配置文件
var jsDir = path.resolve(__dirname, filesPath.js)
var jsFiles = getFiles(jsDir, "js");

jsFiles.forEach(function(filePath) {
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    var distPath = filePath.substring(filePath.lastIndexOf(filesPath.jsDist)+filesPath.jsDist.length,filePath.lastIndexOf('\/')+1)
    result.entries[distPath+filename] = filePath;
})
console.log(chalk.yellow('get jsfiles config complete.\n'))

console.log(chalk.cyan('get templete files config ... \n'))
//得到JS的 html_plugins 配置文件
var htmlDir = path.resolve(__dirname, filesPath.template)
var htmlFiles = getFiles(htmlDir, "html");
var entriesKeys = Object.keys(result.entries);
htmlFiles.forEach(function(filePath) {
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    var distPath = filePath.substring(filePath.lastIndexOf(filesPath.templateDist)+filesPath.templateDist.length,filePath.lastIndexOf('\/')+1)

    filename = distPath+ filename;
    var conf = {
        template: filePath,
        filename: filename + '.html'
    }

    conf.inject = 'body'
    if(result.entries[filename]) conf.chunks = filesPath.jsVendor.concat(filename);

    result.html_plugins.push(new htmlWebpackPlugin(conf))
});
console.log(chalk.yellow('get templete files config complete.\n'))

module.exports = result;