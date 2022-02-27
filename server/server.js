const express = require("express");


const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const { createGameState, gameLoop, addEnemy } = require("./game");
const { makeid } = require("./util");
const { FRAME_RATE, GRID_SIZE} = require('./constants');
const { stringify } = require("querystring");


const state = {};
const clientRooms = {};

io.on('connection', client =>{
    
    
    client.on('keydown', handleKeydown);
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);

    function handleJoinGame(gameCode){
        const room = io.sockets.adapter.rooms[gameCode];
        let allUsers;
        if(room){
            allUsers = room.sockets;
        }
        let numClients = 0;
        if(allUsers){
            numClients = Object.keys(allUsers).length;
        }
        if(numClients === 0){
            client.emit('unknownGame');
            return;
        }else if(numClients >1){
            client.emit('tooManyPlayers');
        }
        clientRooms[client.id] = gameCode;

        client.join(gameCode);
        client.number = 2;
        client.emit('init', 2);

        startGameInterval(gameCode);
    }

    function handleNewGame(){
       let roomName = makeid(5); 
       clientRooms[client.id] = roomName;
       client.emit('gameCode', roomName);

       state[roomName] = createGameState();
       
       client.join(roomName);
       client.number = 1;
       client.emit('init', 1);
    }

    function handleKeydown(keyCode){        
        const roomName = clientRooms[client.id];
        
        
        if(!roomName){
            return;
        }
        let shotDirection = state[roomName].players[client.number - 1].lastmove;            
        let shotX;
        let shotY;
        let shotVel;
        //para atirar
        if(keyCode == 32){
            if(shotDirection=="left"){
                shotX= state[roomName].players[client.number - 1].pos.x - 1;
                shotY= state[roomName].players[client.number - 1].pos.y;
                shotVel=-1;
            }
            if(shotDirection=="right"){
                shotX= state[roomName].players[client.number - 1].pos.x + 1;
                shotY= state[roomName].players[client.number - 1].pos.y;   
                shotVel=1;           
            }
            if(shotDirection=="down"){
                shotX= state[roomName].players[client.number - 1].pos.x;
                shotY= state[roomName].players[client.number - 1].pos.y - 1; 
                shotVel=-1;
            }
            if(shotDirection=="up"){
                shotX= state[roomName].players[client.number - 1].pos.x;
                shotY= state[roomName].players[client.number - 1].pos.y + 1;
                shotVel=1;
            }
            
            state[roomName].shots.push(
                {
                    pos:{
                        x: shotX,
                        y: shotY,                
                    },
                    vel: shotVel,
                    direction: shotDirection,
                }
                );
            
        }
        //para cima
        if(keyCode == 40 || keyCode == 83){
            if(state[roomName].players[client.number - 1].pos.y == GRID_SIZE-3){
                state[roomName].players[client.number - 1].lastmove = "up";
            }else{
                state[roomName].players[client.number - 1].pos.y +=1;
                state[roomName].players[client.number - 1].lastmove = "up";
            }            
        }        
        //para baixo
        if(keyCode == 38 || keyCode == 87){
            if(state[roomName].players[client.number - 1].pos.y == 0){
                state[roomName].players[client.number - 1].lastmove = "down";
            }else{
                state[roomName].players[client.number - 1].pos.y +=-1;
                state[roomName].players[client.number - 1].lastmove = "down";
            } 
        }
        
        //para direita
        if(keyCode == 39 || keyCode == 68){
            if(state[roomName].players[client.number - 1].pos.x == GRID_SIZE-3){
                state[roomName].players[client.number - 1].lastmove = "right";
            }else{
                state[roomName].players[client.number - 1].pos.x +=1;
                state[roomName].players[client.number - 1].lastmove = "right";
            } 
        }
        
        //para esquerda
        if(keyCode == 37 || keyCode == 65){
            if(state[roomName].players[client.number - 1].pos.x == 0){
                state[roomName].players[client.number - 1].lastmove = "left";
            }else{
                state[roomName].players[client.number - 1].pos.x +=-1;
                state[roomName].players[client.number - 1].lastmove = "left";
            } 
        }              
    }
    
});

function startGameInterval(roomName){
    const intervalId = setInterval(() =>{          
        const winner = gameLoop(state[roomName]);        
        if(!winner){
            emitGameState(roomName, state[roomName]);            
        }else{
            emitGameOver(roomName, winner);
            state[roomName] = null;           
            clearInterval(intervalId);
        }     
          
        let teste = Math.floor(intervalId._idleStart/1000);
        if(teste == 30 || teste == 60 || teste == 90){                      
            addEnemy(state[roomName]);
        }
        //console.log(Math.floor(intervalId._idleStart/1000));
    }, 1000 / FRAME_RATE )
    
}

function emitGameState(roomName, state){
    io.sockets.in(roomName)
    .emit('gameState', state)
}

function emitGameOver(roomName, winner){
    io.sockets.in(roomName)
    .emit('gameOver', {winner});
}
server.listen(3000);