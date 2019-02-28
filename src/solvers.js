/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var newMatrix = makeEmptyMatrix(n);
  var newBoard = new Board(newMatrix);
  var rooksAdded = 0;

  newBoard.rows().forEach((row, rowIndex) => {
    newBoard.rows()[rowIndex].forEach((item, colIndex) => {
      newBoard.togglePiece(rowIndex, colIndex);
      if (newBoard.hasAnyRooksConflicts()) {
        newBoard.togglePiece(rowIndex, colIndex);
      } else {
        rooksAdded++;
      }
    });
  });

  var solution = false;
  if (rooksAdded === n) {
    solution = newBoard.rows();
  }

  console.log("Single solution for " + n + " rooks:", JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log("Number of solutions for " + n + " rooks:", solutionCount);
  return solutionCount;
};

const returnNewPosition = ([row, column], n) => {
  if (column === n - 1) return [row + 1, 0];
  // if (column === n - 1 && row === n - 1) return [0, 0];
  return [row, column + 1];
};
// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  /* 
  
  Start at 0, 0
    - Go until first square that works
    - Repeat until the end 
    - If count < n
      - Backtrack, starting at the last thing we placed
        - Iterate forward, try all those solution
        - If count < n, rinse and repeat until we have backtracked

  */

  var newMatrix = makeEmptyMatrix(n);
  var emptyMatrix = makeEmptyMatrix(n);
  var newBoard = new Board(newMatrix);
  var queensAdded = 0;
  var solutionsArray = [];

  if (n === 0) {
    return newMatrix;
  }
  if (n === 1) {
    return [[1]];
  }

  var recurseBoard = function(gameState = [], lastMove = null) {
    if (
      n > 1 &&
      gameState.length === 0 &&
      lastMove !== null &&
      lastMove[0] === n - 1
    ) {
      return emptyMatrix;
    }

    let startRow = 0;
    let startColumn = 0;

    if (lastMove !== null) {
      [startRow, startColumn] = returnNewPosition(lastMove, n);
    }

    // Try to add a piece
    for (let rowIndex = 0; rowIndex < n; rowIndex++) {
      if (rowIndex >= startRow) {
        for (let colIndex = 0; colIndex < n; colIndex++) {
          if (colIndex >= startColumn) {
            newBoard.togglePiece(rowIndex, colIndex);
            if (newBoard.hasAnyQueenConflictsOn(rowIndex, colIndex)) {
              newBoard.togglePiece(rowIndex, colIndex);
            } else {
              lastMove = [rowIndex, colIndex];
              gameState.push(lastMove);
              queensAdded++;
            }
          }

          if (colIndex === n - 1) {
            startColumn = 0;
          }
        }
      }
    }

    //backtrack
    if (queensAdded < n) {
      queensAdded--;
      lastMove = gameState.pop();
      newBoard.togglePiece(...lastMove);
      return recurseBoard(gameState, [lastMove[0], lastMove[1] + 1]);
    } else {
      return newBoard.rows();
      // solutionsArray.push(newBoard.rows());
      // const firstMove = gameState[0];
    }
  };

  var solution = recurseBoard();

  console.log(
    "Single solution for " + n + " queens:",
    JSON.stringify(solution)
  );

  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var newMatrix = makeEmptyMatrix(n);
  var emptyMatrix = makeEmptyMatrix(n);
  var newBoard = new Board(newMatrix);
  var queensAdded = 0;
  var solutionsArray = [];

  if (n === 0 || n === 1) {
    return 1;
  }

  var recurseBoard = function(gameState = [], lastMove = null) {
    if (gameState.length === 0 && lastMove !== null && lastMove[0] === n - 1) {
      return emptyMatrix;
    }

    if (gameState.length === 1 && gameState[0][0] === n - 1) {
      return emptyMatrix;
    }

    let startRow = 0;
    let startColumn = 0;

    if (lastMove !== null) {
      [startRow, startColumn] = returnNewPosition(lastMove, n);
    }

    // Try to add a piece
    for (let rowIndex = 0; rowIndex < n; rowIndex++) {
      if (rowIndex >= startRow) {
        for (let colIndex = 0; colIndex < n; colIndex++) {
          if (colIndex >= startColumn) {
            newBoard.togglePiece(rowIndex, colIndex);
            if (newBoard.hasAnyQueenConflictsOn(rowIndex, colIndex)) {
              newBoard.togglePiece(rowIndex, colIndex);
            } else {
              lastMove = [rowIndex, colIndex];
              gameState.push(lastMove);
              queensAdded++;
              startRow++;
              startColumn = 0;
            }
          }

          if (colIndex === n - 1) {
            startColumn = 0;
          }
        }
      }
    }

    // Backtrack
    if (queensAdded === n) {
      solutionsArray.push(newBoard.rows());
    }

    queensAdded--;
    lastMove = gameState.pop();
    newBoard.togglePiece(...lastMove);
    const [row, column] = lastMove;
    return recurseBoard(gameState, [row, column]);
  };

  recurseBoard();

  const solutionCount = solutionsArray.length;
  console.log("Number of solutions for " + n + " queens:", solutionCount);
  return solutionCount;
};
