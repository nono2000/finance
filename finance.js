var app = angular.module('finance', []);
app.controller('ShowCtrl',['$scope', '$http','$filter',
	function ShowCtrl($scope, $http, $filter){
		$scope.moneys = [];
		$scope.adddate = $filter('date')(new Date(),'yyyy/MM/dd');
		$scope.payment = 'Cash';
		$scope.searchType = '';
		$scope.predicate = 'adddate';
		$scope.reverse = true;

		getdata();

		function getdata(){
			$http.get('/getdata').
			success(function(data){
				$scope.moneys = data;
			});
		};

		$scope.cancel = function (){
			$scope.item = '';
			$scope.amount = '';
			$scope.payment = '';	  	
		};

		$scope.clear = function (){
			$scope.keyword = '';
			$scope.startDate = '';
			$scope.endDate = '';
			$scope.searchType = '';	
		};

		$scope.save = function (item, amount, payment, today){
			var money = {
				'item': item, 
				'amount': amount, 
				'payment' : payment, 
				'adddate' : today
			};
			$http.post('/new', money).
			success(function(data){
				$scope.moneys.push(data);
				$scope.item = '';
				$scope.amount = '';
				$scope.payment = 'Cash';
	  		});
		};

		$scope.delete = function (money){
			var index = $scope.moneys.indexOf(money);
			$http.delete('/delete/' + money._id).
			success(function(data){
				$scope.moneys.splice(index, 1);
	  		});
		};

		$scope.$watch('filteredMoneys', function() {
			var total = 0;
			angular.forEach($scope.filteredMoneys, function (money) {
				total += money.amount;
			});
			$scope.total = total;
		}, true);
	}
]);

app.filter('daterange', function (){
	return function(items,startDate, endDate){
		var result = [],
			startDate = (startDate && !isNaN(Date.parse(startDate))) ? Date.parse(startDate) : 0,
			endDate = (endDate && !isNaN(Date.parse(endDate))) ? Date.parse(endDate) : new Date().getTime();
 
		if (items && items.length > 0){
			angular.forEach(items, function (item){
				var itemDate = new Date(item.adddate); 
				if (itemDate >=startDate && itemDate <= endDate){
					result.push(item);
				}
			});
 
			return result;
		}
	};
});