var dmm = angular.module('dmm', ['ngAnimate','ngFileUpload','ui.bootstrap','ui.bootstrap.datetimepicker','ngRoute']);

dmm.config(['$httpProvider','$routeProvider', function($httpProvider, $routeProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider
        .when('/login',{
            templateUrl: 'views/login.html',
            controller: ''
        })
        .when('/events',{
            templateUrl: 'views/eventDetails.html',
            controller: 'eventDetailsController',
            controllerAs: 'EDC'
        })
        .when('/tvlist',{
             templateUrl: 'views/tvlist.html',
            controller: 'tvlistCtrl',
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);
