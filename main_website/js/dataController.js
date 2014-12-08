

dataController = (function() {


    function init() {

    }
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

    function queryURL(url, callback) {

        $.ajax({
            //url: "http://dali.cs.kuleuven.be:8443/qbike/trips" + url,
            url: getTripsURL() + url,
            jsonp: "callback",
            dataType: "jsonp",
            timeout: 70000

        }).done(function(data, textStatus, jqXHR) {

            console.log("Query returned successfully with status: " + textStatus);
            callback(data);

        }).fail(function(jqXHR, textStatus, errorThrown) {

            console.log("Query returned with errors and status: " + textStatus);
            alert("The server appears to be offline or is currently overloaded. We are sorry for the inconvenience.");
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

    function queryPictureDataForMonth(date, callback) {

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

        queryPictureTripsForPeriod(beginDate, endDate, function (trips) {

            callback(divideAndSetAveragesForPeriod(trips, beginDate, endDate));
        });
    }

    function queryPictureTripsForPeriod(beginDate, endDate, callback) {

        var fromDate = "fromDate=" + beginDate.getFullYear() + "-" + (beginDate.getMonth()+1) + "-" + beginDate.getDate();
        var toDate = "toDate=" + endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();

        queryURL("?groupID=cwa3&" + fromDate + "&" + toDate + "&sensorID=8", function (json) {

            console.log("We got " + json.length + " elements for group cwa3 for period beginning " + beginDate + " and ending " + endDate);

            callback(json);
        });
    }

    function queryPictureTrips(callback) {

        queryURL("?sensorID=8&groupID=cwa3", function (json) {

            console.log("We got " + json.length + " elements with pictures.");
            callback(json);
        })
    }



    // Division Methods

    function divideTripsIntoDays(trips, beginDate, endDate) {

        // we calculate the nr of days to make the return array
        var nrOfDays = nrOfDaysBetweenDates(beginDate, endDate);
        var returnData = [];

        for (var i = 0; i < nrOfDays; i++) {

            returnData.push({trips: []});
        }


        $.each(trips, function (index, trip) {

            if (trip.hasOwnProperty("startTime")) {

                var date = new Date(trip.startTime);

                var nrOfDaysFromBeginDate = nrOfDaysBetweenDates(beginDate, date);

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
        var tempReadings = [];
        var humReadings = [];
        var tripsCoordinates = [];
        var heartReadings= [];
        var accReadings = [];
        var totalTime = 0;

        $.each(trips, function(index, trip) {

            if (trip.hasOwnProperty("startTime") && trip.hasOwnProperty("endTime")) {

                var startTime = new Date(trip.startTime);
                var endTime = new Date(trip.endTime);

                var difference = endTime.getTime() - startTime.getTime();
                totalTime = totalTime + difference;

            }


            if (trip.hasOwnProperty("sensorData")) {

                var gpsDataArray = [];
                var singleTripCoordinates = [];


                $.each(trip.sensorData, function(index, sensorValue) {


                    switch(sensorValue.sensorID) {

                        // GPS
                        case 1:
                            console.log(JSON.stringify(sensorValue.data.coordinates));
                            gpsDataArray.push(sensorValue);

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

                        // Acceleration
                        case 5:

                            var x_acc = sensorValue.data[0].acceleration[0].x;
                            var y_acc = sensorValue.data[0].acceleration[0].y;
                            var acceleration = Math.sqrt(Math.pow(x_acc,2) + Math.pow(y_acc,2));
                            // rekening houden met + of - teken --> versnelling of vertraging dus

                        case 9:
                            var heart = parseInt(sensorValue.data[0].value);

                            if (!isNaN(heart)) {

                                heartReadings.push(heart);
                            }

                            break;

                        default:
                    }
                });

                //GPS data is sorted in case it is not in the correct order
                gpsDataArray.sort(compareTime);
                function validCoordinate(c){
                    return Math.abs(c.lat) > .001 && Math.abs(c.lng) > .001;
                }
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
                        if(validCoordinate(coordinateArraySingle)){
                            singleTripCoordinates.push(coordinateArraySingle);
                        }

                    }

                });

                //Each single trip (an array of objects) is added to the array of (multiple) trips
                tripsCoordinates.push(singleTripCoordinates);

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



        var avTemp = arrayAverage(tempReadings);
        var avHum = arrayAverage(humReadings);

        var avSpeed = "No Readings";
        if (totalTime != 0 && totalDist != 0) {
            avSpeed = (totalDist / (totalTime.valueOf() / 1000.0)) * 3.6;
        }

        //totalTime = totalTime.valueOf();

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

    function divideAndSetAveragesForPeriod(trips, beginDate, endDate) {

        console.log("trips:");
        console.log(trips);

        var dividedTrips = divideTripsIntoDays(trips, beginDate, endDate);

        console.log("dividedTrips:");
        console.log(dividedTrips);

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

        var nrOfDays = Math.floor(difference / (1000 * 60 * 60 * 24));

        return nrOfDays;
    }


    // Map Methods

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
