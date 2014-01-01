var app = angular.module('finance', []);
app.controller('ShowCtrl',['$scope', '$http','$filter',
	function ShowCtrl($scope, $http, $filter){
		$scope.moneys = [];
		$scope.today = $filter('date')(new Date(),'yyyy/MM/dd');
	  $scope.cancel = function (){
	   $scope.item = '';
	   $scope.amount = '';
	   $scope.payment = '';	  	
	  };
	  getdata();
	  $scope.save = function (item, amount, payment, today){
	  	var money = {'item': item, 'amount': amount, 'payment' : payment, 'adddate' : today};
	  	$http.post('/new', money).
	  	success(function(data){
	  	  $scope.moneys.push(data);
	  	  $scope.item = '';
	  	  $scope.amount = '';
	  	  $scope.payment = '';
	  		});	  	
	  };
	  
	  function getdata(){
	  	$http.get('/getdata').
	  	success(function(data){
	  		$scope.moneys = data;
	  	});
	  };		    	  
	}]);