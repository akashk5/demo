var tvlist;
var tv_id1;
var tv_name1;
var baseUrl="http://dmmapp.pcfdev.kpit.com/";

dmm.controller('tvlistCtrl',function($scope,$http,$rootScope){
	
	$scope.selected=0;

// ------------ web service for get all tv name and id's ----------- 

	$http.post(baseUrl+"dmm_get_tvdetails").success(function(response){
		//alert(JSON.stringify(response));
		var result=JSON.stringify(response);
		$scope.tvlist=response;
		$rootScope.tv_id1=response.tv_id;
		$rootScope.tv_name1=response.tv_name;
	});

// -------- web service for first event displayed on page -----------

	var input={"data":{"tv_id":"1"}};

	$http.post(baseUrl+"dmm_get_tvevents",input).success(function(response){
		//alert(JSON.stringify(response));
		//console.log(JSON.stringify(data));
		var myData=response;
		$scope.imgMyData=myData;
		console.log(myData);
		$scope.tv_id1=myData[0].tv_id;
		$scope.tv_name1=myData[0].tv_name;
			
		$scope.imageToFilter = function() {
			//alert("Call imageToFilter");
        	indexedImages = [];
        	return $scope.imgMyData;
    	}
    
   		$scope.filterImages = function(imgdata) {
    		//alert("Call filterImages");
    		//console.log(imgdata);
        	var imageIsNew = indexedImages.indexOf(imgdata.event_id) == -1;
        		if (imageIsNew) {
           			indexedImages.push(imgdata.event_id);
       		 	}
        	return imageIsNew;
    	}
	});
		
// ---------- function for first selected div --------------

	$scope.selecttv=function(index){
		$scope.selected=index;
	}

// ----------- function for get tv events on div click----------- 

	$scope.gettvdetails=function(index){
		
		var num=$scope.tvlist[index]
		var tv_id=num.tv_id;
		var inputjson={"data":{"tv_id":tv_id}};
		
		$http.post(baseUrl+"dmm_get_tvevents",inputjson).success(function(response){
				
			var myData=response;
			$scope.imgMyData=myData;
			console.log(myData);

			$scope.imageToFilter = function() {
				//alert("Call imageToFilter");
        		indexedImages = [];
        		return $scope.imgMyData;
    		}
    
   			 $scope.filterImages = function(imgdata) {
    			//alert("Call filterImages");
        		var imageIsNew = indexedImages.indexOf(imgdata.event_id) == -1;
        		if (imageIsNew) {
           			indexedImages.push(imgdata.event_id);
       		 	}
        		return imageIsNew;
    		}

    		$scope.tv_id1=num.tv_id;
    		$scope.tv_name1=num.tv_name;
    	});
	}
	
});


