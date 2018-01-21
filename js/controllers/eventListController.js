dmm.controller('eventListController', function($http, $rootScope,$window){
	var self = this;
    self.events = [];
    $scope.user =$window.localStorage['user'] || '';
    $rootScope.uname = $scope.user;
    alert("ellc"+$scope.user);

	self.loadEvents = function(){
        $http({
            method: 'POST',
            url: 'http://dmmwebservices.pcfdev.kpit.com/dmm_get_event',
            data: 
            	{
                	"data": {
                    	"event_id": "0"
                	}
				}

        }).then(function successCallback(response) { 
                //console.log(response.data.data)
                self.events = response.data;
                console.log(self.events);
                self.currentRecord = self.events[0];
            }, function errorCallback(response) {
            console.log(response.status + response.statusText );            
        });
    };

    self.loadEvents();

    self.selected = 0;
    

    self.selectEvent = function(index, eid){
        //$rootScope.getEventDetails(eid);
        self.currentRecord = self.events[index];
        self.selected = index;
        console.log(self.currentRecord);
    }

});