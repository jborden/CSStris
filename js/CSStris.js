/* reserve global namespace */
var tetris = {};
tetris.piece = {};

/**
 * Board class
 * 
 */
tetris.board = function () {
    this.rowMax = 17;
    this.colMax = 9;
    this.emptyBlock = { color: 0, state: 0, center: 0 }; // object for an empty block
    // create a multidimensional grid for the board
    this.grid = new Array(10);
    for (var col = 0; col < this.grid.length; col++) {
	this.grid[col] = new Array(19);
    }
    /**
     * Reset the multi-dimensional grid
     */ 
    this.resetGrid = function () {
	for (var col = 0; col < this.grid.length; col++) {
	    for (var row = 0; row < this.grid[col].length; row++) {
		this.grid[col][row] = { color: 0, state: 0, center: 0}; // each element is an object, with color and state and a possible center property
	    }
	}
    }
    this.resetGrid();
    // Initialize the screen, drawing the blocks which we will use as pixels.
    for( var row = 17; row >= 0; row--)
    {
	for( var col = 0; col <= 9; col++)
	{
	    $('<div id=\"grid[' + col + '][' + row + ']\" class=\"empty block"></div>').appendTo('#board');
	} 
    }

   
    // Initialize the next screen
    for ( var row = 0; row <= 1; row++)
    {
	for ( var col = 0; col <= 3; col++)
	{
	    $('<div id=\"next[' + col + '][' + row + ']\" class=\"emptyNext block"></div>').appendTo('#next');
	}
    }
    /**
     * Insert a new piece
     * @return true if new piece can be inserted, false otherwise
     */
    this.insertPiece = function (piece) {
	for( var row = 0; row < piece.matrix.length; row++)
	{
	    for( var col = 0; col < piece.matrix[row].length; col++)
	    {
		if (this.grid[col + 3][this.grid[row].length  - 2 - row].color == this.emptyBlock.color) {  // is the space empty?
		    this.grid[col + 3][this.grid[row].length - 2 - row].color = piece.matrix[row][col].color; // off center the grid by 3 pieces, color is based upon piece
		    this.grid[col + 3][this.grid[row].length - 2 - row].center = piece.matrix[row][ col].center; // set the center to the pieces center
		    if (piece.matrix[row][col].color > this.emptyBlock.color) {               // is the block piece non-empty?
			this.grid[col + 3][this.grid[row].length  - 2 - row].state = 1;                  // set the block grid to active 
		    }
		} else { return false; }                        // return false, a new piece does not have room to enter play
		board.draw(); // draw the board
	    }
	}
	board.draw(); 
	return true; // the piece can fit blah
    };
   

    /**
     * Draw the current board view for the player
     */  
    this.draw = function () {
	for( var i = this.grid.length - 1; i >= 0; i--)
	{
	    for( var j = 0; j < this.grid[i].length; j++)
	    {
		var color;
		var element = '#grid\\[' + i + '\\]\\[' + j + '\\]';
		if (this.grid[i][j].color == 0)
		{
		    color = "empty";
		} else {
		    color = this.getColor(this.grid[i][j].color);
		}

		$(element).removeClass();
		$(element).addClass(color);
		$(element).addClass("block");

	    } 
	}
    };
     /**
     * Show the next piece
     */
    this.drawNextPiece = function (piece) {
	for( var row = 0; row < piece.matrix.length; row++)
	{
	    for( var col = 0; col < piece.matrix[row].length; col++)
	    {
		var color;
		var element = '#next\\[' + col + '\\]\\[' + row + '\\]';
		if (piece.matrix[row][col].color == 0)
		{
		    color = "emptyNext";
		} else {
		    color = this.getColor(piece.matrix[row][col].color);
		}

		$(element).removeClass();
		$(element).addClass(color);
		$(element).addClass("block");
	    } 
	}
    }
    /**
     * Clear the screen out
     */
    this.clearScreen = function () {
	var element;
	for( var row = 17; row >= 0; row--)
	{
	    for( var col = 0; col <= 9; col++)
	    {
		element = '#grid\\[' + col + '\\]\\[' + row + '\\]';
		$(element).removeClass();
		$(element).addClass("block");
		$(element).addClass("empty");
		
	    } 
	}
    }
    /**
     * Push piece down one line
     * @return boolean TRUE if piece is pushed down, FALSE if piece can not be pushed down further
     */
    this.pushDown = function () {
	if(!this.roomBelow()) {  // is there not any more room for the piece to go down?
	    this.resetStates();  // if there isn't anymore room, reset all the pieces
	    return false;        // the piece can no longer be pushed down, return false
	}
	    
	for( var col = 0; col < this.grid.length; col++) // Starting from the first col working our way right
	{
	    for( var row = 0; row < this.grid[col].length; row++) // starting from the bottom, working our way up
	    {
		if (this.grid[col][row].state == 1) {                            // Are we looking at an active block?
		    // move the current block down one row
		    this.grid[col][row - 1].color = this.grid[col][row].color;           
		    this.grid[col][row - 1].state = this.grid[col][row].state;
		    this.grid[col][row - 1].center = this.grid[col][row].center;
		    // make the current block empty
		    this.grid[col][row].color = this.emptyBlock.color;
		    this.grid[col][row].state = this.emptyBlock.state;
		    this.grid[col][row].center = this.emptyBlock.center;

		}
	    }
	}
	this.draw();
  	return true;
    };
	
    /**
     * Push the piece to the left side
     * @return    boolean true if piece is pushed to the side, false otherwise
     */
    this.pushToLeft = function () {
	var sideCol = -1;

	if (!this.roomSide('left')) { // is there not any room to push this piece to the side?
	    return false;
	}

	for( var col = 0; col < this.grid.length; col++) // starting from the right col working our way left
	{
	    for( var row = 0; row < this.grid[col].length; row++) // starting from the bottom row working our way up
	    {
		if (this.grid[col][row].state == 1) { // Are we looking at an active block?
		    this.grid[col + sideCol][row].color = this.grid[col][row].color;           // move the current block to the side one coloumn
		    this.grid[col + sideCol][row].state = this.grid[col][row].state;
		    this.grid[col + sideCol][row].center = this.grid[col][row].center;
		    this.grid[col][row].color = this.emptyBlock.color;   // make the "hole" an empty block
		    this.grid[col][row].state = this.emptyBlock.state; 
		    this.grid[col][row].center = this.emptyBlock.center;
		}
	    }
	}
	this.draw();
	return true;
    }
    
  /**
     * Push the piece to the left side
     * @return    boolean true if piece is pushed to the side, false otherwise
     */
    this.pushToRight = function () {
	var sideCol = 1;

	if (!this.roomSide('right')) { // is there not any room to push this piece to the side?
	    return false;
	}

	for( var col = (this.grid.length - 1); col >= 0; col--) // Starting from the right coloumn working our way left
	{
	    for( var row = 0; row < this.grid[col].length; row++) // starting from the bottom row working our way up
	    {
		if (this.grid[col][row].state == 1) { // Are we looking at an active block?
		    this.grid[col + sideCol][row].color = this.grid[col][row].color;           // move the current block to the side one coloumn
		    this.grid[col + sideCol][row].state = this.grid[col][row].state;
		    this.grid[col + sideCol][row].center = this.grid[col][row].center;
		    this.grid[col][row].color = this.emptyBlock.color;   // make the "hole" an empty block
		    this.grid[col][row].state = this.emptyBlock.state; 
		    this.grid[col][row].center = this.emptyBlock.center;
		}
	    }
	}
	this.draw();
	return true;
    }
    
    /**
     * Rotate a piece
     * @return Boolean True is rotated
     * @see Sylvester Vector and Matrix math Library for Javscript
     */
    this.rotatePiece = function () {
	var center = this.findCenter();
	var rotateMatrix; // the matrix which rotate the piece
	var rotateClockwise = $M([ 
	    [0,1],
	    [-1,0]
	]);
	var rotateCounterClockwise = $M([
	    [0,-1],
	    [1,0]
	]);

	var i = 0;   // counting number for absoluteCordRotated 
	var relativeCord; // var for storing the cords to push into pieceMatrix
	var sylvesterCord; // var for the Sylvester Matrix
	var relativeCordRotated; // var for the rotated matrix
	var absoluteCordRotatedMatrix = []; // var for the absolute position cord
	var absoluteCordMatrix = [];  // array for the absolute position matrix
	var pieceMatrix = []; // the positions of the active pieces, relative to the center
	var rotatedMatrix = []; // the complete rotated matrix
	switch (this.getCenter()) {
	case 'b': {// is this a box?
	    return true; // just return out of this function
	}
	case 'r': {// is this going to be a 90 clockwise rotation ?
	    rotateMatrix = rotateClockwise;
	    break;
	}
	case '-r': { // ""                     " counter clockwise rotation?
	    rotateMatrix = rotateCounterClockwise;
	    break;
	}
	}
	
	for(var col = 0; col < this.grid.length; col++ ) // starting from the left most column, working our way right
	{
	    for( var row = 0; row < this.grid[col].length; row++) // going from the bottom row to the top
	    {
		if (this.grid[col][row].state == 1 ) // is this an active piece?
		{
		    relativeCord = [col - center[0], row - center[1]]; // calculate the cords, relative to the center
		    sylvesterCord = $M(relativeCord); // store the cord array as a matrix
		    cordRotated = rotateMatrix.x(sylvesterCord); // multiply the rotate matrix by the cord matrix
		    if (this.grid[col][row].center == 'r') { // is this a rotateable piece?
			switch(this.grid[col][row].color) {
			case 1: { this.grid[col][row].center = '-r'; // is piece a stick ?
				  break;
				}
			case 3: { this.grid[col][row].center = '-r'; // is piece a z ?
				  break;
				}
			case 4: { this.grid[col][row].center = '-r'; // is piece a s ?
				  break;
				}
			default: this.grid[col][row].center = 'r';
			}
		    } else if (this.grid[col][row].center == '-r') { 
			// if the piece has already been selected for counter-clockwise, make it clockwise again
			this.grid[col][row].center = 'r';
		    }
		    absoluteCordRotatedMatrix[i] = { col: cordRotated.elements[0][0] + center[0],
						     row: cordRotated.elements[1][0] + center[1],
						     color: this.grid[col][row].color,
						     state: this.grid[col][row].state,
						     center: this.grid[col][row].center
						   }
		    i++; // increment the count
		    pieceMatrix.push(relativeCord); // push the cords onto the piece matrix
		    rotatedMatrix.push(cordRotated); /// push the rotated cord onto the rotatedMatrix 
		}
	    }
	}
	rotatedMatrix = rotatedMatrix;
	pieceMatrix = pieceMatrix;
//	absoluteCordMatrix = absoluteCordMatrix;
	absoluteCordRotatedMatrix = absoluteCordRotatedMatrix;
	if (this.insertionCheck(absoluteCordRotatedMatrix)) { // check to see if the rotated matrix will fit
	    this.removeActiveBlocks(); // remove all the active blocks from play
	    this.insertRotatedPiece(absoluteCordRotatedMatrix); // insert the rotated piece
	    this.draw(); // draw the board again
	    return true;
	}
    }
    /**
     * Find the center of a piece
     * @return array [centerX, centerY]
     */
    this.findCenter = function () {
	var center = []; // center array, which will be returned
	var centerCol; // x cord of center piece that has been found
	var centerRow; // y cord of center piece that has been found
	for( var col = 0; col < this.grid.length; col++) // starting from the left, work our way right
	{
	    for( var row = 0; row < this.grid[col].length; row++) // going from left to right in the coloumns
	    {
		if (this.grid[col][row].state == 1) // is this an active piece?
		{
		    if (this.grid[col][row].center != 0 ) // if the piece is a center piece
		    {
			center = [col,row]; // set center to the col and row of this point
			return center; // return the center cords
		    }
		}
	    }
	}
    }

    /**
     * Check to see if the piece can be moved down
     * @return Boolean true if there is room to go down, false otherwise
     */
    this.roomBelow = function () {
	for( var col = 0 ; col < this.grid.length; col++)         // starting from the first col
	{
	    for( var row = 0; row < this.grid[col].length; row++) // work our way up from the bottom
	    {
		if (this.grid[col][row].state == 1) { // Is the block active ?
		    if ( row == 0) {            // Are we on the bottom row?
			return false;          // Return false, there is no more room below.
		    } else if (this.grid[col][row - 1].color > 0 && this.grid[col][row - 1].state == 0) { // Is the block below not empty and is its state inactive?
			return false;                             // Return false, there is a non-empty block below
		    } 
		}
	    }
	}
	return true; // we made it through all of our check, so we should be able to go down further
    };

    /**
     * Check to see if the piece can be moved to one side
     * @parameter string left or right. check to see if the left or right side has space for the piece
     * @return boolean true if there is room, false otherwise
     */ 
    this.roomSide = function (side) {
	var sideCol;
	switch(side) {
	case 'left':
	    sideCol = -1;
	    break;
	case 'right':
	    sideCol = 1;
	    break;
	default:
	    return false; // left nor right was given, so return false
	}
	
	
	for( var col = 0 ; col < this.grid.length; col++)  // 
	{
	    for( var row = 0; row < this.grid[col].length; row++)
	    {
		if (this.grid[col][row].state == 1) { // Is the block active?
		    if ( side == 'left' && col == 0 ) { // are we considering the left side and are we on e the left-most side?
			return false; // no more room!
		    }
		    if ( side == 'right' && col == (this.grid.length - 1)) { // are we considering the right side and are we one the right-most side?
			return false;
		    }
		   if (this.grid[col + sideCol][row].color > 0 && this.grid[col + sideCol][row].state == 0) { // Is the block next to it not empty and is its state inactive? 
			return false;                             // Return false, there is a non-empty block to the side
		    } 
		}
	    }
	 
	}
	return true; // we made it through all of our check, so we should be able to move to the side
    }
    /**
     * Can the col, row pairs of all pieces be inserted into the grid ?
     * @parameter Array of block objects
     * @return Boolean true if all pieces can fit on the grid, false otherwise
     */
    this.insertionCheck = function (piece) {
	for ( block in piece)
	{
	    if ( piece[block].col < 0 || piece[block].col >= this.grid.length)
	    {
		return false; // this block will fall off the sides of the grid
	    }
	    if (piece[block].row < 0 ) //|| piece[block].row >= this.grid[0].length)
	    {
		return false; // this block will be below or above the visible grid
	    }
	    if ((this.grid[piece[block].col][piece[block].row].color > this.emptyBlock.color) &&
		(this.grid[piece[block].col][piece[block].row].state == this.emptyBlock.state))
	    {
		return false; // this piece will run into stationary piece
	    }
	}
	return true; // all of the blocks of the piece will fit
    }
    /**
     * Remove all pieces currently on the board from play
     * change all block states to 0 (.state = 0)
     */
    this.resetStates = function () {
	for( var i = 0; i < this.grid.length; i++)
	{
	    for( var j = 0; j < this.grid[i].length; j++)
	    {
		this.grid[i][j].state = 0;
	    } 
	}
    };
    /** 
     * Reset the next blocks
     */
    this.resetNextBlock = function () {
	for( var row = 0; row <= 1; row++)
	{
	    for( var col = 0; col <= 4; col++)
	    {
		var color;
		var element = '#next\\[' + col + '\\]\\[' + row + '\\]';
		color = "emptyNext";
		
		$(element).removeClass();
		$(element).addClass(color);
		$(element).addClass("block");
	    } 
	}
    }
    /**
     * Remove all blocks with state 1 (active block) from the grid
     * This is used to remove a piece before inserting its rotated matrix back 
     * onto the board
     */
    this.removeActiveBlocks = function () {
	for (var col = 0; col < this.grid.length; col++)
	{
	    for ( var row = 0; row < this.grid[col].length; row++)
	    {
		if (this.grid[col][row].state == 1) // if the piece is active
		{
		    // remove it from the board
		    this.grid[col][row].color =  this.emptyBlock.color;
		    this.grid[col][row].state =  this.emptyBlock.state;
		    this.grid[col][row].center = this.emptyBlock.center;
		}
	    }
	}
    }
    /** 
     * Insert a rotated piece into the board
     * @parameter Array of block objects
     */
    this.insertRotatedPiece = function(piece) {
	for (block in piece)
	{
	    this.grid[piece[block].col][piece[block].row].color = piece[block].color;
	    this.grid[piece[block].col][piece[block].row].state = piece[block].state;
	    this.grid[piece[block].col][piece[block].row].center = piece[block].center;
	}
    }
    /**
     * Determine what kind of rotation must be performed on the piece, a priori
     * @return String The center type
     */
    this.getCenter = function () {
	for (var col = 0; col < this.grid.length; col++)
	{
	    for ( var row = 0; row < this.grid[col].length; row++)
	    {
		if (this.grid[col][row].state == 1) // if the piece is active
		{
		    if ( this.grid[col][row].center == 'b')
			 return 'b';
		    if (this.grid[col][row].center == 'r')
			return 'r';
		    if (this.grid[col][row].center == '-r')
			return '-r';
		}
	    }
	}
    }
    /**
     * Clear any solid lines that may have accumlated
     * @return number The amount of lines that have been cleared
     */
    this.clearSolidLines = function () {
	var clearedLines = 0;    // the number of lines that were cleared
	var filledCols;      // amount of filled columns
	var filledRows = []; // rows which are full

	// first, lets get the rows which need to be cleared and the amount of clearedLines
	// we start from the top, work our way down. This way, the top most cleared lines
	// are first in the filledRows matrix. This becomes important because when we push down
	// the blocks later on, we want to work our way from the bottom up when moving the 
	// blocks down. Otherwise, if you work from the top down, you end up losing the previous
	// position of the blocks. If we are pushing block from the top down, than it is important
	// to clear top most lines first as we would end up pushing down empty rows. 
	for ( var row = (this.grid[0].length - 1); row >= 0; row--)
	{
	    filledCols = 0;
	    for ( var col = 0; col < this.grid.length; col++)
	    {
		if ( this.grid[col][row].color > this.emptyBlock.color )
		{
		    filledCols++;
		}
	    }
	    if ( filledCols == (this.grid.length) )
		 {
		     clearedLines++;       // increase the total number of lines
		     filledRows.push(row); // push the number of the row which has a cleared line
		 }
	}
	
	if (clearedLines > 0) {// if there are filled rows
	    for ( row in filledRows ) 
	    {
		for ( var col = 0; col < this.grid.length; col++)
		{
		    // clear out all of the block and make them empty
		    this.grid[col][filledRows[row]].color = this.emptyBlock.color;
		    this.grid[col][filledRows[row]].center = this.emptyBlock.center;
		    this.grid[col][filledRows[row]].state = this.emptyBlock.center;
		}
		this.pushAllBlocksDown(filledRows[row]); // push all the blocks form this row on up down
	    }
	}

	return clearedLines;
    }
    /**
     * Push all of the block down one row. This should only be called after a 
     * lines have been cleared
     * @parameter Number The row for which all blocks on or above should be pushed down to
     */
    this.pushAllBlocksDown = function (clearedRow) {
	for ( var row = +clearedRow; row < this.grid[0].length; row++)
	{
	    for (var col = 0; col < this.grid.length; col++)
	    {
		if ( row == (this.grid[0].length - 1)) { // are we on the top row?
		    // make the top line empty
		    this.grid[col][row].color  = this.emptyBlock.color;
		    this.grid[col][row].state  = this.emptyBlock.state;
		    this.grid[col][row].center = this.emptyBlock.center;
		} else { 
		    // move the piece above to this row
		    this.grid[col][row].color  = this.grid[col][row + 1].color;
		    this.grid[col][row].state  = this.grid[col][row + 1].state;
		    this.grid[col][row].center = this.grid[col][row + 1].center;
		}
	    }
	}
	this.draw();
    }
    /**
     * Draw the game over Div
     */
    this.gameOverScreen = function () {
	for (var row = 8; row <= 12; row++) 
	{
	    for (var col = 0; col < this.grid.length; col++)
	    {
		element = '#grid\\[' + col + '\\]\\[' + row + '\\]';
		$(element).remove();
	    }
	}
	col = 9;
	row = 13;
	element = '#grid\\[' + col + '\\]\\[' + row + '\\]';
	gameOverDiv = '<div id=\"gameOver\" class=\"empty block\"></div>';
	$(element).after(gameOverDiv);
	$("<p class=\"gameOver\">Game Over!</p>").appendTo('#gameOver');
	$("<a href=\"\" class=\"playAgain\">New Game</a>").appendTo('#gameOver');
	$('a.playAgain').hover( 
	    function () { 
		$(this).addClass("hover");
	    },
	    function () {
		$(this).removeClass("hover");
	    }
	);

    }
    /**
     * Check to see if the player has made any solid lines
     * @return array [ 1st, 2nd, 3rd, 4th] The nth line that is solid, returns up to four line
     */
    this.solidLineCheck = function () {};
    
    /**
     * Remove the solid line
     */
    this.removeSolidLine = function () {};
    
    /**
     * Check to see if any piece are "stuck" in the ceiling,
     * thus ending the players game.
     * @return boolean TRUE if piece is "stuck", otherwise FALSE
     */
    this.spaceAvailable = function () {};
    /**
     * Determine which color to use
     */
    this.getColor = function (palette) {
	switch(palette) {
	case 1: return "orange";
	case 2: return "yellow";
	case 3: return "green";
	case 4: return "aqua";
	case 5: return "purple";
	case 6: return "blue";
	case 7: return "red";
	}
    };
    
};
/**
 * Pieces class
 * Center nomenclature is as follows:
 *  b    - Box, no rotation is ever applied
 *  r    - apply a  90 degree rotation matrix 
 * -r    - apply a -90 degree rotation matrix
 */

/**
 * stick
 * geometry: ####
 */
tetris.piece.stick = function () {
    this.matrix = [[],[]];
    this.matrix[0][0] = { color: 1, center: 0 };
    this.matrix[0][1] = { color: 1, center: 'r' };
    this.matrix[0][2] = { color: 1, center: 0 };
    this.matrix[0][3] = { color: 1, center: 0 };
    
};
/**
 * hat
 * geometry : ### 
 *             #
 */
tetris.piece.hat = function () {
    this.matrix = [[],[]];
    this.matrix[0][0] = { color: 2, center: 0 };
    this.matrix[0][1] = { color: 2, center: 'r' };
    this.matrix[0][2] = { color: 2, center: 0 };
    this.matrix[1][0] = { color: 0, center: 0 };
    this.matrix[1][1] = { color: 2, center: 0 };
    this.matrix[1][2] = { color: 0, center: 0 };
};
/**
 * z
 * geometry: ##
 *            ##
 */
tetris.piece.z = function () {
    this.matrix = [[],[]];
    this.matrix[0][0] = { color: 3, center: 0 };
    this.matrix[0][1] = { color: 3, center: 'r' }; // these are "90, -90 rotaters"
    this.matrix[0][2] = { color: 0, center: 0 };
    this.matrix[1][0] = { color: 0, center: 0 };
    this.matrix[1][1] = { color: 3, center: 0 };
    this.matrix[1][2] = { color: 3, center: 0 };

};
/**
 * s
 * geometry: ##
 *          ##
 */  
tetris.piece.s = function () {
    this.matrix = [[],[]];
    this.matrix[0][0] = { color: 0, center: 0 };
    this.matrix[0][1] = { color: 4, center: 'r' };
    this.matrix[0][2] = { color: 4, center: 0 };
    this.matrix[1][0] = { color: 4, center: 0 };
    this.matrix[1][1] = { color: 4, center: 0 };
    this.matrix[1][2] = { color: 0, center: 0 };

};
/**
 * leftBoot
 * geometry: ###
 *             #
 */
tetris.piece.leftBoot = function () {

    this.matrix = [[],[]];
    this.matrix[0][0] = { color: 5, center: 0 };
    this.matrix[0][1] = { color: 5, center: 'r'};
    this.matrix[0][2] = { color: 5, center: 0 };
    this.matrix[1][0] = { color: 0, center: 0 };
    this.matrix[1][1] = { color: 0, center: 0 };
    this.matrix[1][2] = { color: 5, center: 0 };

};
/**
 * rightBoot
 * geometry: ###
 *           #
 */
tetris.piece.rightBoot = function () {
    this.matrix = [[],[]];
    this.matrix[0][0] = { color: 6, center: 0 };
    this.matrix[0][1] = { color: 6, center: 'r'};
    this.matrix[0][2] = { color: 6, center: 0 };
    this.matrix[1][0] = { color: 6, center: 0 };
    this.matrix[1][1] = { color: 0, center: 0 };
    this.matrix[1][2] = { color: 0, center: 0 };

};
/**
 * box
 * geometry: ##
 *           ##
 */
tetris.piece.box = function () {

    this.matrix = [[],[]];
    this.matrix[0][0] = { color: 7, center: 0 };
    this.matrix[0][1] = { color: 7, center: 'b'};
    this.matrix[1][0] = { color: 7, center: 0 };
    this.matrix[1][1] = { color: 7, center: 0 };

};
/**
 * Generate a random piece
 * @return Object tetris.piece
 */
tetris.piece.random = function () {
    var pieceNumber = Math.floor(Math.random()*7);
    switch(pieceNumber) {
    case 0: return new tetris.piece.stick();
    case 1: return new tetris.piece.hat();
    case 2: return new tetris.piece.z();
    case 3: return new tetris.piece.s();
    case 4: return new tetris.piece.leftBoot();
    case 5: return new tetris.piece.rightBoot();
    case 6: return new tetris.piece.box();
    }
    return false;
}

/**
 * A tetris player
 */
tetris.player = function () { 

    // number of lines player has cleared
    this.lines;
    /** 
     * When player hites the left arrow
     */
    this.pressLeft = function () {}
    /**
     * When player hits the right arrow
     */
    this.pressRight = function () { }
    /**
     * When player hits the down arrow
     */
    this.pressDown = function () { }
    /**
     * When player hits the up arrow
     */
    this.pressUp = function () { }
};