/**
 * Created by rugheid on 08/11/14.
 */


// Date Difference Tests

QUnit.test( "Dates difference test: dates from same day", function( assert ) {

    var date1 = new Date(2014, 9, 10, 1);
    var date2 = new Date(2014, 9, 10, 2);

    var expected = 0;
    var result = dataController.nrOfDaysBetweenDates(date1, date2);

    assert.equal(result, expected, "There are 0 days between 10/10/2014 1:00h and 10/10/2014 2:00 h");

});

QUnit.test( "Dates difference test: dates from same month", function( assert ) {

    var date1 = new Date(2014, 9, 10);
    var date2 = new Date(2014, 9, 20);

    var expected = 10;
    var result = dataController.nrOfDaysBetweenDates(date1, date2);

    assert.equal(result, expected, "There are 10 days between 10/10/2014 and 20/10/2014");

});

QUnit.test( "Dates difference test: dates from same year", function( assert ) {

    var date1 = new Date(2014, 8, 1);
    var date2 = new Date(2014, 9, 1);

    var expected = 30;
    var result = dataController.nrOfDaysBetweenDates(date1, date2);

    assert.equal(result, expected, "There are 30 days between 1/9/2014 and 1/10/2014");

});

QUnit.test( "Dates difference test: dates from same year (2)", function( assert ) {

    var date1 = new Date(2014, 9, 1);
    var date2 = new Date(2014, 10, 1);

    var expected = 31;
    var result = dataController.nrOfDaysBetweenDates(date1, date2);

    assert.equal(result, expected, "There are 31 days between 1/10/2014 and 1/11/2014");

});

QUnit.test( "Dates difference test: dates from different year", function( assert ) {

    var date1 = new Date(2013, 0, 1);
    var date2 = new Date(2014, 0, 1);

    var expected = 365;
    var result = dataController.nrOfDaysBetweenDates(date1, date2);

    assert.equal(result, expected, "There are 365 days between 1/1/2013 and 1/1/2014");

});