var sum = 0;

function onOpen() {

  var ui = SpreadsheetApp.getUi();

  ui.createMenu('G-SAME-GAME')
      .addItem('New Game', 'newBoard')
      .addToUi();
}

function newBoard() {
 
  var col;
  var row;
  var widMax = 19;
  var hiMax = 10;
  var ss = SpreadsheetApp.getActive().getSheetByName('SAME');
  var number;
  var gameBoard = [];
  var score = 0;

  for (row = 0; row <= hiMax; row++)
  {

    gameBoard[row] = [];

    for (col = 0; col <= widMax; col++)
    {

      number = Math.floor(Math.random() * 5) + 1;    
      
      switch(number){
        case 1:
          gameBoard[row][col] = "A";
          break;
        case 2:
          gameBoard[row][col] = "B";
          break;
        case 3:
          gameBoard[row][col] = "C";
          break;
        case 4:
          gameBoard[row][col] = "D";
          break;
        case 5:
          gameBoard[row][col] = "E";
          break;
        default:
          break;   
      }
    }
  }
  ss.getRange("B4:U14").setValues(gameBoard);
  ss.getRange("S2").setValue(score);
  ss.getRange("A1").setValue('');

}

function onSelectionChange(e){

  var ss = SpreadsheetApp.getActive().getSheetByName('SAME');
  var range = e.range;
  var boardCol = range.getColumn()-2;
  var boardRow = range.getRow()-4;
  var gameBoard = ss.getRange('B4:U14').getValues();
  var score = ss.getRange("S2").getValue();
  var homeRange = ss.getRange("S2");
  
  if (boardCol >= 0 && boardCol <= 19 && boardRow >= 0 && boardRow <= 11){
 
    var activeBlock = gameBoard[boardRow][boardCol];

    if (matchingBlocks(activeBlock, boardCol, boardRow, gameBoard) == true){

      if(activeBlock != ''){

        deleteBlocks(activeBlock, boardCol, boardRow, gameBoard);
        dropBlocks(gameBoard,ss);
        moveBlocks(gameBoard,ss);
        ss.setActiveRange(homeRange);
        ss.getRange("B4:U14").setValues(gameBoard);
        score+=Math.pow(sum-1,2);
        ss.getRange("S2").setValue(score);
        var gameOver = checkMoreMoves(gameBoard);

        if(gameOver){

          ss.getRange("A1").setValue("Game Over!");
        }
      }
    } 
  }
}

function checkMoreMoves(gameBoard){

  for (var row = 10; row > 0; row--){

    for (var col = 0; col < 19; col++){

      var checkBlock = gameBoard[row][col];

      if(checkBlock != '' && matchingBlocks(checkBlock, col, row, gameBoard)){

        return false;

      }

    }
  }
  return true;
}

function matchingBlocks(activeBlock, boardCol, boardRow, gameBoard){

  var matching = false;

	if (boardRow > 0) {
	  if(gameBoard[boardRow-1][boardCol] == activeBlock){
      matching = true;
      return matching;
    }
	}
	if (boardRow <  10) {
		if(gameBoard[boardRow+1][boardCol] == activeBlock){
      matching = true;
      return matching;
    }
	}
	if (boardCol > 0) {
		if(gameBoard[boardRow][boardCol-1] == activeBlock){
      matching = true;
      return matching;
    }
	}
	if (boardCol < 19) {
	  if(gameBoard[boardRow][boardCol+1] == activeBlock){
      matching = true;
      return matching;
    }
	}

}

function dropBlocks(gameBoard,ss){

  var row;
  var col;

  for (row = 0; row <= 10; row++){

    for (col = 19; col >= 0; col--){

      if(gameBoard[row][col] == ''){

        for (var colRow = row; colRow >= 0; colRow--){
          
          if (colRow > 0){
            gameBoard[colRow][col] = gameBoard[colRow-1][col];
          }
          else{
            gameBoard[colRow][col] = '';
          }
        }
      }      
    }
  }
}

function moveBlocks(gameBoard){

  var row = 10;
  var numEmpty = 0;

  for (var col = 0; col <= 19; col++){

    var rowCol = col;

    if (gameBoard[row][rowCol] == ''){

      while(gameBoard[row][rowCol] == ''){

          numEmpty++;
          rowCol++;

      } 

      if(rowCol <= 19){

        for(colRow = row; colRow >= 0; colRow--){

          gameBoard[colRow][col] = gameBoard[colRow][col+numEmpty];
          gameBoard[colRow][col + numEmpty] = '';

        }
      }
    }
    numEmpty = 0;
  }
}

function deleteBlocks(activeBlock, boardCol, boardRow, gameBoard){

  if (gameBoard[boardRow][boardCol] != activeBlock || gameBoard[boardRow][boardCol] == ''){
    
    return 0;

  }

  gameBoard[boardRow][boardCol] = '';
  sum++;
  
  if (boardCol > 0){
    deleteBlocks(activeBlock,boardCol-1,boardRow,gameBoard);
  }
  if (boardCol < 19){
    deleteBlocks(activeBlock,boardCol+1,boardRow,gameBoard);
  }
  if (boardRow > 0){
    deleteBlocks(activeBlock,boardCol,boardRow-1,gameBoard);
  }
  if (boardRow < 10){
    deleteBlocks(activeBlock,boardCol,boardRow+1,gameBoard);
  }

}
