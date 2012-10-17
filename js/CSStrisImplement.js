var t;
var board;
var nextPiece;
function initialize () {
    board = new tetris.board(); //initiate the board
    $(document).keydown(function(event) {
	switch(event.keyCode) {
	case 40: {
	    if(board.roomBelow()) {
		board.pushDown();
		board.draw();
		break;
	    } else {
		board.draw();
		clearTimeout(t);
		timedPush();
		break;
	    }
	}
	case 37: {
	    board.pushToLeft();
	    break;
	}
	case 39: {
	    board.pushToRight();
	    break;
	}
	case 38: {
	    board.rotatePiece();
	    break;
	}
	}
    });

    var firstPiece = tetris.piece.random(); // initiate a new game piece 
    nextPiece = tetris.piece.random();
    board.draw();                          // draw the blank board
    board.insertPiece(firstPiece);
    board.drawNextPiece(nextPiece);
    t=setTimeout("timedPush()",500);

}

function timedPush () {
    var time = 500; // 500 ms
    var newPiece;
    var lines = $(".lines").text();
    var score = $(".score").text();
    var level = Math.floor(lines / 10);
    var displayLevel = level + 1;
    $(".level").text(displayLevel);
    var clearedSolidLines;
    if (level > 0)
    {
	time = time / level;
    }
    if(board.pushDown())
    {
	board.draw();
	t=setTimeout("timedPush()",time);
    } else {
	clearTimeout(t);
	clearedSolidLines = board.clearSolidLines();
	$(".lines").text(+lines + clearedSolidLines); 
	$(".score").text(+score + lineScore(clearedSolidLines, level));
	if (!board.insertPiece(nextPiece)) {
	    gameOver();
	    return false; // game is over
	}
	board.draw();
	nextPiece = tetris.piece.random(); 
	board.resetNextBlock();
	board.drawNextPiece(nextPiece);
	t=setTimeout("timedPush()",time);
    }
}
/**
 * Game over function
 */
function gameOver () {
    clearTimeout(t);                 // turn off timedPush
    $(document).unbind('keydown');   // Ignore user input
    board.gameOverScreen();          // draw the gameover screen
    $('.playAgain').click( function() {
	$('#container').remove(); // remove all the elements from the screen
	rebuild();
	initialize(); // restart the game
	return false;
    });
}
/**
 * Calculate the score received for clearing lines
 */
function lineScore (lines, level) {
    switch(lines) {
    case 1: {
	return 40 * (+level + 1);
	break;
    }
    case 2: {
	return 100 * (+level + 1);
	break;
    }
    case 3: {
	return 300 * (+level + 1);
	break;
    }
    case 4: {
	return 1200 * (+level + 1);
	break;
    }
    default: {
	return 0;
    }
    }
}
/**
 * Rebuild the entire dom structure for the document
 */
function rebuild() {
    var site = 
	['<div id=\"container\">',
	 '<div id=\"console\">',
	 '<div id=\"nextConsole\">',
	 '<span class=\"leftPadding\">Next</span>',
	 '<div id=\"next\">',
	 '</div> <!-- end next div -->',
	 '</div> <!-- end nextConsole -->',
	 '<div id=\"score\">',
	 '<table id=\"score_table\">',
	 '<tr>',
	 '<td class=\"leftPadding\">Lines</td>',
	 '<td class=\"table_text_right lines\">0</td>',
	 '</tr>',
	 '<tr>',
	 '<td class=\"leftPadding\">Score</td>',
	 '<td class=\"table_text_right score\">0</td>',
	 '</tr>',
	 '<tr>',
	 '<td class=\"leftPadding\">Level</td>',
	 '<td class=\"table_text_right level\">1</td>',
	 '</tr>',
	 '</table>',
	 '</div> <!-- end score div -->',
	 '<div id="directions">',
	 '<table id="directions_table">',
	 '<tr>',
	 '<td class="leftPadding">Action</td>',
	 '<td class="blueText table_text_right">Key</td>',
	 '</tr>',
	 '<tr>',
	 '<td class="leftPadding">Rotate Piece</td>',
	 '<td class="blueText table_text_right">&uarr;</td>',
	 '</tr>',
	 '<tr>',
	 '<td class="leftPadding">Move Left</td>',
	 '<td class="blueText table_text_right">&larr;</td>',
	 '</tr>',
	 '<tr>',
	 '<td class="leftPadding">Move Right</td>',
	 '<td class="blueText table_text_right">&rarr;</td>',
	 '</tr>',
	 '<tr>',
	 '<td class="leftPadding">Soft Drop</td>',
	 '<td class="blueText table_text_right">&darr;</td>',
	 '</tr>',
	 '</table>',
	 '</div> <!-- end directions div -->',
	 '</div> <!-- end console -->',
	 '<div id=\"board\">',
	 '</div> <!-- end board div -->',
	 '</div> <!-- end container div -->'
	].join('\n');
    $(site).appendTo('body');
}