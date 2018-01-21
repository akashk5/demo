dmm.controller('editEventController', function ($scope, $http, Upload, $timeout,$rootScope,$window,$filter, dmmFactories) {

    var self = this;
    $scope.eventId = '';
    $scope.user =$window.localStorage['user'] || '';
    $rootScope.uname = $scope.user;
    self.tvs = [];
    self.eventName = '';
    self.eventDesc = '';
    self.WaitForIt = false;
    self.pattern = /^[a-zA-Z0-9\_\- ]*$/;

    $scope.$on("editEvent",function () {
        self.allTvs = [];
        self.tvDetails = [];
        self.eventImages = [];
        self.allEventData = [];
        self.eventData = [];
        self.loadTV();
        self.getAllEventData();
        self.WaitForIt = false;
    });

    //------------------ LOAD ACTIVE TVS
    self.loadTV = function () {
        dmmFactories.getAllTVs()
            .then(function successCallback(response) {
            var temp = response.data;
            for(var i in temp)
            {
                var row={isChecked:'', 'tv_id':temp[i].tv_id,'tv_name':temp[i].tv_name,'start_datetime':'','end_datetime':''};
                self.allTvs.push(row);
            }
        }, function errorCallback(response) {
            console.log(response.status + response.statusText);
        });
    };

    //---------------- 1 LOAD ALL EVENT IMAGES
    self.getAllEventData = function () {
        var payload = {
            "data": {
                "event_id": $rootScope.event.id
            }
        };
        dmmFactories.getEventDetails(payload)
            .then(function successCallback(response) {
                //console.log(response.data)
                self.allEventData = response.data;
                self.eventData = self.allEventData.data[0];
                self.picFile = [];

                self.eventTitle = self.eventData.event_title;
                self.eventDescription = self.eventData.event_desc;

                var imgs = self.allEventData.data2;

                self.tvDetails = self.allEventData.data1;
                for (var i in imgs) {
                    if (imgs[i].active == 'A')
                        imgs[i].active = true;
                    else
                        imgs[i].active = false;
                }
                self.eventImages = imgs;
                self.finalTvs = [];
                for (var j in self.allTvs)
                    self.allTvs[j].id = '0';

                //debugger;

                if (self.allTvs.length > 0) {
                    for ( i in self.tvDetails) {
                        for (j in self.allTvs) {
                            if ((self.tvDetails[i].tv_id == self.allTvs[j].tv_id) && self.allTvs[j].isChecked == "") {
                                if(self.tvDetails[i].active == 'A')
                                    self.allTvs[j].isChecked = true;
                                else
                                    self.allTvs[j].isChecked = false;
                                //debugger;
                                self.allTvs[j].end_datetime = new Date(self.tvDetails[i].end_datetime);
                                self.allTvs[j].start_datetime = new Date(self.tvDetails[i].start_datetime);
                                self.allTvs[j].id = self.tvDetails[i].id;
                                break;
                            }
                        }
                    }
                }

            }, function errorCallback(response) {
                console.log(response.status + response.statusText);
            }
        );
    };


    //------------------ 2 SAVE EVENT DATA
    self.setEventData = function () {
        self.WaitForIt = true;
        var payload = {
            "data": {
                "event_title": self.eventTitle,
                "event_description": self.eventDescription,
                "username":  $scope.user,
                "event_id": $rootScope.event.id
            }
        };
        dmmFactories.setEvent(payload)
            .then(function successCallback(response) {

                if(response.data.data.status == "2"){
                    self.uploadPic();
                }
            }, function errorCallback(response) {
                console.log(response.status + response.statusText);
            }
        );
    };

    //------------------ 3 UPLOAD IMAGES and Return PAth then call save image details service
    self.uploadPic = function() {
        self.fileObj = [];

        if(self.picFile.length > 0){ //check if file is empty

            self.picFile.upload = Upload.upload({
                url:'http://DMMFileUpload.pcfdev.kpit.com/dmm_setImageUrl',
                data: {file: self.picFile, eventname: $rootScope.event.id}
            });

            self.picFile.upload.then(function (response) {
                $timeout(function () {
                    self.filepath = response.data;

                    var result = {'event_id':$rootScope.event.id,'image_url':self.filepath.UploadImageResult, 'active':'A','record_id':'0','updated_by':$scope.user};
                    self.fileObj.push(result);
                    self.saveImageUrl();
                });
            }, function (response) {
                if (response.status > 0)
                    self.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                self.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
        else {
            self.saveImageUrl();
        }
    };

    //------------------ 4 SET IMAGE URLS
    self.saveImageUrl = function () {
        for(var i in self.eventImages){
            if (self.eventImages[i].active == true){
                self.eventImages[i].active = 'A';
            }
            else{
                self.eventImages[i].active = 'I';
            }
            var result = {'event_id':$rootScope.event.id,'image_url':self.eventImages[i].image_url,'active':self.eventImages[i].active,'record_id':self.eventImages[i].id,'updated_by':$scope.user};
            self.fileObj.push(result);
        }

        var payload = {"data": self.fileObj};
        dmmFactories.setImageUrl(payload)
            .then(function successCallback(response) {
                self.response = response.data;
                self.saveTvDetails();
            }, function errorCallback(response) {
                console.log(response.status + response.statusText);
        });
    };


    //------------------ 5  PARSE AND SAVE TV SCHEDULE
    self.saveTvDetails = function () {

        self.tvDetailsObj = [];
        for(var i in self.allTvs) {
            if(self.allTvs[i].isChecked === true || self.allTvs[i].isChecked === false){
                if(self.allTvs[i].isChecked == true)
                    var istrue = 'A';
                else
                    istrue = 'I';
                var eventdata = {
                    'event_id': $rootScope.event.id,
                    'tv_id': self.allTvs[i].tv_id,
                    'mod_start_datetime': self.allTvs[i].start_datetime,
                    'mod_end_datetime': self.allTvs[i].end_datetime,
                    'active': istrue,
                    'record_id': self.allTvs[i].id,
                    'updated_by':$scope.user
                };
                self.tvDetailsObj.push(eventdata);
            }
        }

        var payload = {"data": self.tvDetailsObj};
        dmmFactories.setEventSchedule(payload)
            .then(function successCallback(response) {
            if(response.data[0].message == "Success"){
                self.WaitForIt = true;
               $rootScope.$broadcast("closeEvent",{data:$rootScope.event.id});
            }

        }, function errorCallback(response) {
            console.log(response.status + response.statusText);
        });
    };

    //------------- UPDATE FUNCTION
    self.updateData = function(){
        //debugger;
        if(self.validateData())
            self.setEventData();
    };
    //------------------ FILE
    self.checkFile = function(){ // FILE ERROR
        if(self.picFile.length == 0 || typeof(self.picFile) == 'undefined')
            self.isFile = true;
        else
            self.isFile = false;
    };

    //------------------ REMOVE FILES FROM IMAGE array
    self.removeImage = function (index) {
        self.picFile.splice(index, 1);
        self.checkFile();
    };

    //------------------ Checkall
    self.checkAll = function(){
        for(var i in self.allTvs)
            self.allTvs[i].isChecked = self.checkMaster;
    };


    //------------------ minimum one checkbox
    self.anySelected = function() {
        var trues = $filter("filter")( self.allTvs , {isChecked:true} );
        if(typeof(trues)!='undefined') {

            if (trues.length > 0)
                self.isTvChecked = true;
            else
                self.isTvChecked = false;

            return trues.length;
        }

    };

    self.validateData = function(){
        //1 check name
        //debugger;
        if(self.myForm1.eName.$invalid)
            return false;

        if(typeof(self.eventTitle)=='undefined' || self.eventTitle.length < 1)
            return false;

        if(!self.isTvChecked)
            return false;

        return true;
    };
});
