'use strict';

angular.module('myApp.view', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  if(angular.isDefined(localStorage.jwt)){
      $routeProvider.when("/",{
          templateUrl: "view/post.html",
          controller: "ViewCtrl"
      });
  }else {
      $routeProvider.when('/login', {
          templateUrl: 'view/login.html',
          controller: 'ViewCtrl'
      });
  }

}])

.controller('ViewCtrl',function($scope,$http) {
  $scope.submitForm = function () {
      $http({
          method: 'POST',
          url: "http://localhost:3000/login",
          data: $scope.form
      }).then(function successCallback(response) {
          if (response.data.mes == "ok"){
              localStorage.jwt=response.data.jwt;
              window.location.href = "http://localhost:8000/#!/";
          }
      }, function errorCallback(response) {
      });
  };

});