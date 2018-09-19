const port = 8081
const url = require("url")
const path = require("path")
const http = require("http")
const fs = require('fs')
const mime = require('mime');
const server_path = "C:/Users/Administrator/Desktop/qqq" //此处地址为服务端根目录

function notfound(res) {
    res.writeHead(404,{
        'content-type':'text/plain;charset=utf-8'
    })
    res.write('404,页面不存在')
    res.end()
}

let server = http.createServer((req,res) => {
    let  pathname = url.parse(decodeURIComponent(req.url)).pathname
    let  realPath = path.join(server_path, pathname)

    fs.stat(realPath, (err,stats) => {
        if (err) notfound(res) 
        else {
            if (stats.isDirectory()) {
                fs.readdir(realPath,{withFileTypes: true}, (err,files) => {
                    if (err) notfound(res) 
                    else {
                        res.writeHead(404,{
                            'content-type':'text/html;charset=utf-8'
                        })
                        res.write(files.map(item => {
                            let name = item.isDirectory() ? '/' : ''
                            return `<div><a href = ./${item.name}${name}>${item.name}${name}</a></div>`
                        }).join(""))
                        res.end()
                    }
                })
            } else {
                fs.readFile(realPath, function(err,data){
                    if(err) notfound(res)
                    else{
                      res.writeHead(200,{
                        'content-type':mime.getType(data) + ';charset= utf-8'
                      })
                      res.write(data)
                      res.end()
                    }
                  })
            }
        }
    })

    
}).listen(port,() => {
    console.log("Listenning successful")
})