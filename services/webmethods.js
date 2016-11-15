(function () {
    'use strict';

    var app = angular.module('webmethods', []);

    app.factory('webmethods', function ($http, $q) {
        var serviceObject = {};

        function callUrl(baseUrl, target, params, reassuranceMessage) {
            var parameters = params || {};
            var deferred = $q.defer();

            $http({
                url: baseUrl + target,
                method: 'POST',
                data: parameters
            }).success(function (data, status, headers, config) {
                deferred.resolve(data.d);
                if (reassuranceMessage != null) {
                    // let the caller make any location changes before we add the popup
                    $timeout(function () { notifications.reassure(reassuranceMessage); }, 0);
                }
            }).error(function (error, status, headers, config) {

                alert('An error has occurred. Please try again later or contact the system administrator.');

            });

            return deferred.promise;
        };

        function silentCallUrl(baseUrl, target, params, reassuranceMessage) {
            var parameters = params || {};
            var deferred = $q.defer();

            $http({
                url: baseUrl + target,
                method: 'POST',
                data: parameters
            }).success(function (data, status, headers, config) {
                deferred.resolve(data.d);
            }).error(function (error, status, headers, config) {
                console.log(error);
                alert('An error has occurred. Please try again later or contact the system administrator.');
            });

            return deferred.promise;
        };

        serviceObject.silentCall = function (target, params, reassuranceMessage) {
            return silentCallUrl('/Default.aspx/', target, params, reassuranceMessage);
        };

        serviceObject.call = function (target, params, reassuranceMessage) {
            return callUrl('/Default.aspx/', target, params, reassuranceMessage);
        };

        return serviceObject;
    })

})();

