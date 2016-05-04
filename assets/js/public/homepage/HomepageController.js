angular.module('HomepageModule').controller('HomepageController',['$scope','$http','toastr',function($scope,$http,toastr){

  $scope.loginForm = {
    loading:false
  };

  $scope.submitLoginForm = function(){

    $scope.loginForm.loading = true;

    $http.put('/login',{
        email: $scope.loginForm.email,
        password: $scope.loginForm.password
    })
    .then(function onSuccess(){
      window.location = '/';
    })
    .catch(function onError(sailsResponse){
      if (sailsResponse.status === 400 || 404){
        toastr.error('Invalid username/password','Error',{
          closeButton: true
        });
        return;
      }

      toastr.error('An error occurred.','Error',{
        closeButton: true
      });
      return;

    })
    .finally(function eitherWay(){
      $scope.loginForm.loading = false;
    })

  };



}]);
