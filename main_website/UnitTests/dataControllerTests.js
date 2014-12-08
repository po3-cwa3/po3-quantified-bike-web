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



// Map tests

QUnit.test("Writing coordinates in an array", function(assert) {

    var data =
        [
            {
                "startTime": "2014-10-02T13:33:37.619Z",
                "endTime": "2014-10-02T13:33:49.026Z",
                "groupID": "assistants",
                "userID": "u0044250",
                "_id": "542d543d45dce96f3d00001d",
                "sensorData": [
                    {
                        "sensorID": 8,
                        "timestamp": 1412256813951,
                        "data": [
                            {"nbOfBreakHits": 8, "breaks": [1412256813951, 1412256813951, 1412256813951]}
                        ]},
                    {
                        "sensorID": 1,
                        "timestamp": 1412256813951,
                        "data": [
                            {"type": "Point", "coordinates":    //see geoJSON.org
                                [50.8640, 4.6790]
                            }
                        ]},
                    {
                        "sensorID": 1,
                        "timestamp": 1412256813951,
                        "data": [
                            {"type": "Point", "coordinates":    //see geoJSON.org
                                [50.8645, 4.6795]
                            }
                        ]},
                    {
                        "sensorID": 1,
                        "timestamp": 1412256813951,
                        "data": [
                            {"type": "Point", "coordinates":    //see geoJSON.org
                                [50.8650, 4.6795]
                            }
                        ]}
                ],
                "meta":
                {
                    "distance": 5000,
                    "averageSpeed": 15.6,
                    "maxSpeed": 23,
                    "other": [
                        {"comment": "awesome trip!"}
                    ]
                }
            },
            {
                "startTime": "2014-10-02T13:33:37.619Z",
                "endTime": "2014-10-02T13:33:49.026Z",
                "groupID": "assistants",
                "userID": "u0044250",
                "_id": "542d543d45dce96f3d00001d",
                "sensorData": [
                    {
                        "sensorID": 8,
                        "timestamp": 1412256813951,
                        "data": [
                            {"nbOfBreakHits": 8, "breaks": [1412256813951, 1412256813951, 1412256813951]}
                        ]},
                    {
                        "sensorID": 1,
                        "timestamp": 1412256813951,
                        "data": [
                            {"type": "Point", "coordinates":    //see geoJSON.org
                                [50.8640, 4.6790]
                            }
                        ]},
                    {
                        "sensorID": 1,
                        "timestamp": 1412256813951,
                        "data": [
                            {"type": "Point", "coordinates":    //see geoJSON.org
                                [50.8643, 4.6793]
                            }
                        ]}
                ],
                "meta":
                {
                    "distance": 5000,
                    "averageSpeed": 15.6,
                    "maxSpeed": 23,
                    "other": [
                        {"comment": "awesome trip!"}
                    ]
                }
            }
        ];

    var inBetween = dataController.getAveragesFromTrips(data);
    var result = inBetween.routes
    var expected = [[{lat: 50.864, lng: 4.679}, {lat: 50.8645, lng: 4.6795}, {lat: 50.865, lng: 4.6795}],[{lat: 50.864, lng: 4.679}, {lat: 50.8643, lng: 4.6793}]];
    assert.equal(JSON.stringify(result), JSON.stringify(expected), "")
});