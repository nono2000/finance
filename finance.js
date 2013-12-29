var app = angular.module('finance', []);
app.controller('ShowCtrl',['$scope',
	function ShowCtrl($scope){
		$scope.moneys = [];
		$scope.today = new Date();
	  $scope.cancel = function (){
	   $scope.item = '';
	   $scope.amount = '';	  	
	  };
	  $scope.save = function (item, amount){
	  	var money = {'item': item, 'amount': amount};
	  	$scope.moneys.push(money);
	  };
	}]);

