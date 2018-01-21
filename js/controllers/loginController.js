
	dmm.controller('loginController', function($http,$filter,$window,$scope, $rootScope, $location) {
	 
	var self = this;
	self.userName='';
	self.passWord='';
	self.showError = false;
	self.login = {'userName':'','password':''};
	$rootScope.isAuth = false;
	$rootScope.uname = '';
	self.loginUrl = 'https://uat-userauthentication.bdt.kpit.com/userAuthentication';

	self.config = {
		autoHideScrollbar: false,
		theme: 'light',
		advanced:{
			updateOnContentResize: true
		},
		scrollInertia: 0
	};

	//self.loginUrl = 'https://userauthentication.bdt.kpit.com/userAuthentication';

	var user = $window.localStorage['user'] || '';
	if(user == "undefined" || user == ""){
		$rootScope.uname = '';
        $location.path('/login');
    }
	else{
		$rootScope.uname = user;
		$rootScope.isAuth = true;
        $location.path('/events');
	}


	self.reset = function()
	{
		self.userName = "";
	   	self.passWord = "";
		self.showError = false;
	};
	     
	/*function to login the page*/   
	self.LoginSave = function() 
	{
		self.login = {'userName': self.userName, 'password': self.passWord};
		var dataObj1 = {
			"data": {
				"Input_Params": [
					{"key": "userName", "value": self.userName},
					{"key": "password", "value": self.passWord},
					{"key": "deviceId", "value": "123987654"},
					{"key": "tokenIdRequired", "value": "false"},
					{"key": "appKey", "value": "PA"},
					{"key": "appType", "value": "web"}]
			}
		};

		$http.post(self.loginUrl, dataObj1).success(function (response) {

			var status = response.status;

			if (response.status != 200) {
				$rootScope.isAuth = false;
				self.showError = true;
			}
			else {
				self.loginCheck();
                $location.path('/events');

            }

		}).error(function (http, status, fnc, httpObj) {
			console.log('login failed.', http, status, httpObj);
		});


	};

	self.loginCheck = function() {
		$http({
			method: 'POST',
			url: 'http://dmmapp.pcfdev.kpit.com/dmm_user_authentication',
			data: {
				"data": {
					"username": self.userName
				}
			}
		}).then(function successCallback(response) {
			console.log(response.data);

			if(response.data.data.status == '0') {
				$window.localStorage["user"] = self.userName;
				$rootScope.isAuth = true;
				$rootScope.uname = self.userName;
				self.showError = false;
                $location.path('/events');
			}
			else {
				$rootScope.isAuth = false;
				self.showError = true;
			}
		});
	};

	self.logout = function(){
		$window.localStorage["user"] = "";
		$rootScope.isAuth = false;
		$rootScope.uname = "";
		self.userName = "";
		self.passWord = "";
		self.showError = false;
        $location.path('/login');
	}

});

