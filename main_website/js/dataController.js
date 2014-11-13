

dataController = (function() {


    function init() {

    }


    // Query Methods

    function queryURL(url, callback) {

        $.ajax({
            url: "http://dali.cs.kuleuven.be:8080/qbike/trips" + url,
            jsonp: "callback",
            dataType: "jsonp",

            success: callback
        });
    }

    function queryTripWithID(ID, callback) {

        queryURL("/" + ID, function (json) {

            console.log("We got trip with ID " + ID + ".");

            callback(json[0]);
        });
    }

    function queryTripsForGroupID(groupID, callback) {

        queryURL("?groupID=" + groupID, function (json) {

            console.log("We got " + json.length + " elements for group " + groupID + ".");

            callback(json);
        });
    }

    function queryTripsForSensorID(sensorID, callback) {

        queryURL("?sensorID=" + sensorID, function (json) {

            console.log("We got " + json.length + " elements for sensor with id " + sensorID + ".");

            callback(json);
        });
    }

    function queryTripsForPeriod(beginDate, endDate, callback) {

        var fromDate = "fromDate=" + beginDate.getFullYear() + "-" + (beginDate.getMonth()+1) + "-" + beginDate.getDate();
        var toDate = "toDate=" + endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();

        queryURL("?groupID=cwa3&" + fromDate + "&" + toDate, function (json) {

            console.log("We got " + json.length + " elements for group cwa3 for period beginning " + beginDate + " and ending " + endDate);

            callback(json);
        });
    }

    function queryTripsForDay(date, callback) {

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        console.log("Querying trips for " + day + "/" + month + "/" + year + ".");

        //queryURL("?groupID=cwa3&fromDate=" + year + "-" + month + "-" + day + "&toDate=" + year + "-" + month + "-" + day, function (json) {
        //
        //    console.log("We got " + json.length + " elements for group cwa3 for date " + day + "/" + month + "/" + year + ".");
        //
        //    callback(json);
        //});

        queryTripsForPeriod(date, new Date(year, month-1, day+1), function (trips) {

            callback(trips);
        });
    }

    function queryDataForDay(date, callback) {

        queryTripsForDay(date, function(trips) {

            callback({trips: trips, average: getAveragesFromTrips(trips)});
        });
    }

    function queryDataForMonth(date, callback) {

        var month = 0;
        var year = 0;

        // if the date is a number, it just specifies the month
        if (typeof date == "number") {

            month = date;
            year = new Date().getFullYear();

        // if the date is a date object it represents a day in the month
        } else if (typeof date == "object") {

            month = date.getMonth() + 1;
            year = date.getFullYear();
        }

        var beginDate = new Date(year, month - 1, 1);
        var endDate = new Date(year, month, 1);

        queryTripsForPeriod(beginDate, endDate, function (trips) {

            callback(divideAndSetAveragesForPeriod(trips, beginDate, endDate));
        });
    }



    // Division Methods

    function divideTripsIntoDays(trips, beginDate, endDate) {

        // we create an array with a space for all days.
        var nrOfDays = nrOfDaysBetweenDates(beginDate, endDate);
        var returnData = new Array(nrOfDays);

        for (var i = 0; i < nrOfDays; i++) {

            returnData[i] = {trips: []};
        }

        $.each(trips, function (index, trip) {

            if (trip.hasOwnProperty("startTime")) {

                var date = new Date(trip.startTime);

                var nrOfDaysFromBeginDate = nrOfDaysBetweenDates(beginDate, date) - 1;

                if (nrOfDaysFromBeginDate >= 0 && nrOfDaysFromBeginDate < nrOfDays) {

                    returnData[nrOfDaysFromBeginDate].trips.push(trip);
                }
            }
        });

        return returnData;
    }



    // Average Methods

    function getAveragesFromTrips(trips) {

        var totalDist = 0;
        var speedReadings = [];

        var tempReadings = [];

        var humReadings = [];

        var tripsCoordinates = [];

        $.each(trips, function(index, trip) {

            if (trip.hasOwnProperty("sensorData")) {

                var singleTripCoordinates = [];

                $.each(trip.sensorData, function(index, sensorValue) {

                    switch(sensorValue.sensorID) {

                        // GPS coordinates

                        case 1:

                            if (sensorValue.data[0].type == "MultiPoint") {

                                var latitude = sensorValue.data[0].coordinates[0][0];
                                var longitude = sensorValue.data[0].coordinates[0][1];
                                var coordinateArray = {lat: latitude, lng: longitude};

                                singleTripCoordinates.push(coordinateArray);

                                break;
                            }
                            else {
                                var latitudeSingle = sensorValue.data[0].coordinates[0];
                                var longitudeSingle = sensorValue.data[0].coordinates[1];
                                var coordinateArraySingle = {lat: latitudeSingle, lng: longitudeSingle};

                                singleTripCoordinates.push(coordinateArraySingle);

                                break;
                            }


                        // Temperature
                        case 3:

                            var temp = parseInt(sensorValue.data[0].value);

                            if (!isNaN(temp)) {

                                tempReadings.push(temp);
                            }

                            break;


                        // Humidity
                        case 4:

                            var hum = parseInt(sensorValue.data[0].value);

                            if (!isNaN(hum)) {

                                humReadings.push(hum);
                            }

                            break;

                        default:
                    }
                });

                tripsCoordinates.push(singleTripCoordinates);

            }

            if (trip.hasOwnProperty("meta") && trip.meta != null) {

                $.each(trip.meta, function(key, metaValue) {

                    switch(key) {

                        case "distance":

                            if (metaValue != null) {

                                totalDist += parseInt(metaValue)
                            }

                            break;

                        case "averageSpeed":

                            if (metaValue != null) {

                                speedReadings.push(parseInt(metaValue));
                            }

                            break;
                    }
                });
            }
        });


        var avSpeed = arrayAverage(speedReadings)
        var avTemp = arrayAverage(tempReadings);
        var avHum = arrayAverage(humReadings);

        var average = {
            totalDistance: totalDist,
            averageSpeed: avSpeed,
            averageTemperature: avTemp,
            averageHumidity: avHum,
            nrOfTrips: trips.length,
            routes: tripsCoordinates
        };

        return average;
    }

    function divideAndSetAveragesForPeriod(trips, beginDate, endDate) {

        var dividedTrips = divideTripsIntoDays(trips, beginDate, endDate);

        $.each(dividedTrips, function (index, day) {

            dividedTrips[index].average = getAveragesFromTrips(day.trips);
        });

        return dividedTrips;
    }


    function arrayAverage(array) {

        if (array.length == 0) {
            return null;
        }

        var total = 0.0;

        $.each(array, function(index, element) {

            total += element;
        });

        return total/array.length;
    }


    function round(number, accuracy) {

        if (typeof number == "number") {

            var rounder = Math.pow(10, accuracy);

            return Math.round(number * rounder) / rounder;
        }

        return "No Readings";
    }

    function nrOfDaysBetweenDates(date1, date2) {

        var difference = Math.abs(date1.valueOf() - date2.valueOf());

        var nrOfDays = Math.round(difference / (1000 * 60 * 60 * 24));

        return nrOfDays;
    }



    return {
        init: init,

        queryURL: queryURL,
        queryTripWithID: queryTripWithID,
        queryTripsForGroupID: queryTripsForGroupID,
        queryTripsForSensorID: queryTripsForSensorID,

        queryTripsForPeriod: queryTripsForPeriod,
        queryTripsForDay: queryTripsForDay,
        queryDataForDay: queryDataForDay,
        queryDataForMonth: queryDataForMonth,

        divideTripsIntoDays: divideTripsIntoDays,

        getAveragesFromTrips: getAveragesFromTrips,
        divideAndSetAveragesForPeriod: divideAndSetAveragesForPeriod,

        arrayAverage: arrayAverage,
        round: round,
        nrOfDaysBetweenDates: nrOfDaysBetweenDates
    };

})();

$(document).ready(dataController.init);
