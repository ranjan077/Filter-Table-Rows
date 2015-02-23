var app = angular.module('filterapp',[]);
app.controller('filtercontroller', ['$scope', 'persons', 'customFilters', function($scope, persons, customFilters){
	var filters = [];
	var filterEnums = {"All":"All","Resolved":"isResolved","Open":"isResolved","Chronic":"isCronic","Smoke":"isSmoke"};
	$scope.open = false;
	$scope.filter = "All";
	$scope.persons = persons.getPersons();
	$scope.set1Filters = customFilters.getSet1Filters();
	$scope.set2Filters = customFilters.getSet2Filters();
	$scope.setFilter = function(filterName){
		$scope.filter =  customFilters.setFilter(filterName);
	};
	$scope.$watch("filter",function(newVal,oldVal){
		var expression ="";
		$scope.persons = persons.getPersons();
		if(newVal != oldVal){
			if(newVal != "All"){
				filters =customFilters.getFilterTypes();
			
				filters.forEach(function(filter){
					if(filter == "Resolved"){
						expression = "person[filterEnums['"+filter+"']] == true" + " && "+expression;
					}
					else if(filter == "Open"){
						expression = "person[filterEnums['"+filter+"']] == false" + " && "+expression;
					}
					else{
						expression = "person[filterEnums['"+filter+"']] == true" + " && "+expression;
					}
				})
				expression = expression.substring(0, expression.length - 3);

				$scope.persons = $scope.persons.filter(function(person){
					return eval(expression);
				})
			}
			else{
				$scope.persons = persons.getPersons();
			}

		}
	})
}]);

app.factory('persons', function(){
	var persons = [{
		id:1,
		name:"Steve",
		isResolved:true,
		isCronic:false,
		age:20,
		isSmoke:false
	},
	{
		id:2,
		name:"Monica",
		isResolved:true,
		isCronic:true,
		age:25,
		isSmoke:true
	},
	{
		id:3,
		name:"John",
		isResolved:false,
		isCronic:true,
		age:27,
		isSmoke:true
	},
	{
		id:4,
		name:"Robert",
		isResolved:false,
		isCronic:false,
		age:20,
		isSmoke:false
	}];
	
	function getPersons(){
		return persons;
	}
	return {
		getPersons : getPersons
	}
});

app.factory('customFilters', function(){
	var selectedFilter = "";
	var filterTypes = [];
	var set1FilterAddedFlag = false;
	
	var set1Filters = [
	{
		id:2,
		name:"Resolved",
		isChecked:false
	},
	{
		id:3,
		name:"Open",
		isChecked:false
	}];

	var set2Filters = [
		{
			id:1,
			name:"Chronic",
			isChecked:false
		},
		{
			id:2,
			name:"Smoke",
			isChecked:false
		}
	];
	function formatFilter(filterTypes){
		return filterTypes.join("/");
	}
	function getSet1Filters(){
		return set1Filters;
	}
	function getSet2Filters(){
		return set2Filters;
	}
	function setFilter(type){
		var index1 = set1Filters.map(function(filter) { return filter.name; }).indexOf(type);
		var index2 = set2Filters.map(function(filter) { return filter.name; }).indexOf(type);
		
		
		if(filterTypes.indexOf(type) < 0){
			
			if(set1FilterAddedFlag == false && index1 >= 0){
				filterTypes.push(type);
				set1FilterAddedFlag = true ;
				set1Filters[index1].isChecked = !set1Filters[index1].isChecked;
			}
			else if(index2 >= 0){
				filterTypes.push(type);
				set2Filters[index2].isChecked = !set2Filters[index2].isChecked;
			}
			
		}
		else{
			filterTypes.splice(filterTypes.indexOf(type),1);
			if(index1 >= 0){
				set1Filters[index1].isChecked = !set1Filters[index1].isChecked;
				set1FilterAddedFlag = false ;
				if(filterTypes.length == 0){
					return "All";
				}
				
			}
			else{
				
				set2Filters[index2].isChecked = !set2Filters[index2].isChecked;
				if(filterTypes.length == 0){
					return "All";
				}
				
			}
		}
		
		return  formatFilter(filterTypes);
	}
	function getFilterTypes(){
		return filterTypes;
	}

	return {
		getSet1Filters : getSet1Filters,
		getSet2Filters : getSet2Filters,
		setFilter : setFilter,
		getFilterTypes : getFilterTypes
	}
});

app.directive('personDetails', ['$interpolate', function($interpolate){
	
	return {
		
		restrict: 'A',
		compile :function(elem,attrs){
			var interpolation = $interpolate("<td>{{person.id}}</td><td>{{person.name}}</td><td>{{person.isResolved}}</td><td>{{person.isCronic}}</td><td>{{person.isSmoke}}</td><td>{{person.age}}</td>");
			function link(scope,elem,attrs){
				elem.append(interpolation(scope));
			}	
			return link;		
		}
	};
}]);