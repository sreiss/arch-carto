module.exports = function (Trace) {

    var computeDistance = function(point1, point2) {
        var R = 6378.137;// Radius of earth in KM
        var dLat = (point2.coordinates.latitude - point1.coordinates.latitude) * Math.PI / 180;
        var dLon = (point2.coordinates.latitude - point1.coordinates.latitude) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(point1.coordinates.latitude * Math.PI / 180) * Math.cos(point2.coordinates.latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d * 1000;
    };

    var extractCoherentPoints = function (points) {
        var coherentPoints = [];
        var previousPoint = null;
        points.forEach(function(point) {
            if (previousPoint == null) {
                coherentPoints.push(point);
            } else {

            }
            previousPoint = point;
        });
    };

    return {
        saveTrace: function(rawTrace, callback) {
            var trace = new Trace();
            trace.name = rawTrace.name;
            trace.description = rawTrace.description;
            trace.points = rawTrace.points;
        }
    };

};