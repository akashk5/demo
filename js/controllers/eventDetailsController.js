dmm.controller('eventDetailsController', function($http, $uibModal, $timeout, $log, $scope,$rootScope,$window, dmmFactories){
	var self = this;
    $scope.user =$window.localStorage['user'] || '';
    $rootScope.uname = $scope.user;


    //--------------------- EVENT LIST
    self.loadEvents = function(index){
        dmmFactories.getAllEvents()
            .then(function successCallback(response) {
                self.events = response.data;
                //console.log(self.events);
                self.selectEvent(index);
                self.getEventDetails(self.events[index].event_id);
            }, function errorCallback(response) {
                console.log(response.status + response.statusText );
        });
    };
    self.loadEvents(0);


    //----------------- SELECT CURRENT EVENT
    self.selected = 0;
    $rootScope.event = {};
    self.selectEvent = function(index){
        self.currentRecord = self.events[index];
        self.selected = index;
        $rootScope.event.id = self.currentRecord.event_id;
        $rootScope.event.title = self.currentRecord.event_title;
        $rootScope.event.desc = self.currentRecord.event_desc;
    };

    //----------------- SELECT ALL DATA FOR EVENT
    self.getEventDetails =  function(eid){
        var payload ={"data": {"event_id":eid}};

        dmmFactories.getEventDetails(payload)
            .then(function successCallback(response) {
                self.eventDetails = response.data;
                self.tvDetails = response.data.data1;
                //console.log(response.data.data1);
                self.imageDetails = response.data.data2;

                //--------- PARSE IMAGE ARRAY
                self.imgArray = [];
                for(var i in self.imageDetails)
                    self.imgArray.push(self.imageDetails[i].image_url);

                $timeout(function(){
                   $scope.$apply();
                });
                //console.log(self.imgArray)

            }, function errorCallback(response) {
                console.log(response.status + response.statusText);
            });
    };

    //----------------- EXTRACT FILE NAME FROM PATH
    self.getNameByPath = function(path){
        return path.split('\\').pop().split('/').pop();
    };

    //----------------- MODAL EVENTS
    self.showModal = false;
    self.showEditModal = false;

    self.toggleModal = function(){
        $rootScope.$broadcast("clearData")
        self.showModal = !self.showModal;
    };

    self.toggleModalEdit = function(){
        self.showEditModal = !self.showEditModal;
        $rootScope.$broadcast("editEvent");
    };

    $scope.$on("closeEvent",function (e,args) {
        self.loadEvents(self.selected);
        self.getEventDetails(args.data);
        self.showModal = self.showEditModal = false;
    });
});

