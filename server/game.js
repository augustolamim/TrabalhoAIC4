const { GRID_SIZE, ENEMIES_ARRAY } = require('./constants');

module.exports = {
    createGameState,
    gameLoop,
    addEnemy,
}

function createGameState() {
    return {
        players: [
        {
            pos:{
                x: 3,
                y: 3,                
            },
            lastmove: "right",
            ammo: 3,
        },
        {
            pos:{
                x: 5,
                y: 5,
            },
            lastmove: "left",
            ammo: 3,         
        }
        ],        
        enemies:ENEMIES_ARRAY, 
        gridsize: GRID_SIZE,
        shots:[],
      }  
}
function addEnemy(state){
    state.enemies.push({x:GRID_SIZE/2, y:GRID_SIZE/2});
}
function gameLoop(state){
    if(!state){
        return;
    }
    
    const playerOne = state.players[0];
    const playerTwo = state.players[1];

    for(let cell of state.enemies){
        //encostou em um inimigo
        if(cell.y == playerOne.pos.y && cell.x == playerOne.pos.x){
            return 2;            
        }
        if(cell.y == playerTwo.pos.y && cell.x == playerTwo.pos.x){
            return 1;            
        }

        //movimento aleatório dos inimigos
        // para direita
        if(Math.floor(Math.random() * 4) == 0){
            if(!(cell.x == state.gridsize-1)){
                cell.x += 1;
            }
        }
        //para esquerda
        if(Math.floor(Math.random() * 4) == 1){
            if(!(cell.x == 0)){
                cell.x += -1;
            }
        }
        //para baixo
        if(Math.floor(Math.random() * 4) == 2){            
            if(!(cell.y == state.gridsize-1)){
                cell.y += 1;
            }              
        }
        // para cima
        if(Math.floor(Math.random() * 4) == 3){
            if(!(cell.y == 0)){
                cell.y += -1;
            } 
        }
    }
    for(let cell of state.shots){        
        
        //movimentação tiro
        
        if(cell.direction == "left"){
            cell.pos.x = cell.pos.x + cell.vel;
        }
        if(cell.direction == "right"){
            cell.pos.x = cell.pos.x + cell.vel;
        }
        if(cell.direction == "up"){
            cell.pos.y = cell.pos.y + cell.vel;
        }
        if(cell.direction == "down"){
            cell.pos.y = cell.pos.y + cell.vel;
        }
        
        //checar se tocou em um player
        if(cell.pos.y == playerOne.pos.y && cell.pos.x == playerOne.pos.x){
            return 2;            
        }
        if(cell.pos.y == playerTwo.pos.y && cell.pos.x == playerTwo.pos.x){
            return 1;            
        }
    }
    return false;
    
}


