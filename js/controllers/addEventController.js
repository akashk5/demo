dmm.controller('addEventController', function ($scope, $http, Upload, $timeout,$rootScope,$window,$filter,$q, dmmFactories) {

    var self = this;
    $scope.user =$window.localStorage['user'] || '';
    //console.log($scope.user);
    $rootScope.uname = $scope.user;
    self.tvs = [];
    self.eventName = '';
    self.eventDesc = '';
    self.isValid = true;
    self.valid = {};
    self.WaitForIt = false;
    self.pattern = /^[a-zA-Z0-9\_\- ]*$/;
    var blankTvs = [];

    //------------------ 1 LOAD ACTIVE TVS
    self.loadTV = function () {
        dmmFactories.getAllTVs()
            .then(function successCallback(response) {
                var rawdata = response.data;
                for(var i in rawdata)
                {
                    var row={isChecked:'', 'tv_id':rawdata[i].tv_id,'tv_name':rawdata[i].tv_name,'startTime':'','endTime':''};
                    self.tvs.push(row);
                    //blankTvs.push(row);
                }
                angular.copy(self.tvs,blankTvs);

            }, function errorCallback(response) {
                console.log(response.status + response.statusText);
            });
    };
    self.loadTV();

    //------------------ 2 CREATE EVENT AND GET EVENT ID
    self.getEventId = function () {
        self.WaitForIt = true;
        var payload = {
            "data":{
                "event_title": self.eventName,
                "event_description": self.eventDesc,
                "username":  $scope.user,
                "event_id": "0"
            }
        };

        dmmFactories.setEvent(payload)
            .then(function successCallback(response) {
                self.eventId = response.data.data.event_id;
                self.uploadPic()
            }, function errorCallback(response) {
                console.log(response.status + response.statusText);
            }
        );
    };

    //------------------ 3 UPLOAD IMAGES and Return PAth then call save image details service
    self.uploadPic = function() {

        self.picFile.upload = Upload.upload({
            url:'http://DMMFileUpload.pcfdev.kpit.com/dmm_setImageUrl',
            data: {file: self.picFile, eventname:self.eventId}
        });

        self.picFile.upload.then(function (response) {
            //console.log(response);
            $timeout(function () {
                self.fileObj = [];
                self.filepath = response.data;
                var result = {'event_id':self.eventId,'image_url':self.filepath.UploadImageResult,'active':'A','record_id':'0','updated_by':$scope.user};
                self.fileObj.push(result);
                self.saveImageUrl();
            });
        }, function (response) {
            if (response.status > 0)
                self.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            self.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };

    //------------------ 4. SAVE IMAGES FOR AN EVENT
    self.saveImageUrl = function () {
        var payload = {"data": self.fileObj};
        dmmFactories.setImageUrl(payload)
            .then(function successCallback(response) {
                self.response = response.data;
                self.saveTvDetails();
            }, function errorCallback(response) {
                console.log(response.status + response.statusText);
            }
        );
    };

    //------------------ 5. PARSE AND SAVE TV SCHEDULE
    self.saveTvDetails = function () {
        self.tvDetails = [];
        for(var i in self.tvs) {
            if(self.tvs[i].isChecked == true){
                var eventdata = {
                    'event_id': self.eventId,
                    'tv_id': self.tvs[i].tv_id,
                    'mod_start_datetime': self.tvs[i].startTime,
                    'mod_end_datetime': self.tvs[i].endTime,
                    'active': 'A',
                    'record_id': '0',
                    'updated_by': $scope.user
                };
                self.tvDetails.push(eventdata);
            }
        }
        var payload = {"data": self.tvDetails};
        dmmFactories.setEventSchedule(payload)
            .then(function successCallback(response) {
                if(response.data[0].message == "Success"){
                    self.WaitForIt = false;
                    $rootScope.$broadcast("closeEvent", {data : self.eventId});
                }

            }, function errorCallback(response) {
                console.log(response.status + response.statusText);
            });
    };

    //------------------ 6. SAVA FINAL DATA
    self.saveData = function(){
        if(self.validateData())
            self.getEventId();
    };

    //------------------ REMOVE FILES FROM IMAGE array
    self.removeImage = function (index) {
        self.picFile.splice(index, 1);
        self.checkFile();
    };

    //------------------ CLEAR DATA
    $scope.$on('clearData',function(){
        self.eventName = '';
        self.eventDesc = '';
        self.picFile = '';
        self.checkMaster = false;
        //self.tvs = blankTvs;
        angular.copy(blankTvs, self.tvs);
        self.WaitForIt = false;
        $timeout(function() {
            self.myForm.$setPristine();
            self.myForm.$setUntouched();
            self.myForm.$submitted = false;
        });

    });

    //------------------ FILE
    self.checkFile = function(){ // FILE ERROR
        if(self.picFile.length == 0 || typeof(self.picFile) == 'undefined')
            self.isFile = true;
        else
            self.isFile = false;
    };

    //------------------ Checkall
    self.checkAll = function(){
       for(var i in self.tvs)
           self.tvs[i].isChecked = self.checkMaster;
    };

    //------------------ minimum one checkbox
    self.anySelected = function() {
            var trues = $filter("filter")( self.tvs , {isChecked:true} );
        if(trues.length > 0)
            self.isTvChecked = true;
        else
            self.isTvChecked = false;
        return trues.length;
    };

    self.validateData = function(){
        //debugger;
        if(self.myForm.eName.$invalid || self.myForm.file.$invalid)
            return false;

        if(typeof(self.picFile) == 'undefined' || self.picFile.length == 0 )
            return false;

        if(!self.isTvChecked)
            return false;

        return true;
    };
});
