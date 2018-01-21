'use strict';


dmm

	// Angular File Upload module does not include this directive
	// Only for example


/**
 * The ng-thumb directive
 * @author: nerv
 * @version: 0.1.2, 2014-01-09
 */
	.directive('ngThumb', ['$window', function ($window) {
		var helper = {
			support: !!($window.FileReader && $window.CanvasRenderingContext2D),
			isFile: function (item) {
				return angular.isObject(item) && item instanceof $window.File;
			},
			isImage: function (file) {
				var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		};

		return {
			restrict: 'A',
			template: '<canvas/>',
			link: function (scope, element, attributes) {
				if (!helper.support) return;

				var params = scope.$eval(attributes.ngThumb);

				if (!helper.isFile(params.file)) return;
				if (!helper.isImage(params.file)) return;

				var canvas = element.find('canvas');
				var reader = new FileReader();

				reader.onload = onLoadFile;
				reader.readAsDataURL(params.file);

				function onLoadFile(event) {
					var img = new Image();
					img.onload = onLoadImage;
					img.src = event.target.result;
				}

				function onLoadImage() {
					var width = params.width || this.width / this.height * params.height;
					var height = params.height || this.height / this.width * params.width;
					canvas.attr({width: width, height: height});
					canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
				}
			}
		};
	}]);

dmm.directive('windowHeight', function ($window) {
	return {
		link: function (scope, elem, attrs) {
			//debugger;
			var IH = $window.innerHeight;
			var eTop = elem.offset().top;
			scope.newH = IH - 100;
			//console.log(IH, scope.newH, eTop);
			angular.element($window).bind('resize', function () {
				//scope.newOH  = $window.outerHeight;
				IH = $window.innerHeight;
				eTop = elem.offset().top;
				scope.newH = IH - 100;
				scope.$apply();
				//console.log(IH, scope.newH, eTop);
			});
		}
	}
});

dmm.directive('elementHeight', function ($window) {
	return {
		link: function (scope, elem, attrs) {
			scope.elementH = elem.outerHeight();
			//console.log(scope.elementH)
			angular.element($window).bind('resize', function () {
				scope.elementH = elem.outerHeight();
				scope.$apply();
				//console.log(scope.elementH)
			});
		}
	}
});

dmm.directive('scrollTop', function ($window) {
	return {
		link: function (scope, elem, attrs) {
			scope.elementH = elem.outerHeight();
			console.log(scope.elementH)
			angular.element($window).bind('resize', function () {
				scope.elementH = elem.outerHeight();
				scope.$apply();
				//console.log(scope.elementH)
			});
		}
	}
});

dmm.directive('toolTip', function () {
	return {
		link: function (scope, elem, attrs) {
			var text = attrs.toolTip;
			var dir = attrs.direction;
            if(typeof(dir)=='undefined')
                dir = 'bottom';

			elem.tooltip({'placement': dir, 'title': text})
		}
	}
});

dmm.directive('checkDate', function () {
	return {
		scope: {edate: "=checkDate" },
		link: function (scope, elem, attrs) {
			var sdate = attrs.startDate;

			elem.change(function(){
				console.log("cdate: "+scope.edate + "  odate" + sdate );
			})
		}
	}
});


dmm.directive('fileUploadUi', function () {
	return {		
		scope: {
			flist: '=ngModel'
		},
		link: function (scope, element, attrs ) {

			element.bind('change', function(){
                scope.$apply(function(){
                    scope.flist = element[0].files;
                });
                console.log(scope.flist)
            });
		}
	}
});


dmm.directive('getTvDetails',function(dmmFactories, $compile, $timeout){
	return{
		link:function(scope, element, attrs){
            var timer;
			element.hover(function () {

				var tvid= attrs.getTvDetails;
				var payload = {"data":{"tv_id":tvid}};

                timer = $timeout(function(){
				//console.log(payload);

                    var template =
                        "<div class='float-dialog'>" +
                            "<table ng-hide='tvEvents.length == 0'>" +
                                "<thead>" +
                                    "<tr>" +
                                        "<th>EVENT ID</th>" +
                                        "<th>NAME</th>" +
                                        "<th>START TIME</th>" +
                                        "<th>END TIME</th>" +
                                    "</tr>" +
                                "</thead>" +
                                "<tbody>" +
                                    "<tr ng-repeat='event in tvEvents'>" +
                                        "<td ng-bind='event.event_id'></td>" +
                                        "<td ng-bind='event.event_title'></td>" +
                                        "<td ng-bind='event.start_datetime | date : \"dd-MMM-yyyy @ HH:mm\" : +0530'></td>" +
                                        "<td ng-bind='event.end_datetime | date : \"dd-MMM-yyyy @ HH:mm\" : +0530'></td>" +
                                    "</tr>" +
                                "</tbody>" +
                            "</table>" +
                            "<span class='ferror' ng-show='tvEvents.length == 0'>No active events to show.</span>" +
                        "</div>";

                    dmmFactories.getTvEvents(payload)
                        .then(function successCallback(response) {
                            scope.tvEvents = response.data;
                            $('.float-dialog').remove();

                            //console.log(scope.tvEvents);
                            element.append(template);
                            $compile(element.contents())(scope);
                        }, function errorCallback(response) {
                            console.log(response.status + response.statusText );
                        });
                },1000);

            },function(){
                element.children('.float-dialog').remove();
                //console.log('out');
                $timeout.cancel(timer);
            })

		}
	}
});

dmm.directive('uniqueTitle', function($filter) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, element, attrs, ngModel) {
            element.change( function () {
                //debugger;
                var result = [];
                var list = JSON.parse(attrs.uniqueTitle);
                ngModel.$setValidity('unique', true);
                result = $filter("filter")( list , {event_title:element.val()}, true );
                if(result.length > 0)
                    ngModel.$setValidity('unique', false);
                scope.$apply();
            });
		}
	};
})
