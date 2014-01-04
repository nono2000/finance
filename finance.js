var app = angular.module('finance', []);
app.controller('ShowCtrl',['$scope', '$http','$filter',
	function ShowCtrl($scope, $http, $filter){
		$scope.moneys = [];
		var today = $scope.addDate = $filter('date')(new Date(),'yyyy/MM/dd');
		$scope.payment = 'Cash';
		$scope.searchType = '';
		$scope.predicate = 'addDate';
		$scope.reverse = true;
		$scope.paginate = 10;
		$scope.currentPage = 0;
		$scope.currentNav =  0;
		var	navSize = $scope.navSize = 10,
			totalPages = 0,
			totalNavs = 0;

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
			$scope.payment = 'Cash';
		    $scope.addDate = today;
		};

		$scope.clear = function (){
			$scope.keyword = '';
			$scope.startDate = '';
			$scope.endDate = '';
			$scope.searchType = '';	
		};

		$scope.save = function (item, amount, payment, addDate){
			var date = addDate==today? new Date() : Date.parse(addDate);
			var	money = {
				'item': item,
				'amount': amount, 
				'payment' : payment, 
				'addDate' : date
			};
			$http.post('/new', money).
			success(function(data){
				$scope.moneys.push(data);
				$scope.cancel();
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
			var total = 0,
			    count = 0,
				currentNav = $scope.currentNav,
				currentPage = $scope.currentPage,
				oldTotalPages = $scope.totalPages;
			$scope.pages = [];
			angular.forEach($scope.filteredMoneys, function (money) {
				total += money.amount;
				count += 1;
			});
			$scope.total = total;
			totalPages = $scope.totalPages = Math.ceil(count / $scope.paginate) ;
			totalNavs  = Math.ceil(totalPages / navSize) ;
			for (var i = 0 ; i < totalPages; i++){
				$scope.pages.push({pageNo:i});
			}
			if (totalPages < oldTotalPages){
				if ( currentNav >= totalNavs || currentPage >= totalPages){
					$scope.currentPage = 0;
					$scope.currentNav = 0;
				}
			}
		}, true);

		$scope.navPage = function (index){
			var currentNav = $scope.currentNav;
			if(index < currentNav * navSize ){
				//Prev shifting left
				$scope.shiftNav(currentNav -1);
			} else if (index >= (currentNav + 1) * navSize ){
				//Prev shifting right
				$scope.shiftNav(currentNav + 1);
			} else {
				$scope.currentPage = index < totalPages ? index : totalPages - 1;
			}
		};

		$scope.shiftNav = function (navIndex){
			if ($scope.currentNav < navIndex){
				//Shift right
				$scope.currentPage = navIndex * navSize;
			} else {
				//Shift left
				$scope.currentPage = $scope.currentNav * navSize - 1;
			}
			$scope.currentNav = navIndex < totalNavs ? navIndex : totalNavs - 1;
		};
	}
]);

app.filter('daterange', function (){
	return function(items,startDate, endDate){
		var date = new Date(),
			firstMonthDay = new Date(date.getFullYear(), date.getMonth(), 1),
			lastMonthDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var result = [];
		if (startDate === undefined || isNaN(Date.parse(startDate))){
			if(endDate === undefined || isNaN(Date.parse(endDate))){
				startDate = firstMonthDay,
				endDate = lastMonthDay;
			}else{
				startDate = 0;
				endDate = Date.parse(endDate);
			}
		}else{
			startDate = Date.parse(startDate);
			if(endDate === undefined || isNaN(Date.parse(endDate))){
				endDate = date;
			}else{
				endDate = Date.parse(endDate);
			}
		}
 
		if (items && items.length > 0){
			angular.forEach(items, function (item){
				var itemDate = new Date(item.addDate);
				if (itemDate >=startDate && itemDate <= endDate){
					result.push(item);
				}
			});
 
			return result;
		}
	};
});

app.filter('pagination', function(){
	return function(items, start, perSize){
		var result = [];
		if ( items && items.length > 0){
			result = items.slice(start * perSize, start * perSize + perSize);
		}
		return result;
	};
});

