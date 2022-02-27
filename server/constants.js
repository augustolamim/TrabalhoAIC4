const FRAME_RATE = 60;
const GRID_SIZE = 50;

const ENEMIES_ARRAY = [];

for(let i = 0; i<10; i++){
    ENEMIES_ARRAY.push({x:GRID_SIZE/2, y:GRID_SIZE/2});
}
module.exports = {
    FRAME_RATE,
    GRID_SIZE,
    ENEMIES_ARRAY,
}
