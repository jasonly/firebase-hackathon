var myFirebaseRef = new Firebase("https://resplendent-torch-4021.firebaseio.com/");

//Jason's section
var maze = [ //1,1 === start 7 === finish 1 === wall 0 === open space
[1,1,1,1,1,1,1,1,1,1],
[1,2,1,0,1,1,1,1,1,1],
[1,0,1,0,0,0,0,0,0,1],
[1,0,1,0,1,1,0,1,0,1],
[1,0,1,0,0,0,0,1,0,1],
[1,0,1,0,1,1,0,1,0,1],
[1,0,1,0,1,0,0,1,0,1],
[1,0,1,1,0,0,1,0,0,1],
[1,0,1,0,0,1,1,0,1,1],
[1,0,0,0,1,0,1,0,7,1],
[1,1,1,1,1,1,1,1,1,1]
]

var displayMaze = function() {
  for (var i = 0; i < 11; i++) {
    console.log(maze[i]);
  }
};

displayMaze();


var Player = function(row, column){
  this.x = row;
  this.y = column;
};

//should check if move is valid
Player.prototype.checkMove = function(row, column){
  if(maze[row][column] === 1){
    console.log('invalid move');
    return false;
  } else if (maze[row][column] === 7){
    console.log('Yay!');
    return true;
  } else {
    console.log('moved to new place coordinates set')
    this.x = row;
    this.y = column;
    return true;
  }
};

//the move function should add or subtract from the player's position
Player.prototype.move = function(movement){
  if (movement !== undefined) {
      var dangMove = movement.toLowerCase();
      var oldrow = this.x;
      var oldcol = this.y;

      if(dangMove === 'up'){
        this.x--;
        if(!this.checkMove(this.x, this.y)){
          this.x++;
        }
      } else if (dangMove === 'down') {
        this.x++;
        if(!this.checkMove(this.x, this.y)){
          this.x--;
        }
      } else if (dangMove === 'left') {
        this.y--;
        if(!this.checkMove(this.x, this.y)){
          this.y++;
        }
      } else if (dangMove === 'right') {
        this.y++;
        if(!this.checkMove(this.x, this.y)){
          this.y--;
        }
      } else {
        console.log('Invalid command')
      }

      updateMaze(oldrow, oldcol);
  }
}

var updateMaze = function(oldrow, oldcol) {
  maze[oldrow][oldcol] = 0;
  maze[player.x][player.y] = 2;
  displayMaze();
};

var player = new Player(1,1);



// Kalev
// - Check for moves from firebase app
// - Add proposed moves to firebase app data structure
// - Add vote count to moves
// - Check for move with highest vote count
// - Allow users to submit and vote on moves

// data structure for proposed player moves
var movesArray = [];

// set the firebase data store to the proposed player moves
myFirebaseRef.set(movesArray);

// when the user enters a new move
// push it to the proposed player moves
// set the firebase data store to the proposed player moves

$('#moveInput').keypress(function (e) {
    if (e.keyCode === 13) {
        var move = $('#moveInput').val();
        // push new move to movesArray
        movesArray.push(move);
        // update firebase data store
        myFirebaseRef.set(movesArray);

    }
})

// whenever the firebase data store value changes
// update our array of moves
myFirebaseRef.on('value', function(data) {
  console.log("Firebase movesArray: " + data.val());
  if (data.val() !== null) {
    movesArray = data.val();
  }
  var proposedMove = movesArray[0];
  movesArray = movesArray.slice(1);
  console.log("updated movesArray: " + movesArray);
  console.log('attempting to move player ' + proposedMove);
  player.move(proposedMove);
});
