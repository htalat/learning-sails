angular.module('SignupModule').controller('SignupController',['$scope','$http','toastr',function($scope,$http,toastr){

  $scope.signupForm = {
    loading: false
  }

  $scope.submitSignupForm = function(){
    $scope.signupForm.loading = true;

    $http.post('/signup',{
        name: $scope.signupForm.name,
        title: $scope.signupForm.title,
        email: $scope.signupForm.email,
        password: $scope.signupForm.password
    })
    .then(function onSuccess(){
      window.location = '/'
    })
    .catch(function onError(sailsResponse){
      var emailAddressAlreadyInUse = sailsResponse.status == 409;
  		if (emailAddressAlreadyInUse) {
  			toastr.error('That email address has already been taken, please try again.', 'Error');
  			return;
  		}
    })
    .finally(function EitherWay(){
      $scope.signupForm.loading  = false;
    })


  };



}]);
