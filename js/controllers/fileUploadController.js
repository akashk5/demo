
// dmm.controller('fileUploadController', function ($scope, fileUpload) {
//     $scope.uploadFile = function () {
//          //debugger;
//         var file = $scope.myFile;
//         console.log(file);
//         debugger
//         var uploadUrl = "http://10.10.179.76:3002/upload";
//         fileUpload.uploadFileToUrl(file, uploadUrl);
//     };
// });

/*dmm.controller('fileUploadController',['Upload','$window',function(Upload,$window){
    var self = this;
    self.submit = function(){ //function to call on form submit
        if (self.upload_form.file.$valid && self.file) { //check if from is valid
            self.upload(self.file); //call upload function
        }
    }
    
    self.upload = function (file) {
        //debugger;
        console.log(file);
        Upload.upload({            
            url: 'http://10.10.179.76:3001/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            console.log(resp)
            if(resp.data.error_code === 0){ //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        });
    };
}]);*/

dmm.controller('fileUploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.uploadPic = function(file) {
    file.upload = Upload.upload({
      url: 'http://10.10.179.76:3001/upload',
      data: {file: file, eventname:$scope.username},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
      });
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
    }
}]);