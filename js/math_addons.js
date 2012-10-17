// Addons for finding the max/min of arrays
// From http://ejohn.org/blog/fast-javascript-maxmin/ also in the "Rhino" Book
Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

Array.rowSum = function ( array ) {
    var sum = 0;
    for(var i = 0; i < array.length; i++)
    {
	sum += array[i];
    }
    return sum;
};
