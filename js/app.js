(function() {
  	'use strict';


  	var app = angular.module('app', ['webmethods', 'ngRoute']);
    
    app.config(function ($routeProvider) {
        $routeProvider
        .when('/',
        {
            templateUrl: '/partials/home.html',
            controller: 'HomeController'
        })
        .when('/Home',
        {
            templateUrl: '/partials/home.html',
            controller: 'HomeController'
        })
        .when('/Recipe',
        {
            templateUrl: '/partials/recipe.html',
            controller: 'RecipeController'
        })
        .when('/Admin',
        {
            templateUrl: '/partials/admin.html',
            controller: 'AdminController'
        })
        .otherwise({redirectTo:'/Home'});
    

	})


    app.controller('RecipeController', ['$scope', 'webmethods', function($scope, webmethods){
        
    }])
    app.controller('HomeController', ['$scope','webmethods', function($scope, webmethods){
        var promise = webmethods.call('GetRecipes');
        promise.then(function(data){
            $scope.data = data;
        })
    }])
    app.controller('AdminController', ['$scope','webmethods', function($scope, webmethods){
        
    }])

    app.directive("navigation", [function(){
        return {

            restrict: 'E'
            , replace: true
            , scope: {}
            , templateUrl : "/partials/navigation.html"
            , controller: ['$scope', '$element', '$sce', 'webmethods', function ($scope, $element, $sce, webmethods) {

                //
            }]
            
        }
    }]);


})();