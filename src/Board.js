// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {
  window.Board = Backbone.Model.extend({
    initialize: function(params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log(
          "Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:"
        );
        console.log(
          "\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: grey;"
        );
        console.log(
          "\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: grey;"
        );
      } else if (params.hasOwnProperty("n")) {
        this.set(makeEmptyMatrix(this.get("n")));
      } else {
        this.set("n", params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get("n"))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex];
      this.trigger("change");
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(
          this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)
        ) ||
        this.hasMinorDiagonalConflictAt(
          this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex)
        )
      );
    },

    hasAnyQueensConflicts: function() {
      return (
        this.hasAnyRooksConflicts() ||
        this.hasAnyMajorDiagonalConflicts() ||
        this.hasAnyMinorDiagonalConflicts()
      );
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex &&
        rowIndex < this.get("n") &&
        0 <= colIndex &&
        colIndex < this.get("n")
      );
    },

    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // if Board[rowindex].includes(1)
      // return true
      // else return false;
      // if (this.rows(rowIndex).includes(1)) {
      //   return true;
      // }

      let rowCount = 0;
      let returnVal = false;

      this.rows()[rowIndex].forEach(item => {
        if (item === 1) {
          if (rowCount > 0) {
            returnVal = true;
          }

          rowCount++;
        }
      });

      return returnVal;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      let returnVal = false;
      this.rows().forEach((row, rowIndex) => {
        if (this.hasRowConflictAt(rowIndex)) {
          returnVal = true;
        }
      });

      return returnVal;
      // Board.forEach(row)
      // if hasRowConflict at row[i] return true
      // return false
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      let colCount = 0;
      let returnVal = false;

      this.rows().forEach((row, rowIndex) => {
        if (this.rows()[rowIndex][colIndex] === 1) {
          if (colCount > 0) {
            returnVal = true;
          }

          colCount++;
        }
      });

      return returnVal;
      // rowforEach(row) =>
      // if(row[i].includes(1) return true
      // return false
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      let returnVal = false;
      if (this.rows().length === 0) {
        return false;
      }

      this.rows()[0].forEach((col, colIndex) => {
        if (this.hasColConflictAt(colIndex)) {
          returnVal = true;
        }
      });

      return returnVal;

      // row.forEach(row)
      // column,forEach(col)
      // if (hasConflictAt(col)) return true
      // return false
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(
      majorDiagonalColumnIndexAtFirstRow,
      rowCount = 0
    ) {
      if (rowCount === this.rows().length - 1) return false;

      let returnVal = false;
      let conflictCount = 0;
      let diagonalIndex = majorDiagonalColumnIndexAtFirstRow;
      this.rows()
        .slice(rowCount)
        .forEach((row, rowIndex, list) => {
          if (diagonalIndex < list[rowIndex].length) {
            if (list[rowIndex][diagonalIndex] === 1) {
              if (conflictCount > 0) {
                returnVal = true;
              }

              conflictCount++;
            }
            diagonalIndex++;
          }
        });

      return returnVal;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      let returnVal = false;

      this.rows().forEach((row, rowIndex) => {
        if (!returnVal) {
          if (this.rows()[rowIndex].includes(1)) {
            this.rows()[rowIndex].forEach((col, colIndex) => {
              if (this.rows()[rowIndex][colIndex] === 1) {
                if (this.hasMajorDiagonalConflictAt(colIndex, rowIndex)) {
                  returnVal = true;
                }
              }
            });
          }
        }
      });
      return returnVal;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(
      minorDiagonalColumnIndexAtFirstRow,
      rowCount = 0
    ) {
      if (rowCount === this.rows().length - 1) return false;

      let returnVal = false;
      let conflictCount = 0;
      let diagonalIndex = minorDiagonalColumnIndexAtFirstRow;

      this.rows()
        .slice(rowCount)
        .forEach((row, rowIndex, list) => {
          if (diagonalIndex >= 0) {
            if (list[rowIndex][diagonalIndex] === 1) {
              if (conflictCount > 0) {
                returnVal = true;
              }

              conflictCount++;
            }
            diagonalIndex--;
          }
        });

      return returnVal;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      // console.log(this.rows());
      let returnVal = false;

      this.rows().forEach((row, rowIndex) => {
        if (!returnVal) {
          if (this.rows()[rowIndex].includes(1)) {
            this.rows()[rowIndex].forEach((col, colIndex) => {
              if (this.hasMinorDiagonalConflictAt(colIndex, rowIndex)) {
                returnVal = true;
              }
            });
          }
        }
      });

      return returnVal;
    }

    /*--------------------  End of Helper Functions  ---------------------*/
  });

  window.makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };
})();
