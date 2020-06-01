
var express = require("express");
var app = express();
app.use(express.static("public"));
//server
app.set("view engine","ejs");
app.set("views","./views");

var server=require("http").Server(app);
var io= require("socket.io")(server);
server.listen(3000);
//Khởi tạo mảng listUserOnline
listUserOnline =[];
//Listen connection
io.on("connection",function(socket){
    console.log("Có người vừa kết nối, socket id:"+socket.id);
    //server nhận đăng ký từ client
    socket.on("client_send_username",function(data){
        console.log("Có người đăng ký với username là: "+data); 
        if(listUserOnline.indexOf(data)>=0){
            //gửi đăng ký thất bại cho client
            socket.emit("server_send_register_false",data); 
        }
        else{
            listUserOnline.push(data);
            //gửi đăng ký thành công cho tất form client-bảo gồm username và socket id
            io.sockets.emit("server_send_register_successful",{username:data,id:socket.id});
            socket.username=data;
            //chỉ gửi cho client vừa đăng ký socket id của nó
            socket.emit("server_send_socket_id",{id_socket:socket.id});
        }
    });
    socket.on("client_send_message",function(data){
        io.sockets.emit("server_send_message",{Username:socket.username,msg:data});
    });
    socket.on("user_choc_socketid_khac",function(data){
        io.to(data).emit("server_xu_ly_choc",socket.username);
    });
});
app.get("/",function(rep,res){
    res.render("home");
})  