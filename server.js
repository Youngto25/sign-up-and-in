var http = require('http')
var fs = require('fs')
var url = require('url')
//var port = process.argv[2]
var port = process.env.PORT || 8888;

var server = http.createServer(function(request,response){
  var temp = url.parse(request.url,true)
  var path = temp.pathname
  var query = temp.query
  var method = request.method

  if(path === '/'){
    var string = fs.readFileSync('./homepage.html','utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/style'){
    var string = fs.readFileSync('./style.css','utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/main.js'){
    var string = fs.readFileSync('./main.js','utf8')
    response.setHeader('Content-Type', 'application/javascript')
    response.write(string)
    response.end()
  }else if(path === '/signup' && method === 'GET'){
    var string = fs.readFileSync('./signup.html','utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/signup' && method === 'POST'){

    //监听data事件，结果可在server上看见
    let body = [];
    request.on('data',(chunk) =>{
      body.push(chunk);
    }).on('end', () =>{
      body = Buffer.concat(body).toString();
      //body  email=2979337714%40qq.com&password=2&confirm-password=3
      let strings = body.split('&');
      //strings ['email=2979337714%40qq.com','password=2','confirm-password=3']
      let hash = {};
      strings.forEach((string) => { //['email=29']
        let parts = string.split('=');  //['email','29']
        let key = parts[0];
        let value = parts[1];
        hash[key] = value;
      });
      //hash  { email: '2979337714%40qq.com',password: '2','confirm-password': '3' }
      let {email,password,confirm_password} = hash;//ES6
      if(email.indexOf('%40') === -1){
        response.statusCode = 400;
        //前后端撕逼协议
        //在此将格式设置为application/JSON,则会自动将JSON格式parse
        response.setHeader('Content-Type','application/json;charset=utf-8');
        response.write(`{
          "errors":{
            "email":"invalid"
          }
        }`); 
      }else if(password !== confirm_password){
        response.statusCode = 400;
        response.setHeader('Content-Type','application/json;charset=utf-8');
        response.write(`{
          "errors":{
            "password":"unmatch"
          }
        }`);
      }else{
        response.statusCode = 200;
        
        var users = fs.readFileSync('./database','utf8');
        try{
          users = JSON.parse(users);
        }catch(exception){
          users = [];
        }
        users.push({email: email,password: password});
        var usersString = JSON.stringify(users);//将对象users转换成字符串
        fs.writeFileSync('./database',usersString);
       
      }
      response.end()
    });

    
  }else if(path === '/signin' && method === 'GET'){
    var string = fs.readFileSync('./signin.html','utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/signin' && method === 'POST'){
    var string = fs.readFileSync('./signin.html','utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else{
    response.statusCode = 400
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('找不到对应的路径，你需要自行修改')
    response.end()
  }
})

server.listen(port)
console.log('端口' + port + 'url: http://localhost:' + port)