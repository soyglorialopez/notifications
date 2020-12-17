const http = require('http');
const  socket =  require('socket.io');
const fs = require('fs');
const log =  console.log;
const path = './index.html';

function routes(req, res){
   if(req.url == '/'){
       fs.readFile(path, (err, content) => {
       
           if(err){
               log('[ERROR]', err);
               res.statusCode = 500
               res.end('Internal Error')
           }
           
           res.end(content)
       })
   }else if(req.url == '/push.min.js'){
       let file = fs.readFileSync('./push.min.js')
     res.end(file)
   }
}

const server = http.createServer(routes);

const io = new socket.Server(server);

io.on('connection', (socket) => {
    socket.on('notification active', () => {
        socket.join('notification');
       io.to('notification').emit('news', {
           title: 'thanks for subscribing',
           body:'You will receive news from us :)'
       })
    });

    socket.on('unsubscribed', () => {
        socket.leave('notification');
    });
})

server.listen(3000, () => {
    log('Server initialized')
});