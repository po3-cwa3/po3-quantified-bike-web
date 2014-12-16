

dataController = (function() {


    function init() {

    }

    // These functions are meant to easily switch from develop to production server
    function getURL(){
        //return "http://dali.cs.kuleuven.be:8080";
        return "http://dali.cs.kuleuven.be:8443";
    }
    function getImagesURL(){
        return getURL()+"/qbike/images";
    }
    function getTripsURL(){
        return getURL() + "/qbike/trips";
    }

    // Query Methods

    // Basic function to query a certain URL
    function queryURL(url, callback) {

        $.ajax({
            url: getTripsURL() + url,
            jsonp: "callback",
            dataType: "jsonp",
            timeout: 70000

        }).done(function(data, textStatus, jqXHR) {

            // If the query returned successfully, run the callback with the data
            console.log("Query returned successfully with status: " + textStatus);
            callback(data);

        }).fail(function(jqXHR, textStatus, errorThrown) {

            // If the query failed, present an alert
            console.log("Query returned with errors and status: " + textStatus);
            alert("The server appears to be offline or is currently overloaded. We are sorry for the inconvenience.");
        });
    }

    // This function is meant to get a trip with a certain ID, the trip object is returned
    function queryTripWithID(ID, callback) {

        queryURL("/" + ID, function (json) {

            console.log("We got trip with ID " + ID + ".");

            callback(json[0]);
        });
    }

    // This function is meant to get trips for a certain group ID, the list of trips is returned
    function queryTripsForGroupID(groupID, callback) {

        queryURL("?groupID=" + groupID, function (json) {

            console.log("We got " + json.length + " elements for group " + groupID + ".");

            callback(json);
        });
    }

    // This function is meant to get trips for a certain sensor ID, the list of trips is returned
    function queryTripsForSensorID(sensorID, callback) {

        queryURL("?sensorID=" + sensorID, function (json) {

            console.log("We got " + json.length + " elements for sensor with id " + sensorID + ".");

            callback(json);
        });
    }

    // This function is meant to get trips in a certain period, the list of trips is returned
    // The beginDate and endDate variables should be Date objects
    function queryTripsForPeriod(beginDate, endDate, callback) {

        var fromDate = "fromDate=" + beginDate.getFullYear() + "-" + (beginDate.getMonth()+1) + "-" + beginDate.getDate();
        var toDate = "toDate=" + endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();

        var groupID = encodeURIComponent(global_user.user_id);

        queryURL("?groupID=" + groupID + "&" + fromDate + "&" + toDate, function (json) {

            console.log("We got " + json.length + " elements for group cwa3 for period beginning " + beginDate + " and ending " + endDate);

            callback(json);
        });
    }

    // This is a helper method to fix a rare trip bug, where the endTime and startTime are equal
    function fixTrip(trip){

        // If the endTime and startTime are equal
        if(trip.endTime == trip.startTime){

            // And if the trip has sensorData
            if(trip.hasOwnProperty("sensorData")){
                console.log("has own property!");

                // Loop through the sensorData
                $.each(trip.sensorData, function(index, sensorValue){

                    // Check whether the sensors timestamp is later than the trips endTime
                    if(new Date(sensorValue.timestamp) > new Date(trip.endTime)){

                        // If so, set the endTime to the timestamp
                        trip.endTime = sensorValue.timestamp;
                    }
                });
            }
        }
    }

    // This funcion is meant to get trips for a certain day, the list of trips is returned
    // The date variable should be a Date object
    function queryTripsForDay(date, callback) {

        // Get the year, month and day
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // months are returned from 0-11, but we want them from 1-12
        var day = date.getDate();

        console.log("Querying trips for " + day + "/" + month + "/" + year + ".");

        // Query trips for a period of one day
        queryTripsForPeriod(date, new Date(year, month-1, day+1), function (trips) {

            callback(trips);
        });
    }

    // This function is meant to get the data for a certain day
    // The returned data is an object with two keys:
    // -> trips: contains the list of trips
    // -> average: contains an average object with averages for that day
    // The date variable should be a Date object
    function queryDataForDay(date, callback) {

        queryTripsForDay(date, function(trips) {

            // Before we return the trips, we convert it to the data format
            callback({trips: trips, average: getAveragesFromTrips(trips)});
        });
    }

    // This function is meant to get the data for a certain month
    // The returned data is an array of days with the data format as used in queryDataForDay()
    // The date variable should be a Date object
    function queryDataForMonth(date, callback) {

        // Initialise the year and month
        var month = 0;
        var year = 0;

        // if the date is a number, it just specifies the month and we use the current year
        if (typeof date == "number") {

            month = date;
            year = new Date().getFullYear();

        // if the date is a date object it represents a day in the month and we use the specified year
        } else if (typeof date == "object") {

            month = date.getMonth() + 1;
            year = date.getFullYear();
        }

        // We calculate the month's begin and end dates
        var beginDate = new Date(year, month - 1, 1);
        var endDate = new Date(year, month, 1);

        // We query trips for the month's period
        queryTripsForPeriod(beginDate, endDate, function (trips) {

            // Before we return the trips, we convert it to the data format
            callback(divideAndSetAveragesForPeriod(trips, beginDate, endDate));
        });
    }

    // This function is used to get the data of trips in the specified month that contain pictures
    // The date variable should be a Date object
    function queryPictureDataForMonth(date, callback) {

        // Initialise the year and month
        var month = 0;
        var year = 0;

        // if the date is a number, it just specifies the month and we use the current year
        if (typeof date == "number") {

            month = date;
            year = new Date().getFullYear();

            // if the date is a date object it represents a day in the month and we use the specified year
        } else if (typeof date == "object") {

            month = date.getMonth() + 1;
            year = date.getFullYear();
        }

        // We calculate the month's begin and end dates
        var beginDate = new Date(year, month - 1, 1);
        var endDate = new Date(year, month, 1);

        // We query picture trips for the month's period
        queryPictureTripsForPeriod(beginDate, endDate, function (trips) {

            // Before we return the trips, we convert it to the data format
            callback(divideAndSetAveragesForPeriod(trips, beginDate, endDate));
        });
    }

    // This function is meant to get trips in a certain period that contain pictures
    function queryPictureTripsForPeriod(beginDate, endDate, callback) {

        // Calculate the from and to dates
        var fromDate = "fromDate=" + beginDate.getFullYear() + "-" + (beginDate.getMonth()+1) + "-" + beginDate.getDate();
        var toDate = "toDate=" + endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();

        var groupID = encodeURIComponent(global_user.user_id);

        // Query the url with the sesorID=8 specification
        queryURL("?groupID=" + groupID + "&" + fromDate + "&" + toDate + "&sensorID=8", function (json) {

            console.log("We got " + json.length + " elements for group cwa3 for period beginning " + beginDate + " and ending " + endDate);

            callback(json);
        });
    }

    // This function is meant to get all trips with pictures
    function queryPictureTrips(callback) {

        var groupID = encodeURIComponent(global_user.user_id);

        queryURL("?sensorID=8&groupID=" + groupID, function (json) {

            console.log("We got " + json.length + " elements with pictures.");
            callback(json);
        })
    }



    // Division Methods

    function divideTripsIntoDays(trips, beginDate, endDate) {

        // we calculate the nr of days to make the return array
        var nrOfDays = nrOfDaysBetweenDates(beginDate, endDate);
        var returnData = [];

        // We initialise the returnData
        for (var i = 0; i < nrOfDays; i++) {

            returnData.push({trips: []});
        }

        // We loop through the trips and add them to the appropriate day, depending on their number of days from the beginDate
        $.each(trips, function (index, trip) {

            // We can also determine the number of days if a startTime is present
            if (trip.hasOwnProperty("startTime")) {

                // Convert the startTime to a Date object
                var date = new Date(trip.startTime);

                // Calculate the number of days from the beginDate
                var nrOfDaysFromBeginDate = nrOfDaysBetweenDates(beginDate, date);

                // If the trip lies in the specified period, add it to the appropriate day
                if (nrOfDaysFromBeginDate >= 0 && nrOfDaysFromBeginDate < nrOfDays) {

                    returnData[nrOfDaysFromBeginDate].trips.push(trip);
                }

            }
        });

        return returnData;
    }



    // Average Methods

    // This function is meant to calculate the average object for a list of trips
    function getAveragesFromTrips(trips) {

        // Initialise some variables
        var totalDist = 0;
        var tempReadings = [];
        var humReadings = [];
        var tripsCoordinates = [];
        var heartReadings= [];
        var accReadings = [];
        var totalTime = 0;

        // Loop through the trips
        $.each(trips, function(index, trip) {

            // Fix the trip if necessary
            fixTrip(trip);

            // If the trip has start and end times, the trips time can be added to the total
            if (trip.hasOwnProperty("startTime") && trip.hasOwnProperty("endTime")) {

                // Get the start and end times
                var startTime = new Date(trip.startTime);
                var endTime = new Date(trip.endTime);

                // Get the difference and add it to the total
                var difference = endTime.getTime() - startTime.getTime();
                totalTime = totalTime + difference;

            }

            // If the trip has sensorData, check the sensorData
            if (trip.hasOwnProperty("sensorData")) {

                // Initialise GPS variables
                var gpsDataArray = [];
                var singleTripCoordinates = [];

                // Loop through the sensorData
                $.each(trip.sensorData, function(index, sensorValue) {

                    // Determine what kind of sensor we are dealing with
                    switch(sensorValue.sensorID) {

                        // GPS
                        case 1:

                            // Add the coördinates to the gpsDataArray
                            console.log(JSON.stringify(sensorValue.data.coordinates));
                            gpsDataArray.push(sensorValue);

                        // Temperature
                        case 3:

                            // Parse the reading
                            var temp = parseInt(sensorValue.data[0].value);

                            // If the reading is a valid number, add it to the readings list
                            if (!isNaN(temp)) {

                                tempReadings.push(temp);
                            }

                            break;


                        // Humidity
                        case 4:

                            // Parse the reading
                            var hum = parseInt(sensorValue.data[0].value);

                            // If the reading is a valid number, add it to the readings list
                            if (!isNaN(hum)) {

                                humReadings.push(hum);
                            }

                            break;

                        // Heartbeat
                        case 9:

                            // Parse the reading
                            var heart = parseInt(sensorValue.data[0].value);

                            // If the reading is a valid number, add it to the readings list
                            if (!isNaN(heart)) {

                                heartReadings.push(heart);
                            }

                            break;

                        default:
                    }
                });

                //GPS data is sorted in case it is not in the correct order
                gpsDataArray.sort(compareTime);

                // This function determines whether the coördinates are valid,
                // Coördinates too close to the equater are removed, this is a GPS bug
                function validCoordinate(c){
                    return Math.abs(c.lat) > .001 && Math.abs(c.lng) > .001;
                }

                // This function converts degrees to radians
                function toRadians(num){
                    return num/180.0*Math.PI;
                }

                // This function calculates the distance between 2 points
                function havDist(lat1, lon1, lat2, lon2){
                    var R = 6371; // km
                    var φ1 = toRadians(lat1);
                    var φ2 = toRadians(lat2);
                    var Δφ = toRadians(lat2-lat1);
                    var Δλ = toRadians(lon2-lon1);

                    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ/2) * Math.sin(Δλ/2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                    var d = R * c;
                    return d;
                }

                // The threshold is meant to remove GPS points that are too far away from the previous point
                // These jumps are GPS bugs
                var threshold = 20;

                // This function determines whether the coördinate does not jump as the result of the GPS bug
                function possibleCoordinate(prev, curr, next){
                    if(prev != null && havDist(prev.lat, prev.lng, curr.lat, curr.lng) > threshold)
                        return false;
                    if(next != null && havDist(curr.lat, curr.lng, next.lat, next.lng) > threshold)
                        return false;
                    return true;
                }

                // Loop through the gpsDataArray and convert multiPoints to single points and add them to the singleTripCoordinates
                $.each(gpsDataArray, function(index, gpsData){

                    //GPS data is converted to LatLng objects and added to an array for use in google maps API.
                    //This must be done seperately for the "MultiPoint" and "Point" type of coordinates.
                    if (gpsData.data[0].type == "MultiPoint") {

                        $.each(gpsData.data[0].coordinates, function(i, point) {

                            var latitude = point[0];
                            var longitude = point[1];
                            var coordinateArray = {lat: latitude, lng: longitude};
                            if(validCoordinate(coordinateArray)) {
                                singleTripCoordinates.push(coordinateArray);
                            }
                        });

                    } else {
                        var latitudeSingle = gpsData.data[0].coordinates[0];
                        var longitudeSingle = gpsData.data[0].coordinates[1];

                        var coordinateArraySingle = {lat: latitudeSingle, lng: longitudeSingle};
                        var prevCoordinate = null;
                        var nextCoordinate = null;
                        if(index > 0){
                            prevCoordinate = gpsDataArray[index-1].data[0].coordinates;
                            prevCoordinate = {lat:prevCoordinate[0], lng: prevCoordinate[1]};
                        }
                        if(index < gpsDataArray.length-1){
                            nextCoordinate = gpsDataArray[index+1].data[0].coordinates;
                            nextCoordinate = {lat:nextCoordinate[0], lng:nextCoordinate[1]};
                        }
                        if(possibleCoordinate(prevCoordinate, coordinateArraySingle, nextCoordinate)){
                            singleTripCoordinates.push(coordinateArraySingle);
                        }

                    }

                });

                //Each single trip (an array of objects) is added to the array of (multiple) trips
                tripsCoordinates.push(singleTripCoordinates);

                // We calculate the total distance of the trip and add it to the total distance
                for (var i = 1 ; i < singleTripCoordinates.length ; i++) {

                    var point1 = singleTripCoordinates[i-1];
                    var point2 = singleTripCoordinates[i];

                    point1 = new google.maps.LatLng(point1.lat,point1.lng);
                    point2 = new google.maps.LatLng(point2.lat,point2.lng);

                    var distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);

                    totalDist += distance;
                }

            }
        });


        // Calculate the averages from the readings
        var avTemp = arrayAverage(tempReadings);
        var avHum = arrayAverage(humReadings);

        // Calculate the average speed, if the total time and total distance could have been calculated
        var avSpeed = "No Readings";
        if (totalTime != 0 && totalDist != 0) {
            avSpeed = (totalDist / (totalTime.valueOf() / 1000.0)) * 3.6;
        }

        // Return the average object
        return {
            totalDistance: totalDist,
            averageSpeed: avSpeed,
            totalTime: totalTime/1000.0,
            averageTemperature: avTemp,
            averageHumidity: avHum,
            nrOfTrips: trips.length,
            routes: tripsCoordinates,
            temparature: tempReadings,
            humidity: humReadings,
            heart: heartReadings
        };
    }

    // This function is meant to convert a list of trips to the data format
    // First it divides the trips into days, using the given begin and end dates
    // Then it calculates the averages for every day
    function divideAndSetAveragesForPeriod(trips, beginDate, endDate) {

        // Divide the trips into days
        var dividedTrips = divideTripsIntoDays(trips, beginDate, endDate);

        // Loop through the days and calculate the average object
        $.each(dividedTrips, function (index, day) {

            dividedTrips[index].average = getAveragesFromTrips(day.trips);
        });

        return dividedTrips;
    }


    // This function is meant to calculate the average from an array of readings
    function arrayAverage(array) {

        // If the array does not contain any readings, return null
        if (array.length == 0) {
            return null;
        }

        // Initialise the total
        var total = 0.0;

        // Loop through the readings and add them to the total
        $.each(array, function(index, element) {

            total += element;
        });

        // Return the total, divided by the number of readings, this is the average
        return total/array.length;
    }


    // This function is used to round a number with a given accuracy
    function round(number, accuracy) {

        // The number has to be of type number
        if (typeof number == "number") {

            // Calculate a helper variable
            var rounder = Math.pow(10, accuracy);

            // Return the rounded value
            return Math.round(number * rounder) / rounder;
        }

        // It the number is not a number, return the no readings message
        return "No Readings";
    }

    // This function is meant to calculate the number of days between two dates
    function nrOfDaysBetweenDates(date1, date2) {

        var difference = Math.abs(date1.valueOf() - date2.valueOf());

        var nrOfDays = Math.floor(difference / (1000 * 60 * 60 * 24));

        return nrOfDays;
    }


    // Map Methods

    // This function is used to sort the GPS readings
    function compareTime(data1, data2) {

        var time1 = new Date(data1.timestamp);
        var time2 = new Date(data2.timestamp);

        if (time1 < time2){
            return -1;
        }
        if (time1 > time2){
            return 1;
        }
        return 0;
    }




    return {
        init: init,

        getURL: getURL,
        getImagesURL: getImagesURL,
        getTripsURL: getTripsURL,

        queryURL: queryURL,
        queryTripWithID: queryTripWithID,
        queryTripsForGroupID: queryTripsForGroupID,
        queryTripsForSensorID: queryTripsForSensorID,

        queryTripsForPeriod: queryTripsForPeriod,
        queryTripsForDay: queryTripsForDay,
        queryDataForDay: queryDataForDay,
        queryDataForMonth: queryDataForMonth,

        queryPictureTripsForPeriod: queryPictureTripsForPeriod,
        queryPictureDataForMonth: queryPictureDataForMonth,
        queryPictureTrips: queryPictureTrips,

        divideTripsIntoDays: divideTripsIntoDays,

        getAveragesFromTrips: getAveragesFromTrips,
        divideAndSetAveragesForPeriod: divideAndSetAveragesForPeriod,

        arrayAverage: arrayAverage,
        round: round,
        nrOfDaysBetweenDates: nrOfDaysBetweenDates,

        compareTime: compareTime
    };

})();

$(document).ready(dataController.init);
