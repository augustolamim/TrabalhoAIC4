const BG_COLOUR = '#808080';
const ENEMIES_COLOUR ="#FF0000";
const SHOTS_COLOUR ="#FFFFFF";
const GRID_SIZE = 50;

const socket = io('http://localhost:3000');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);
socket.on('tooManyPlayers', handleTooManyPlayers);


const player1_standing_up = document.getElementById("player1_standing_up");
const player1_standing_right = document.getElementById("player1_standing_right");
const player1_standing_down = document.getElementById("player1_standing_down");
const player1_standing_left = document.getElementById("player1_standing_left");
const player1_running1_up = document.getElementById("player1_running1_up");
const player1_running1_right = document.getElementById("player1_running1_right"); 
const player1_running1_down = document.getElementById("player1_running1_down"); 
const player1_running1_left = document.getElementById("player1_running1_left");
const player1_running2_up = document.getElementById("player1_running2_up");
const player1_running2_right = document.getElementById("player1_running2_right"); 
const player1_running2_down = document.getElementById("player1_running2_down"); 
const player1_running2_left = document.getElementById("player1_running2_left");

const player2_standing_up = document.getElementById("player2_standing_up");
const player2_standing_right = document.getElementById("player2_standing_right");
const player2_standing_down = document.getElementById("player2_standing_down");
const player2_standing_left = document.getElementById("player2_standing_left");
const player2_running1_up = document.getElementById("player2_running1_up");
const player2_running1_right = document.getElementById("player2_running1_right"); 
const player2_running1_down = document.getElementById("player2_running1_down"); 
const player2_running1_left = document.getElementById("player2_running1_left");
const player2_running2_up = document.getElementById("player2_running2_up");
const player2_running2_right = document.getElementById("player2_running2_right"); 
const player2_running2_down = document.getElementById("player2_running2_down"); 
const player2_running2_left = document.getElementById("player2_running2_left");

let player1lastposx =3;
let player1lastposy =3;
let player1lastmove =1;
let player2lastposx =5;
let player2lastposy =5;
let player2lastmove =1;  

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameButton = document.getElementById('newGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameButton.addEventListener('click', newGame);
joinGameButton.addEventListener('click', joinGame);

function newGame(){
  socket.emit('newGame');
  init();
}
function joinGame(){
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  init();
}
let canvas, ctx;
let playerNumber;
let gameActive = false;

function init(){
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.width =  800;
  canvas.height = 800;
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0,0, canvas.width, canvas.height);

  document.addEventListener('keydown', keydown);

  gameActive = true;
 
}
function keydown(e){
  socket.emit('keydown', e.keyCode);
}

function paintGame(state){  
  
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0,0,canvas.width, canvas.height);

  
  const gridsize = state.gridsize;
  const size = canvas.width/gridsize;
  
  ctx.fillStyle = ENEMIES_COLOUR;
  for(let cell of state.enemies){
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
  ctx.fillStyle = SHOTS_COLOUR;
  for(let cell of state.shots){
    ctx.fillRect(cell.pos.x * size, cell.pos.y * size, size, size);
  }
  
  paintPlayer1(state.players[0], size);
  paintPlayer2(state.players[1], size);
  
}



function paintPlayer1(playerState, size){
  
  
  const playerpos = playerState.pos;
  const playerlastmove = playerState.lastmove;  
  //movimentação para direita  
  if(playerpos.x == player1lastposx && playerpos.y == player1lastposy && playerlastmove=="right"){
    
    ctx.drawImage(player1_standing_right, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "right";
  }
  if(playerpos.x > player1lastposx && playerpos.y == player1lastposy && playerlastmove=="right" && playerpos.x == GRID_SIZE-1){
    
    ctx.drawImage(player1_standing_right, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "right";
  }
  if(playerpos.x > player1lastposx && playerpos.y == player1lastposy && playerpos.x < GRID_SIZE-1){
    console.log("entrou");
    if(playerState.lastmove!="right"){
      player1lastmove=1;
    }
    switch (player1lastmove) {
      case 0:
        ctx.drawImage(player1_standing_right, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "right";
        player1lastmove = 1;        
        break;
      case 1:
        ctx.drawImage(player1_running1_right, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "right";
        player1lastmove = 2;
        break;
      case 2:
        ctx.drawImage(player1_running2_right, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "right";
        player1lastmove = 1;        
        break; 
    }        
  }
     
  //movimentação para esquerda
  if(playerpos.x == player1lastposx && playerpos.y == player1lastposy && playerlastmove=="left"){
    ctx.drawImage(player1_standing_left, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "left";
  }
  if(playerpos.x < player1lastposx && playerpos.y == player1lastposy && playerlastmove=="left" && playerpos.x == 0){
    ctx.drawImage(player1_standing_left, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "left";
  }
  if(playerpos.x < player1lastposx && playerpos.y == player1lastposy  && playerpos.x > 0){
    if(playerState.lastmove!="left"){
      player1lastmove=1;
    }
    switch (player1lastmove) {
      case 0:
        ctx.drawImage(player1_standing_left, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "left";
        player1lastmove = 1;        
        break;
      case 1:
        ctx.drawImage(player1_running1_left, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "left";
        player1lastmove = 2;
        break;
      case 2:
        ctx.drawImage(player1_running2_left, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "left";
        player1lastmove = 1;        
        break; 
    }        
  }

  //movimentação para cima
  if(playerpos.x == player1lastposx && playerpos.y == player1lastposy && playerlastmove=="up"){
    ctx.drawImage(player1_standing_down, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "up";
  }
  if(playerpos.x == player1lastposx && playerpos.y < player1lastposy && playerlastmove=="up" && playerpos.y == 0){
    ctx.drawImage(player1_standing_down, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "up";
  }
  if(playerpos.x == player1lastposx && playerpos.y < player1lastposy  && playerpos.y > 0){
    if(playerState.lastmove!="up"){
      player1lastmove=1;
    }
    switch (player1lastmove) {
      case 0:
        ctx.drawImage(player1_standing_up, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "up";
        player1lastmove = 1;        
        break;
      case 1:
        ctx.drawImage(player1_running1_up, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "up";
        player1lastmove = 2;
        break;
      case 2:
        ctx.drawImage(player1_running2_up, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "up";
        player1lastmove = 1;        
        break; 
    }        
  }

  //movimentação para baixo
  if(playerpos.x == player1lastposx && playerpos.y == player1lastposy && playerlastmove=="down"){
    ctx.drawImage(player1_standing_up, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "down";
  }
  if(playerpos.x == player1lastposx && playerpos.y > player1lastposy && playerlastmove=="down" && playerpos.y == GRID_SIZE-1){
    ctx.drawImage(player1_standing_up, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "down";
  }
  if(playerpos.x == player1lastposx && playerpos.y > player1lastposy  && playerpos.y < GRID_SIZE-1){
    if(playerState.lastmove!="down"){
      player1lastmove=1;
    }
    switch (player1lastmove) {
      case 0:
        ctx.drawImage(player1_standing_down, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "down";
        player1lastmove = 1;        
        break;
      case 1:
        ctx.drawImage(player1_running1_down, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "down";
        player1lastmove = 2;
        break;
      case 2:
        ctx.drawImage(player1_running2_down, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "down";
        player1lastmove = 1;        
        break; 
    }        
  }
  
  player1lastposy = playerpos.y;
  player1lastposx = playerpos.x;
}



function paintPlayer2(playerState, size, colour){
  const playerpos = playerState.pos;
  const playerlastmove = playerState.lastmove;  
  //movimentação para direita  
  if(playerpos.x == player2lastposx && playerpos.y == player2lastposy && playerlastmove=="right"){
    
    ctx.drawImage(player2_standing_right, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "right";
  }
  if(playerpos.x > player2lastposx && playerpos.y == player2lastposy && playerlastmove=="right" && playerpos.x == GRID_SIZE-1){
    
    ctx.drawImage(player2_standing_right, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "right";
  }
  if(playerpos.x > player2lastposx && playerpos.y == player2lastposy && playerpos.x < GRID_SIZE-1){
    console.log("entrou");
    if(playerState.lastmove!="right"){
      player2lastmove=1;
    }
    switch (player2lastmove) {
      case 0:
        ctx.drawImage(player2_standing_right, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "right";
        player2lastmove = 1;        
        break;
      case 1:
        ctx.drawImage(player2_running1_right, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "right";
        player2lastmove = 2;
        break;
      case 2:
        ctx.drawImage(player2_running2_right, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "right";
        player2lastmove = 1;        
        break; 
    }        
  }
     
  //movimentação para esquerda
  if(playerpos.x == player2lastposx && playerpos.y == player2lastposy && playerlastmove=="left"){
    ctx.drawImage(player2_standing_left, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "left";
  }
  if(playerpos.x < player2lastposx && playerpos.y == player2lastposy && playerlastmove=="left" && playerpos.x == 0){
    ctx.drawImage(player2_standing_left, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "left";
  }
  if(playerpos.x < player2lastposx && playerpos.y == player2lastposy  && playerpos.x > 0){
    if(playerState.lastmove!="left"){
      player2lastmove=1;
    }
    switch (player2lastmove) {
      case 0:
        ctx.drawImage(player2_standing_left, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "left";
        player2lastmove = 1;        
        break;
      case 1:
        ctx.drawImage(player2_running1_left, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "left";
        player2lastmove = 2;
        break;
      case 2:
        ctx.drawImage(player2_running2_left, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "left";
        player2lastmove = 1;        
        break; 
    }        
  }

  //movimentação para cima
  if(playerpos.x == player2lastposx && playerpos.y == player2lastposy && playerlastmove=="up"){
    ctx.drawImage(player2_standing_down, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "up";
  }
  if(playerpos.x == player2lastposx && playerpos.y < player2lastposy && playerlastmove=="up" && playerpos.y == 0){
    ctx.drawImage(player2_standing_down, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "up";
  }
  if(playerpos.x == player2lastposx && playerpos.y < player2lastposy  && playerpos.y > 0){
    if(playerState.lastmove!="up"){
      player2lastmove=1;
    }
    switch (player2lastmove) {
      case 0:
        ctx.drawImage(player2_standing_up, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "up";
        player2lastmove = 1;        
        break;
      case 1:
        ctx.drawImage(player2_running1_up, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "up";
        player2lastmove = 2;
        break;
      case 2:
        ctx.drawImage(player2_running2_up, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "up";
        player2lastmove = 1;        
        break; 
    }        
  }

  //movimentação para baixo
  if(playerpos.x == player2lastposx && playerpos.y == player2lastposy && playerlastmove=="down"){
    ctx.drawImage(player2_standing_up, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "down";
  }
  if(playerpos.x == player2lastposx && playerpos.y > player2lastposy && playerlastmove=="down" && playerpos.y == GRID_SIZE-1){
    ctx.drawImage(player2_standing_up, playerpos.x * size, playerpos.y * size);
    playerState.lastmove = "down";
  }
  if(playerpos.x == player2lastposx && playerpos.y > player2lastposy  && playerpos.y < GRID_SIZE-1){
    if(playerState.lastmove!="down"){
      player2lastmove=1;
    }
    switch (player2lastmove) {
      case 0:
        ctx.drawImage(player2_standing_down, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "down";
        player2lastmove = 1;        
        break;
      case 1:
        ctx.drawImage(player2_running1_down, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "down";
        player2lastmove = 2;
        break;
      case 2:
        ctx.drawImage(player2_running2_down, playerpos.x * size, playerpos.y * size);
        playerState.lastmove = "down";
        player2lastmove = 1;        
        break; 
    }        
  }
  
  player2lastposy = playerpos.y;
  player2lastposx = playerpos.x;
  
}



function handleInit(number){
  playerNumber = number;
  
}

function handleGameState(gameState){ 
  if(!gameActive){
    return;
  }
  requestAnimationFrame(()=>paintGame(gameState));
}

function handleGameOver(data){ 
  if(!gameActive){
    return;
  }
  if(data.winner === playerNumber){
    alert("Vitória!");
  }else{
    alert("Derrota!");
  }
  gameActive = false; 
}

function handleGameCode(gameCode){
  gameCodeDisplay.innerText= gameCode;
}

function handleUnknownGame(){
  reset();
  alert("Jogo desconhecido");
}
function handleTooManyPlayers(){
  reset();
  alert("Esse jogo já está em andamento");
}

function reset(){
  playerNumber = null;
  gameCodeInput.value = "";
  gameCodeDisplay.innerText= "";
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}