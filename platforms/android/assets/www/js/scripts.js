'use strict';
(function(){
/* Controllers */
angular.module('app.controllers', [])
    .controller('appCtrl', ['$rootScope', '$location', '$state', '$http', '$timeout', 'loginModal', 'onlineBookingAPIFactory',
        function ($rootScope, $location, $state, $http, $timeout, loginModal, onlineBookingAPIFactory) {
            // TODO - add ability to remove alerts by view
            $rootScope.addAlert = function(alert){

                _.forEach($rootScope.alerts, function(existingAlert, index){
                    if(existingAlert && existingAlert.message === alert.message){
                        $rootScope.closeAlert(index);
                    }
                });

                _.assign(alert, {
                    dismissTimeout: alert.type === 'success' ? 3000 : 5000
                });

                $rootScope.alerts.push(alert);
            };

            $rootScope.handleErrors = function(error){
                _.forEach(error.data, function(error){
                    $rootScope.addAlert({
                        type: 'danger',
                        message: error.message ? error.message: error
                    });
                });
            };
            
            $rootScope.closeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            };

            $rootScope.removeAlerts = function(alerts){
                $rootScope.alerts = [];
            };

            $rootScope.logout = function(){
                $http.defaults.headers.common.Authorization = null;
                delete $rootScope.currentUser;
                Intercom('shutdown');
                $rootScope.addAlert({
                    type: 'success',
                    message: 'logged-out'
                });

                loginModal().then(function () {
                    $rootScope.removeAlerts();
                    return $state.go($state.current, {}, {reload: true});
                });
            };

            $rootScope.login = function(){
                loginModal().then(function () {
                    $rootScope.removeAlerts();
                    $state.go('scheduling');
                });
            };

            var startIntercom = function(user, date){
                if(window.Intercom){
                    Intercom('boot', {
                        app_id: "udg0papy",
                        name: user.firstName && user.lastName ? user.firstName + " " + user.lastName : user.email,
                        email: user.email,
                        created_at: date
                    });
                }
            };

            $rootScope.setupCurrentUser = function(user){
                $rootScope.setUserAuth(user.email, user.password)
                startIntercom(user, _.now());
                $rootScope.currentUser = user;
            };

            $rootScope.setUserAuth = function(email, password){
                var authHeader = 'Basic ' + btoa(email + ':' + password);
                $http.defaults.headers.common.Authorization = authHeader;
            };

            $rootScope.redirectToApp = function(){
                $timeout(function(){
                    window.location = 'https://app.coachseek.com';
                }, 5000)
            };

           $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                var requireLogin = toState.data.requireLogin;
                if (requireLogin && !$rootScope.currentUser) {
                    event.preventDefault();

                    loginModal().then(function () {
                        $rootScope.removeAlerts();
                        return $state.go(toState.name, toParams);
                    });
                } else {
                    $rootScope.removeAlerts();
                }
            });

            $rootScope.isCollapsed = true;
            $rootScope.isBigScreen = $(window).width() > 768;
            $(window).on('resize', function () {
                $rootScope.isBigScreen = $(this).width() > 768;
                $rootScope.$apply();
            }); 
        }])
        .controller('loginModalCtrl', ['$scope', 'coachSeekAPIService', '$http', '$activityIndicator', '$window',
            function ($scope, coachSeekAPIService, $http, $activityIndicator, $window) {
            
            $scope.attemptLogin = function (email, password) {
                $scope.removeAlerts();
                if($scope.loginForm.$valid){
                    $scope.setUserAuth(email, password);

                    $activityIndicator.startAnimating();
                    coachSeekAPIService.get({section: 'Business'})
                        .$promise.then(function(business){
                            var user = {
                                email: email,
                                password: password,
                                business: business
                            };
                            $scope.$close(user);
                        }, function(error){
                            $http.defaults.headers.common.Authorization = null;
                            $scope.addAlert({
                                type: 'danger',
                                message: error.statusText
                            });
                        }).finally(function(){
                            $activityIndicator.stopAnimating();
                        });
                } else {
                    var errorTypes = $scope.loginForm.$error;
                    _.forEach(errorTypes, function(errorType, key){
                        _.forEach(errorType, function(error){
                            var errorMessage = error.$name;
                            $scope.addAlert({
                                type: 'warning',
                                message: 'businessSetup:' + errorMessage + '-invalid'
                            });
                        });
                    });
                }
            };

            $scope.cancel = $scope.$dismiss;
        }])
        .controller('comingSoonCtrl', ['$scope', 
            function ($scope) {
                $scope.saveFeedback = function(){
                    Intercom('trackEvent', 'feedback', {feedback: $scope.feedback});
                    $scope.feedbackSent = true;
                };
        }]);
angular.module('app.directives', [])
    .directive('durationPicker', function(){
        return {
            scope: {
                duration: '='
            },
            restrict: "E",
            templateUrl: 'app/partials/durationPicker.html',
            link: function(scope, elem){
                scope.editingTime = false;

                var durationCopy,
                    minutes,
                    hours,
                    $timePickerContainer = angular.element(elem.find('.time-picker-container'));

                scope.$watch('duration', function(newVal) {
                    scope.duration = newVal;
                    if(scope.duration){
                        hours = Math.floor( scope.duration / 60);          
                        minutes = scope.duration % 60;

                        scope.time = displayHours() + ":" + displayMinutes();
                    }
                });

                scope.$watch('time', function(newVal, oldVal){
                    if(newVal){
                        var timeArray = scope.time.split(":");
                        hours = parseFloat(timeArray[0]);
                        minutes = parseFloat(timeArray[1]);

                        if(hours === 0 && minutes === 0){
                            scope.time = oldVal;
                        } else {
                            scope.duration = (hours * 60) + minutes;
                        }
                    }
                });

                scope.editTime = function(currentTime){
                    if(!scope.editingTime) {
                        durationCopy = angular.copy(scope.duration);
                        scope.editingTime = true;
                    }
                };

                scope.$on('closeTimePicker', function(event, resetTime){
                    if(resetTime && durationCopy){
                        scope.duration = durationCopy;
                    } 
                    scope.editingTime = false;
                    $timePickerContainer.one('$animate:after', function(){
                        durationCopy = null;
                    });
                });

                /* Displays minutes */
                var displayMinutes = function () {
                    return minutes <= 9 ? "0" + minutes : minutes;
                };

                var displayHours = function () {
                    return hours <= 9 ? "0" + hours : hours;
                };
            }
        };
    })
    .directive('activityIndicator', function(){
        return {
            replace: true,
            templateUrl: 'app/partials/activityIndicator.html'
        };
    })
    .directive('ngTabAdd', function(){
        return function (scope, element, attrs) {
            $(window).on("keydown keypress", function (event) {
                if(event.which === 9) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngTabAdd);
                    });
                }
            });
        };
    })
    .directive('ngEnter', function(){
        return function (scope, element, attrs) {
            element.on("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })
    .directive('selectArrows', function(){
        return {
            restrict: "E",
            templateUrl:'app/partials/selectArrows.html'    
        };
    })
    .directive('ellipsisAnimated', function () {
        return {
            restrict: "EAC",
            templateUrl:'app/partials/ellipsisAnimated.html'
        };
    })
    .directive('loadingAnimation', function () {
        return {
            restrict: "E",
            templateUrl:'app/partials/loadingAnimation.html'
        };
    });
/* App Module */
angular.module('app',
  [
    // LIBRARIES
    'ngAnimate',
    'ngMessages',
    'ngSanitize',
    'ngResource',
    'ngTouch',
    'ui.bootstrap',
    'ui.router',
    'jm.i18next',
    'angularMoment',

    // coachSeekApp
    'app.controllers',
    'app.services',
    'app.directives',

    // MODULES
    'businessSetup',
    'scheduling',
    'customers',
    'booking',

    // UTILITIES
    'ngActivityIndicator',
    'ngClipboard'

    ]).config(['$i18nextProvider', function( $i18nextProvider ){
        $i18nextProvider.options = {
            lng: 'en',
            fallbackLng: 'en',
            ns : {
                namespaces : ['app', 'businessSetup', 'scheduling', 'customers', 'booking'],
                defaultNs: 'app'
            },
            resGetPath: 'i18n/__lng__.json',
            defaultLoadingValue: ''
        };
    }])
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get("$state");
            $state.go("scheduling");
        });

        $stateProvider
            .state('comingSoon', {
                templateUrl: "app/partials/comingSoon.html",
                controller: 'comingSoonCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('comingSoon.dashboard', {
                url: "/dashboard/coming-soon"
            }).state('comingSoon.financials', {
                url: "/financials/coming-soon"
            });
    }])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }])
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams){
            FastClick.attach(document.body);

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.alerts = [];
    }]);

angular.module('app.services', [])
    // TODO change name to coachseekAPIFactory
    .factory('coachSeekAPIService', ['$resource', function($resource) {
        return $resource('https://api.coachseek.com/:section/:id');
            //   DEFAULT RESOURCE FUNTIONS
            //   'get':    {method:'GET'},
            //   'save':   {method:'POST'},
            //   'query':  {method:'GET', isArray:true},
            //   'remove': {method:'DELETE'},
            //   'delete': {method:'DELETE'}
    }])
    .factory('anonCoachseekAPIFactory', ['$resource', function($resource){
        return {
            anon: function (subdomain) {
                return $resource('https://api.coachseek.com/:section/:id', {}, {
                    get:   {method: 'GET', headers: {'Business-Domain': subdomain}},
                    // query: {method: 'GET', isArray:true, headers: {'Business-Domain': subdomain}},
                    // save:  {method: 'POST', headers: {'Business-Domain': subdomain}}
                })
            }
        };
    }])
    .service('CRUDService', ['coachSeekAPIService', '$activityIndicator',
        function(coachSeekAPIService, $activityIndicator){

        this.get = function(functionName, $scope){
            $activityIndicator.startAnimating();
            coachSeekAPIService.query({section: functionName})
                .$promise.then(function(itemList){
                    //set list data or create first item
                    if(_.size(itemList)){
                        $scope.itemList = itemList;
                    } else {
                        $scope.itemList = [];
                        $scope.createItem();
                    }
                }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
        };

        this.update = function(functionName, $scope, item){
            $activityIndicator.startAnimating();
            return coachSeekAPIService.save({section: functionName}, item)
                .$promise.then(function(item){
                    if($scope.itemList) $scope.itemList.push(item);
                    if($scope.newItem){
                        var updateObject = {};
                        updateObject[functionName] = $scope.itemList.length;
                        Intercom('update', updateObject);
                    }
                    resetToList($scope);
                    $scope.addAlert({
                        type: 'success',
                        message: "businessSetup:save-success",
                        name: item.name ? item.name: findName(item)
                    });
                    $scope.$broadcast('updateSuccess');
                    return item;
                }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
        };

        this.cancelEdit = function($scope){
            if(!$scope.newItem){
                $scope.itemList.push($scope.itemCopy);
            }
            resetToList($scope);
        };
        this.validateForm = function($scope){
            var valid = $scope.itemForm.$valid;

            if(!valid){
                var errorTypes = $scope.itemForm.$error;
                _.forEach(errorTypes, function(errorType, key){
                    _.forEach(errorType, function(error){
                        var errorMessage = error && error.$name ? error.$name : key;
                        $scope.addAlert({
                            type: 'warning',
                            message: 'businessSetup:' + errorMessage + '-invalid'
                        });
                    });
                });
            }
            return valid;
        };

        var resetToList = function($scope){
            $scope.item = null;
            $scope.itemForm.$setPristine();
            $scope.itemForm.$setUntouched();
            $scope.removeAlerts();
            $scope.newItem = null;
            $scope.itemCopy = null;
        };

        var findName = function(item){
            if(item.firstName && item.lastName){
                return item.firstName + " " + item.lastName;
            } else if (item.business) {
                return item.business.name;
            }
        };
    }])
    .service('loginModal', ['$modal', '$rootScope',
        function ($modal, $rootScope) {
            function assignCurrentUser (user) {
                $rootScope.setupCurrentUser(user);
                return user;
            }

            return function() {
                var instance = $modal.open({
                    templateUrl: 'app/partials/loginModal.html',
                    controller: 'loginModalCtrl',
                    backdropClass: 'modal-backdrop',
                    backdrop: 'static',
                    keyboard: false
                });

                return instance.result.then(assignCurrentUser);
            };
        }
    ]);
angular.module('booking.controllers', [])
    .controller('bookingCtrl', ['$scope', '$state', 'onlineBookingAPIFactory', 'currentBooking',
      function($scope, $state, onlineBookingAPIFactory, currentBooking){
        $scope.currentBooking = currentBooking;

        $scope.selectEvent = function (event) {
            if($scope.selectedEvent !== event){
                currentBooking.resetBooking()
                $scope.selectedEvent = event;
                $scope.availableSessions = _.filter(event.sessions, function(session){
                    return !$scope.isBefore(session) && $scope.getSessionSpacesAvailable(session) > 0
                });
                if(!event.sessions || (event.pricing.coursePrice && !event.pricing.sessionPrice)) $scope.toggleEntireCourse();
            }
        };

        $scope.closeEvent = function(){
            event.stopPropagation();
            currentBooking.resetBooking();
            delete $scope.selectedEvent;
        };

        $scope.toggleSessionSelect = function(session){
            if(_.includes(currentBooking.booking.sessions, session)){
                currentBooking.booking.sessions = _.without(currentBooking.booking.sessions, session);
            } else {
                currentBooking.booking.sessions.push(session);
            }

            if(_.size(currentBooking.booking.sessions) === _.size($scope.availableSessions) ){
                currentBooking.booking.course = $scope.selectedEvent;   
            } else {
                currentBooking.booking.course = null;   
            }
        };

        //TODO don't set course if all arent available?
        $scope.toggleEntireCourse = function(){
            if(currentBooking.booking.course === $scope.selectedEvent){
                currentBooking.resetBooking();
            } else {
                currentBooking.booking = {
                    course: $scope.selectedEvent,
                    sessions: $scope.availableSessions
                }
            }
        };

        $scope.getSessionSpacesAvailable = function(session){
            var spacesAvailable = session.booking.studentCapacity - session.booking.bookingCount;
            return spacesAvailable > 0 ? spacesAvailable : 0;
        };

        $scope.isBefore = function(session){
            return moment(session.timing.startDate, "YYYY-MM-DD").isBefore(moment());
        };

    }])
    .controller('bookingSelectionCtrl', ['$scope', 'anonCoachseekAPIFactory', 'currentBooking',
      function($scope, anonCoachseekAPIFactory, currentBooking){
        var locationEvents,
            serviceEvents,
            allEvents;

        $scope.locations = [];
        $scope.services = [];

        $scope.$watch('currentBooking.filters.service', function(newService){
            if(_.size(newService)){
                $scope.loadingSessions = true;
                anonCoachseekAPIFactory.anon($scope.business.domain).get({section: 'Services', id: newService.id})
                    .$promise.then(function(service){
                        $scope.serviceDescription = service.description;
                    }, $scope.handleErrors).finally(function(){
                        $scope.loadingSessions = false;
                });
            }
        });

        $scope.filterByLocation = function (resetBooking) {
            if(resetBooking){
                currentBooking.resetBooking();
                delete currentBooking.filters.service;
            }

            delete $scope.selectedEvent;
            delete $scope.serviceDescription;

            locationEvents = _.filter(currentBooking.allEvents, function(event){
                return event.location.id === $scope.currentBooking.filters.location.id;
            });
            $scope.services = [];
            _.each(locationEvents, function(event){
                if(!serviceAlreadyAdded(event.service.id)) {
                    $scope.services.push(event.service);
                }
            });
            filterEvents();
        };

        $scope.filterByService = function (resetBooking) {
            if(resetBooking) currentBooking.resetBooking();
            delete $scope.selectedEvent;
            delete $scope.serviceDescription;

            serviceEvents = _.filter(currentBooking.allEvents, function(event){
                return event.service.id === $scope.currentBooking.filters.service.id;
            });
            filterEvents();
        };


        function filterEvents(){
            $scope.events = _.intersection(locationEvents, serviceEvents)
        };

        $scope.disableContinue = function(){
            return _.isEmpty(currentBooking.booking.sessions) && _.isEmpty(currentBooking.booking.course);
        }

        function serviceAlreadyAdded(serviceId){
            return _.find($scope.services, function(service){
                return service.id === serviceId
            });
        };

        function locationAlreadyAdded(locationId){
            return _.find($scope.locations, function(location){
                return location.id === locationId
            });
        };

        function getNewDate(timing){
            return moment(timing.startDate, "YYYY-MM-DD");
        };

        function buildLocationsAndServices(){
            _.each(currentBooking.allEvents, function(event){
                if(!locationAlreadyAdded(event.location.id)) {
                    $scope.locations.push(event.location);
                }

                if(!serviceAlreadyAdded(event.service.id)) {
                    $scope.services.push(event.service);
                }
            });
        }

        if(!currentBooking.allEvents){
            delete $scope.serviceDescription;

            $scope.loadingSessions = true;            
            currentBooking.getAllEvents($scope.business.domain).then(function(events){
                currentBooking.allEvents = _.sortBy(_.union(events.courses, events.sessions),function(event){
                    return getNewDate(event.timing).valueOf();
                });
                $scope.eventsExist = _.size(currentBooking.allEvents);
                buildLocationsAndServices();
            }, $scope.handleErrors).finally(function(){
                $scope.loadingSessions = false;
            });
        } else {
            $scope.eventsExist = _.size(currentBooking.allEvents);
            buildLocationsAndServices();
            $scope.filterByLocation();
            $scope.filterByService();
        }
    }])
    .controller('bookingCustomerDetailsCtrl', ['$scope', '$state', 'currentBooking', function($scope, $state, currentBooking){
        if(!currentBooking.filters.location){
            $state.go('booking.selection');
        }
    }])
    .controller('bookingPaymentCtrl', ['$scope', function($scope){
      // GARRET PLAYS HERE
      //TODO: Grab booking detail data
      //and attach to the hidden forms as ng-values..
      
      //inititate paypal processing
      //I don't think we'll need a post here...
      $scope.initPaypalPayment = function () {
        if ($scope.coursePaymentPrice === null) {
          return;
        } else {
          //TODO: Post to paypal return callback to confirmation page
        }
            
      };
      
      //Post booking as unpayed
      $scope.payLaterCall = function () {
        
      };
    }])
    .controller('bookingConfirmationCtrl', ['$scope', '$q', '$state', 'onlineBookingAPIFactory', 'currentBooking',
      function($scope, $q, $state, onlineBookingAPIFactory, currentBooking){
        $scope.bookingConfirmed = false;

        if(!currentBooking.filters.location){
            $state.go('booking.selection');
        }

        $scope.processBooking = function () {
            $scope.processingBooking = true;
            onlineBookingAPIFactory.anon($scope.business.domain)
                .save({ section: 'Customers' }, currentBooking.customer).$promise
                    .then(function (customer) {
                        $q.all(getSessionsToBook(customer)).then(function () {
                            $scope.bookingConfirmed = true;
                        }, $scope.handleErrors).finally(function(){
                            $scope.processingBooking = false;
                        });
                }, $scope.handleErrors);
        };

        function getSessionsToBook(customer){
            if(currentBooking.booking.course && _.size($scope.availableSessions) === _.size(currentBooking.booking.course.sessions)){
                return getBookingCall(currentBooking.booking.course, customer)
            } else if (currentBooking.booking.sessions){
                var bookingPromises = [];
                _.each(currentBooking.booking.sessions, function(session){
                    bookingPromises.push(getBookingCall(session, customer));
                });
                return bookingPromises;
            }
        };

        function getBookingCall(session, customer){
            var bookingData = {
                customer: customer,
                session: session,
                paymentStatus: "awaiting-invoice",
                hasAttended: false
            }
            return onlineBookingAPIFactory.anon($scope.business.domain).save({ section: 'Bookings' }, bookingData).$promise;
        };


        $scope.resetBookings = function () {
            currentBooking.resetBooking();
            currentBooking.filters = {};
            delete currentBooking.allEvents;
            $state.go('booking.selection');
        };
    }])
    .controller('bookingAdminCtrl', ['$scope', '$templateCache', '$compile', function($scope, $templateCache, $compile){
        var markup = $templateCache.get('booking/partials/bookNowButton.html');
        var view = $compile(markup)($scope);
        _.defer(function(){
            $scope.buttonHTML = view.get(0).outerHTML;
            $scope.$apply();
        })
    }]);
angular.module('booking.directives', [])
    .directive('bookingRectangle', function(){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingRectangle.html',
            link: function(scope){
                scope.selected = false;
                var startDate = moment(scope.event.timing.startDate + " " + scope.event.timing.startTime, "YYYY-MM-DD HH:mm");
                scope.spacesAvailable = getSpacesAvailable();
                scope.fullCoursePrice = getFullCoursePricePrice();

                function getFullCoursePricePrice(){
                    var event = scope.event;
                    if(scope.isBefore(event)){
                        // SUM SESSION PRICES
                        if(event.pricing.sessionPrice >= 0){
                            return sumSessionCosts(event.sessions);
                        // PRO RATE
                        } else {
                            var numSessionsInFuture = _.size(_.filter(event.sessions, function(session){return !scope.isBefore(session)}));
                            return (event.pricing.coursePrice / event.repetition.sessionCount * numSessionsInFuture).toFixed(0);
                        }
                    } else {
                        return event.pricing.coursePrice || sumSessionCosts(event.sessions);
                    }
                };

                function sumSessionCosts(sessions){
                    return _.sum(sessions, function(session){
                        if(scope.isBefore(session) || scope.getSessionSpacesAvailable(session) <= 0){
                            return 0;
                        }else{
                            return session.pricing.sessionPrice;
                        }
                    });
                };

                scope.getEventDateRange = function(){
                    if(scope.event.sessions){
                        var repetition = scope.event.repetition;
                        return startDate.format('dddd Do MMM') +  " – " + startDate.clone().add(repetition.sessionCount - 1, repetition.repeatFrequency).format('dddd Do MMM');
                    } else {
                        return startDate.format('dddd Do MMM');
                    }
                };

                scope.getEventTimeRange = function(){
                    return startDate.format('h:mm A') + " – " + startDate.clone().add(scope.event.timing.duration, 'minutes').format('h:mm A');
                };

                function getSpacesAvailable(){
                    var booking = scope.event.booking;
                    var spacesAvailable;
                    if(scope.event.sessions){
                        spacesAvailable = booking.studentCapacity - getMaxBookingSessionCount();
                    } else {
                        spacesAvailable = booking.studentCapacity - booking.bookingCount;
                    }
                    return spacesAvailable > 0 ? spacesAvailable : 0;
                };

                function getMaxBookingSessionCount(){
                    var sessions = _.filter(scope.event.sessions, function(session){
                        return getNewDate(session.timing).isAfter();
                    });
                    return _.max(sessions, "booking.bookingCount").booking.bookingCount;
                };

                function getNewDate(timing){
                    return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm")
                }

                scope.toggleEventSelect = function(){
                    scope.selected = !scope.selected;
                    scope.selectEvent(scope.event)
                };
            }
        };
    })
    .directive('bookingCourseSessions', ['currentBooking', function(currentBooking){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingCourseSessions.html',
            link: function(scope){

                scope.getSessionDate = function(session){
                    return getNewDate(session.timing).format('dddd Do MMM');
                };

                scope.getEventTimeRange = function(session){
                    var startDate = getNewDate(session.timing)
                    return startDate.format('h:mm A') + " – " + startDate.clone().add(session.timing.duration, 'minutes').format('h:mm A');
                };

                function getNewDate(timing){
                    return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm")
                }

                scope.isSelected = function(session){
                    return _.includes(currentBooking.booking.sessions, session);
                };
            }
        };
    }])
    .directive('bookingDateRange', ['currentBooking', function(currentBooking){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingDateRange.html',
            link: function(scope){
                // TODO this is nasty. pare this down.
                scope.calculateBookingDateRange = function(){
                    if(currentBooking.booking.course){
                        var course = currentBooking.booking.course;
                        var dateRange = getNewDateRange(course.timing, course.repetition);
                        if(_.size(currentBooking.booking.sessions)){
                            return dateRange.start.format('dddd Do MMM') + " – " + dateRange.end.format('dddd Do MMM');
                        } else {
                            return dateRange.start.format('dddd Do MMM');
                        }
                    } else if (currentBooking.booking.sessions) {
                        var dates = [];
                        _.each(currentBooking.booking.sessions, function(session){
                            dates.push(getNewDate(session.timing));
                        });

                        dates = _.sortBy(dates, function(date){return date.valueOf();});
                        if(_.size(dates) === 1 ){
                            return _.first(dates).format('dddd Do MMM');
                        } else if (_.size(dates)){
                            var dateRange = moment.range(_.first(dates), _.last(dates));
                            return dateRange.start.format('dddd Do MMM') + " – " + dateRange.end.format('dddd Do MMM');
                        }
                    }
                };

                function getNewDate(timing){
                    return moment(timing.startDate, "YYYY-MM-DD");
                };

                function getNewDateRange(timing, repetition){
                    var startDate = moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm");
                    var endDate = startDate.clone().add(repetition.sessionCount - 1, repetition.repeatFrequency);
                    return moment.range(startDate, endDate);
                };
            }
        };
    }])
    .directive('bookingPrice', ['currentBooking', function(currentBooking){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingPrice.html',
            link: function(scope){
                scope.calculateTotalPrice = function(){
                    var course = currentBooking.booking.course;
                    if(course){
                        // STANDALONE SESSION
                        if(!course.sessions) {
                            return course.pricing.sessionPrice.toFixed(2);
                        // COURSE IN PAST
                        } else if(isBefore(course)){
                            if(course.pricing.coursePrice && !course.pricing.sessionPrice){
                                //PRO RATE
                                var numSessionsInFuture = _.size(_.filter(course.sessions, function(session){return !isBefore(session)}));
                                return (course.pricing.coursePrice / course.repetition.sessionCount * numSessionsInFuture).toFixed(2);
                            } else {
                                return (_.size(scope.availableSessions) * course.pricing.sessionPrice).toFixed(2);
                            }
                        // COURSE IN FUTURE
                        } else {
                            if(course.pricing.coursePrice){
                                return course.pricing.coursePrice.toFixed(2);
                            } else {
                                return (_.size(scope.availableSessions) * course.pricing.sessionPrice).toFixed(2);
                            }
                        }
                    // ONLY COURSE SESSIONS SELECTED
                    } else if (currentBooking.booking.sessions){
                        return _.sum(currentBooking.booking.sessions, 'pricing.sessionPrice').toFixed(2);
                    //NOTHING SELECTED
                    } else {
                        return "0.00"
                    }
                };

                function isBefore(session){
                    return moment(session.timing.startDate, "YYYY-MM-DD").isBefore(moment());
                };
            }
        };
    }]);
angular.module('booking', [
        'booking.controllers',
        'booking.directives',
        'booking.services'
    ])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('bookingAdmin', {
                url: "/booking-admin",
                templateUrl: "booking/partials/bookingAdminView.html",
                controller: 'bookingAdminCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('booking', {
                url: "/booking",
                abstract: true,
                templateUrl: "booking/partials/booking.html",
                controller: 'bookingCtrl'
            })
            .state('booking.selection', {
                url: "/selection",
                views: {
                    "booking-view": { 
                        templateUrl: "booking/partials/bookingSelectionView.html",
                        controller: 'bookingSelectionCtrl'
                    }
                },
                data: {
                    requireLogin: false,
                    requireBusinessDomain: true
                }
            })
            .state('booking.details', {
                url: "/details",
                views: {
                    "booking-view": { 
                        templateUrl: "booking/partials/bookingCustomerDetailsView.html",
                        controller: 'bookingCustomerDetailsCtrl'
                    }
                },
                data: {
                    requireLogin: false,
                    requireBusinessDomain: true
                }
            })
            .state('booking.payment', {
                url: "/payment",
                views: {
                    "booking-view": { 
                        templateUrl: "booking/partials/bookingPaymentView.html",
                        controller: 'bookingPaymentCtrl'
                    }
                },
                data: {
                    requireLogin: false,
                    requireBusinessDomain: true
                }
            })
            .state('booking.confirmation', {
                url: "/confirmation",
                views: {
                    "booking-view": { 
                        templateUrl: "booking/partials/bookingConfirmationView.html",
                        controller: 'bookingConfirmationCtrl'
                    }
                },
                data: {
                    requireLogin: false,
                    requireBusinessDomain: true
                }
            });
    }]);
angular.module('booking.services', [])  
    .factory('onlineBookingAPIFactory', ['$resource', function($resource){
        return {
            anon: function (subdomain) {
                return $resource('https://api.coachseek.com/OnlineBooking/:section', {}, {
                    get:   {method: 'GET', headers: {'Business-Domain': subdomain}},
                    query: {method: 'GET', isArray:true, headers: {'Business-Domain': subdomain}},
                    save:  {method: 'POST', headers: {'Business-Domain': subdomain}}
                })
            }
        };
    }])
    .service('currentBooking', ['onlineBookingAPIFactory', function(onlineBookingAPIFactory){
        this.customer = {};
        this.booking = {
            sessions: []
        };
        this.filters = {};

        this.resetBooking = function(){
            this.booking = {
                sessions: []
            };
        }

        this.getAllEvents = function(businessDomain){
            var params = {
                endDate: moment().add(12, 'week').format('YYYY-MM-DD'),
                startDate: moment().add(1, 'day').format('YYYY-MM-DD'),
                section: 'Sessions'
            };

            return onlineBookingAPIFactory.anon(businessDomain).get(params).$promise;
        };
    }]);
angular.module('businessSetup.controllers', [])
    .controller('businessRegistrationCtrl', ['$scope', 'coachSeekAPIService', 'CRUDService', '$activityIndicator', '$state',
        function($scope, coachSeekAPIService, CRUDService, $activityIndicator, $state){
        $scope.business = {};
        $scope.admin = {};

        $scope.saveItem = function(){
            var formValid = CRUDService.validateForm($scope);

            if(formValid){
                $activityIndicator.startAnimating()
                coachSeekAPIService.save({section: 'businessRegistration'}, {admin: $scope.admin, business: $scope.business})
                    .$promise.then(function(newBusiness){
                        $scope.setupCurrentUser({
                            email: $scope.admin.email,
                            password: $scope.admin.password,
                            business: newBusiness.business
                        });
                        $state.go('businessSetup.locations');
                    }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
            }
        };
    }])
    .controller('businessCtrl', ['$scope', 'CRUDService',
        function($scope, CRUDService){
        $scope.editItem = function(){
            $scope.itemCopy = angular.copy($scope.business);

            $scope.item = $scope.business;
        };

        $scope.saveItem = function(business){
            var formValid = CRUDService.validateForm($scope);

            if(formValid){
                CRUDService.update('Business', $scope, business)
                    .then(function(business){
                        $scope.currentUser.business = business;
                    });
            }
        };

        $scope.cancelEdit = function(){
            $scope.business = $scope.itemCopy
            $scope.item = null;
            $scope.itemForm.$setPristine();
            $scope.itemForm.$setUntouched();
            $scope.removeAlerts();
            $scope.itemCopy = null;
        };

        $scope.business = $scope.currentUser.business;
    }])
    .controller('locationsCtrl', ['$scope', 'CRUDService',
        function($scope, CRUDService){

            $scope.createItem = function(){
                if(!$scope.item){
                    $scope.newItem = true;
                    $scope.item = {};
                }
            };

            $scope.editItem = function(location){
                _.pull($scope.itemList, location);
                $scope.itemCopy = angular.copy(location);
                
                $scope.item = location;
            };

            $scope.saveItem = function(location){
                var formValid = CRUDService.validateForm($scope);
                if( formValid ){
                    CRUDService.update('Locations', $scope, location);
                }
            };

            $scope.cancelEdit = function(){
                CRUDService.cancelEdit($scope);
            };

            $scope.$watch('item.name', function(newVal){
                if( _.find($scope.itemList, {name: newVal}) ){
                    $scope.itemForm.name.$setValidity('duplicatename', false);
                } else {
                    $scope.itemForm.name.$setValidity('duplicatename', true);
                }
            });

            CRUDService.get('Locations', $scope);
    }])
    .controller('coachesCtrl', ['$scope', 'CRUDService', 'coachDefaults',
        function ($scope, CRUDService, coachDefaults) {

        $scope.createItem = function(){
            if(!$scope.item){
                $scope.newItem = true;
                $scope.item = angular.copy(coachDefaults);
            }
        };
        
        $scope.editItem = function(coach){
            _.pull($scope.itemList, coach);
            $scope.itemCopy = angular.copy(coach);
            $scope.item = coach;
        };

        $scope.cancelEdit = function(){
            $scope.$broadcast('closeTimePicker', true);
            CRUDService.cancelEdit($scope);
        };

        $scope.saveItem = function(coach){
            var formValid = CRUDService.validateForm($scope);
            if( formValid ){
                $scope.$broadcast('closeTimePicker', false);
                CRUDService.update('Coaches', $scope, coach);
            }
        };

        $scope.$watchGroup(['item.firstName', 'item.lastName'], function(newValues){
            var firstName = newValues[0];
            var lastName  = newValues[1];
            if( _.find($scope.itemList, {firstName: firstName, lastName: lastName}) ){
                $scope.itemForm.firstName.$setValidity('duplicatename', false);
                $scope.itemForm.lastName.$setValidity('duplicatename', false);
            } else {
                $scope.itemForm.firstName.$setValidity('duplicatename', true);
                $scope.itemForm.lastName.$setValidity('duplicatename', true);
            }
        });

        CRUDService.get('Coaches', $scope);
    }])
    .value('coachDefaults', {
            workingHours: {
                monday: { 
                    isAvailable: true,
                    startTime: "9:00",
                    finishTime: "17:00"
                },
                tuesday: {
                    isAvailable: true,
                    startTime: "9:00",
                    finishTime: "17:00"

                }, 
                wednesday: {
                    isAvailable: true,
                    startTime: "9:00",
                    finishTime: "17:00"

                },
                thursday: {
                    isAvailable: true,
                    startTime: "9:00",
                    finishTime: "17:00"

                },
                friday: {
                    isAvailable: true,
                    startTime: "9:00",
                    finishTime: "17:00"

                },
                saturday: {
                    isAvailable: false,
                    startTime: "9:00",
                    finishTime: "17:00"

                }, 
                sunday: {
                    isAvailable: false,
                    startTime: "9:00",
                    finishTime: "17:00"

                }
            }
        }
    )
    .controller('servicesCtrl', ['$scope', '$state', 'CRUDService', 'serviceDefaults',
        function($scope, $state, CRUDService, serviceDefaults){

        $scope.createItem = function(){
            if(!$scope.item){
                $scope.newItem = true;
                $scope.item = angular.copy(serviceDefaults);
            }
        };

        $scope.editItem = function(service){
            _.pull($scope.itemList, service);
            $scope.itemCopy = angular.copy(service);
            $scope.item = service;
        };

        $scope.saveItem = function(service){
            var formValid = CRUDService.validateForm($scope);
            if( formValid ){
                $scope.$broadcast('closeTimePicker', false);
                CRUDService.update('Services', $scope, service);
            }
        };

        $scope.cancelEdit = function(){
            $scope.$broadcast('closeTimePicker', true);
            CRUDService.cancelEdit($scope);
        };

        $scope.$watch('item.name', function(newVal){
            if( _.find($scope.itemList, {name: newVal}) ){
                $scope.itemForm.name.$setValidity('duplicatename', false);
            } else {
                $scope.itemForm.name.$setValidity('duplicatename', true);
            }
        });

        $scope.$watch('item.repetition.sessionCount', function(newVal){
            if($scope.item && newVal < 2 && $scope.item.pricing){
                delete $scope.item.pricing.coursePrice;
            }
        });

        CRUDService.get('Services', $scope);
        if ($state.current.data && $state.current.data.newService) {
            $scope.AILoading = false;
            $scope.createItem();
        }
    }])
    .value('serviceDefaults', {
            booking: {
                isOnlineBookable: true
            },
            timing: {
                duration: 60
            },
            repetition: {
                sessionCount: 1
            },
            presentation: {
                colour: 'green'
            }
        }
    );
angular.module('businessSetup.directives', [])
    .directive('repeatSelector', function(){
        return {
            restrict: "E",
            scope: {
                repeatFrequency: '=',
                sessionCount: '='
            },
            templateUrl: 'businessSetup/partials/repeatSelector.html',
            link: function(scope, elem, attr){
                scope.frequencies = [
                    {value: 'w', text: 'weekly'},
                    {value: 'd', text: 'daily'}
                ];
                scope.repeatableOptions = [
                    {value: false, text:'no' },
                    {value: true, text:'yes' }
                ];


                scope.$watch('sessionCount', function(newVal){
                    if(!scope.isFocused){
                        scope.isRepeatable = newVal > 1;

                        if(newVal < 2){
                            delete scope.repeatFrequency;
                        } else if(newVal > 1 && !scope.repeatFrequency){
                            scope.repeatFrequency = 'd';
                        }
                    }
                });

                scope.setValues = function(){
                    if(scope.sessionCount === 1){
                        // Takes care of case where $watcher does not get triggered
                        scope.isRepeatable = false;
                    } else if(scope.sessionCount < 2){
                        scope.sessionCount = 1;
                    }
                    scope.isFocused = false;
                };

                scope.toggleRepeatable = function(){
                    if(scope.sessionCount < 2){
                        scope.sessionCount = 2;
                    } else {
                        scope.sessionCount = 1;
                    }
                    scope.setValues();
                };

                scope.showStatus = function() {
                    var selected = _.filter(scope.frequencies, {value: scope.repeatFrequency});
                    return selected[0] ? 'businessSetup:repeat-selector.' + selected[0].text  + "-plural": "";
                };
            }
        };
    })
    .directive('colorPicker', function() {
        var defaultColors =  [
            "green",
            "mid-green",
            "dark-green",
            "red",
            "dark-red",
            "yellow",
            "orange",
            "blue",
            "mid-blue",
            "dark-blue"
        ];
        return {
            scope: {
                currentColor: '='
            },
            templateUrl: 'businessSetup/partials/colorPicker.html',
            link: function (scope) {
                scope.colors = defaultColors;
                scope.$watch('currentColor', function(newVal) {
                    scope.currentColor = newVal;
                });
            }
        };
    })
    .directive('currencyPicker', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'businessSetup/partials/currencyPicker.html',
            link: function(scope){
                scope.currencies = [
                    'NZD',
                    'USD',
                    'AUD',
                    'EUR',
                    'GBP',
                    'SEK'
                ];
            }
        };
    })
    .directive('timeSlot', function(){
        return {
            replace: false,
            templateUrl: 'businessSetup/partials/timeSlot.html',
            link: function(scope){
                scope.weekdays = [
                    'monday', 
                    'tuesday', 
                    'wednesday', 
                    'thursday', 
                    'friday', 
                    'saturday', 
                    'sunday'
                ];
            }
        };
    })
    .directive('timePicker', function(){
        return {
            replace: true,
            templateUrl: 'businessSetup/partials/timePicker.html',
            scope: {
                time: "="
            },
            link: function (scope, elem, attr) {

                scope.$watch('time', function(newVal) {
                    scope.time = newVal;
                    if(scope.time){
                        var timeArray = scope.time.split(":");
                        scope.hours = parseFloat(timeArray[0]);
                        scope.minutes = parseFloat(timeArray[1]);

                        scope.displayHours = displayHours();
                        scope.displayMinutes = displayMinutes();
                    }
                });
     
                /* Increases hours by one */
                scope.increaseHours = function () {

                    //Check whether hours have reached max
                    if (scope.hours < 23) {
                        scope.hours++;
                    }
                    else {
                        scope.hours = 0;
                    }

                    setTime();
                };
     
                /* Decreases hours by one */
                scope.decreaseHours = function () {
     
                    //Check whether hours have reached min
                    scope.hours = scope.hours <= 0 ? 23 : --scope.hours;

                    setTime();
                };
     
                /* Increases minutes by 15 */
                scope.increaseMinutes = function () {
     
                    //Check whether to reset
                    if (scope.minutes >= 45) {
                        scope.minutes = 0;
                        scope.increaseHours();
                    }
                    else {
                        scope.minutes = scope.minutes + 15;
                    }
                    setTime();
                };
     
                /* Decreases minutes by 15 */
                scope.decreaseMinutes = function () {
     
                    //Check whether to reset
                    if (scope.minutes <= 0) {
                        scope.minutes = 45;
                        scope.decreaseHours();
                    }
                    else {
                        scope.minutes = scope.minutes - 15;
                    }
                    setTime();
                };

                scope.cancelEdit = function(){
                    scope.$emit('closeTimePicker', true);
                };

                scope.saveEdit = function(){
                    scope.$emit('closeTimePicker', false);
                };

                /* Displays minutes */
                var displayMinutes = function () {
                    return scope.minutes <= 9 ? "0" + scope.minutes : scope.minutes;
                };

                var displayHours = function () {
                    return scope.hours <= 9 ? "0" + scope.hours : scope.hours;
                };

                var setTime = function(){
                    var minutesString = displayMinutes();
                    var hoursString = displayHours();

                    scope.displayHours = hoursString;
                    scope.displayMinutes = minutesString;

                    scope.time = hoursString + ":" + minutesString;
                };
            }
        };
    })
    .directive('timeRangePicker', ['$rootScope', function($rootScope){
        return {
            replace: false,
            scope: {
                workingHours: "="
            },
            templateUrl: 'businessSetup/partials/timeRangePicker.html',
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var workingHoursCopy;
                var $timePickerContainer = angular.element(elem.find('.time-picker-container'));
                scope.currentTime = null;

                scope.$watchCollection('workingHours', function(newValues){
                    if(newValues) {
                        var startTime = timeStringToObject(newValues.startTime);
                        var finishTime = timeStringToObject(newValues.finishTime);
                        if(newValues.isAvailable === false || 
                                        (startTime.hours === finishTime.hours && startTime.minutes < finishTime.minutes) ||
                                        startTime.hours < finishTime.hours) {
                            ctrl.$setValidity('timeRange', true);
                        } else if( (startTime.hours === finishTime.hours && startTime.minutes >= finishTime.minutes) || 
                                        startTime.hours > finishTime.hours ){
                            ctrl.$setValidity('timeRange', false);
                        }
                    }
                });

                var timeStringToObject = function(time){
                    var timeArray = time.split(":");

                    time  = {};
                    time.hours = parseFloat(timeArray[0]);
                    time.minutes = parseFloat(timeArray[1]);

                    return time;
                };

                scope.editTime = function(currentTime){
                    if(scope.currentTime === null) {
                        workingHoursCopy = angular.copy(scope.workingHours);
                    }
                    scope.currentTime = currentTime;
                    scope.editingTime = true;
                };

                scope.$on('closeTimePicker', function(event, resetTime){
                    if(!ctrl.$valid && !resetTime){
                        $rootScope.addAlert({
                            type: 'warning',
                            message: 'businessSetup:timeRange-invalid'
                        });
                    } else {
                        if(resetTime && workingHoursCopy){
                            scope.workingHours = workingHoursCopy;
                        } 
                        scope.editingTime = false;
                        $timePickerContainer.one('$animate:after', function(){
                            workingHoursCopy = null;
                            scope.currentTime = null;
                        });
                    }
                });
            }
        };
    }]);
angular.module('businessSetup',
    [
        'businessSetup.controllers',
        'businessSetup.directives'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('newUserSetup', {
                url: "/new-user-setup",
                templateUrl: "businessSetup/partials/businessRegistrationView.html",
                controller: 'businessRegistrationCtrl',
                data: {
                    requireLogin: false
                }
            })
            .state('businessSetup', {
                url: "/business-setup",
                templateUrl: "businessSetup/partials/businessSetup.html"
            })
            .state('businessSetup.business', {
                url: "/business",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/businessView.html",
                        controller: 'businessCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
            .state('businessSetup.locations', {
                url: "/locations",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/locationsView.html",
                        controller: 'locationsCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
            .state('businessSetup.coachList', {
                url: "/coach-list",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/coachesView.html",
                        controller: 'coachesCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
            .state('businessSetup.services', {
                url: "/services",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/servicesView.html",
                        controller: "servicesCtrl"
                     }
                },
                data: {
                    requireLogin: true
                }
            })
            .state('businessSetup.services.newItem', {
                url: "/new-item",
                data: {
                    newService: true,
                    requireLogin: true
                },
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/servicesView.html",
                        controller: "servicesCtrl"
                     }
                }
            });
    }]);
angular.module('customers.controllers', [])
    .controller('customersCtrl', ['$scope', 'CRUDService',
        function($scope, CRUDService){

        $scope.createItem = function(){
            if(!$scope.item){
                $scope.newItem = true;
                $scope.item = {};
            }
        };

        $scope.editItem = function(customer){
            _.pull($scope.itemList, customer);
            $scope.itemCopy = angular.copy(customer);

            $scope.item = customer;
        };

        $scope.saveItem = function(customer){
            var formValid = CRUDService.validateForm($scope);
            if(formValid){
                CRUDService.update('Customers', $scope, customer);
            }
        };

        $scope.cancelEdit = function(){
            CRUDService.cancelEdit($scope);
        };

        $scope.$watchCollection('item', function(newVals){
            if(newVals){
                if(newVals.email === ""){
                    delete $scope.item.email;
                } else if (newVals.phone === ""){
                    delete $scope.item.phone;
                }
            }
        });

        CRUDService.get('Customers', $scope);
    }])
    .controller('customerSearchCtrl', ['$scope', '$filter', function($scope, $filter){
        var peopleList;
        //TODO - make this i18nable
        $scope.alphabetLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","ALL"];

        $scope.loadMore = function() {
            if(peopleList){
                _.forEach(peopleList.shift(), function(people){
                    $scope.customerList.push(people);
                });
            }
        };

        var filterText = function(){
            peopleList = $scope.itemList;
            if($scope.searchLetter){
                peopleList = $filter('byLastName')(peopleList, $scope.searchLetter);
            } 
            peopleList = $filter('searchBox')(peopleList, $scope.searchText);
            peopleList = $filter('orderBy')(peopleList, ['lastName', 'firstName']);
            peopleList = _.chunk(peopleList, 20);
            $scope.customerList = [];
            $scope.loadMore(); 
        };

        $scope.$on('updateSuccess', function(){
            filterText();
        });

        var unregister = $scope.$watch('itemList', function(newVal){
            if(newVal){
                filterText();
                unregister();
            }
        });

        $scope.$watch("searchText", function (newVal) {
            if(newVal === ''){
                $scope.searchText = null;
            }
            filterText();
        });

        $scope.$watchGroup(["searchLetter", "searchText"], function(newVals){
            if(!newVals[0]){
                $scope.filterHighlight = newVals[1];
            } else if (!newVals[1]) {
                $scope.filterHighlight = newVals[0];
            } else {
                $scope.filterHighlight = newVals[1] + " " + newVals[0];
            }
        });

        $scope.sortBy = function(letter){
            if(letter === "ALL"){
                $scope.searchLetter = null;
            } else {
                $scope.searchLetter = letter;
            }
            filterText();
        };
    }])
    .filter('highlight', ['$sce', function($sce) {
        return function(text, scope) {
            var phrase = scope.filterHighlight;
            if (text && phrase){
                var phrases = phrase.split(" ");
                var regex = scope.searchText ? new RegExp(phrases.join("|"),"gi") : new RegExp("^" + phrases.join("|"),"gi");
                text = text.replace(regex, function(matched){
                    return '<span class="highlighted">' + matched + '</span>';
                });
            }
            return $sce.trustAsHtml(text);
        };
     }])
    .filter('byLastName', function() {
        return function(items, letter){
            return _.filter(items, function (item) {
                return new RegExp(letter, "i").test(item.lastName.substring(0, 1));
            });
        };
     })
    .filter('searchBox', function(){
        return function(items, value){
            if(!value){
                return items;
            } else {
                value = value.toLowerCase();
                var values = value.split(" ");

                return _.filter(items, function(item){
                        var firstName = item.firstName.toLowerCase();
                        var lastName = item.lastName.toLowerCase();
                        var matches = [];
                        _.forEach(values, function(value){
                            if(_.includes(firstName, value) || _.includes(lastName, value) || _.includes(item.phone, value) ){
                                matches.push(true);
                            }
                        });
                        return matches.length === values.length;
                });
            }
        };
    });
angular.module('customers',
    [
        'customers.controllers',

        'infinite-scroll'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('customers', {
                url: "/customers",
                templateUrl: "customers/partials/customersView.html",
                controller: 'customersCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);
angular.module('scheduling.controllers', [])
    .controller('schedulingCtrl', ['$scope', '$q', '$timeout', 'coachSeekAPIService', '$activityIndicator', 'sessionOrCourseModal', 'serviceDefaults', 'uiCalendarConfig',
        function($scope, $q, $timeout, coachSeekAPIService, $activityIndicator, sessionOrCourseModal, serviceDefaults, uiCalendarConfig){

            //TODO - add ability to edit time range in modal?

            $scope.events = [];
            $scope.eventSources = [];
            $scope.currentRanges = [];

            var rangesLoaded = [],
                tempEventId,
                currentEventCopy,
                $currentEvent;

            $scope.draggableOptions = {
                helper: function(event) {
                    var serviceData = $(this).data('service');
                    return $('<span class="service-drag-helper ' + serviceData.presentation.colour + '">' + serviceData.name + '<span/>');
                },
                cursorAt: {
                    top: 15,
                    left: 45
                }
            };

            $scope.toggleDrag = function(event){
                $(event.target).toggleClass('dragging');
            };

            $scope.uiConfig = {
                calendar:{
                    editable: true,
                    droppable: true,
                    allDaySlot: false,
                    slotEventOverlap: false,
                    firstDay: 1,
                    titleFormat: {month:'MMM YYYY', week:'MMM YYYY', day:'D MMM YYYY'},
                    snapDuration: '00:15:00',
                    defaultView: $scope.isBigScreen ? 'agendaWeek' : 'agendaDay',
                    eventDurationEditable: false,
                    scrollTime:  "06:00:00",
                    header:{
                        left: '',
                        center: 'prev title next',
                        right: 'month agendaWeek agendaDay today' 
                    },
                    drop: function(date, event) {
                        handleServiceDrop(date, $(this).data('service'));
                    },
                    // businessHours: {
                    //     // start: '00:00', // a start time (10am in this example)
                    //     // end: '24:00', // an end time (6pm in this example)

                    //     // Sunday = 0 Monday = 6
                    //     dow: [0, 2, 3, 4],
                    //     availableHours: {
                    //         0:{
                    //             start: '10:00', // a start time (10am in this example)
                    //             end: '11:00', // an end time (6pm in this example)
                    //         },
                    //         2: {
                    //             start: '10:00', // a start time (10am in this example)
                    //             end: '18:00', // an end time (6pm in this example)
                    //         }
                    //     }
                    // },
                    events: function(start, end, timezone, renderEvents){
                        var getSessionsParams = {
                            startDate: start.format('YYYY-MM-DD'),
                            endDate: end.format('YYYY-MM-DD'),
                            locationId: $scope.currentLocationId,
                            coachId: $scope.currentCoachId,
                            useNewSearch: true,
                            section: 'Sessions'
                        };
                        startCalendarLoading();
                        coachSeekAPIService.get(getSessionsParams)
                            .$promise.then(function(sessionObject){
                                $scope.events = [];
                                addSessionsWithinInterval(sessionObject.sessions);
                                addCoursesWithinInterval(sessionObject.courses);
                                renderEvents($scope.events);
                                $scope.$broadcast('fetchSuccesful');
                            }, $scope.handleErrors).finally(function(){
                                stopCalendarLoading();
                            });
                    },
                    eventRender: function(event, element, view) {
                        if(view.type !== 'month'){
                            $('<div></div>', {
                                class: 'fc-location',
                                text: event.session.location.name
                            }).appendTo(element.find('.fc-content'));
                        }
                    },
                    windowResize: function(view){
                        handleWindowResize(view.name);
                    },
                    // handle event drag/drop within calendar
                    eventDrop: function( event, delta, revertDate){
                        if(event.tempEventId){
                            _.assign($scope.currentEvent.session.timing, {
                                startDate: event._start.format('YYYY-MM-DD'),
                                startTime: event._start.format('HH:mm')
                            });
                        } else {
                            if(event.course){
                                //have to set $scope.currentEvent so sessionOrCourseModal can return id
                                $scope.currentEvent = event;
                                sessionOrCourseModal($scope).then(function(id){
                                    if(id === event.course.id){
                                        startCalendarLoading();
                                        updateSessionTiming(event.course, delta, revertDate, true);
                                    } else {
                                        updateSessionTiming(event.session, delta, revertDate, false);
                                    }
                                }, function(){
                                    revertDate();
                                });
                            } else {
                                updateSessionTiming(event.session, delta, revertDate, false);
                            }
                        }
                    },
                    eventClick: function(event, jsEvent, view) {
                        if(!$scope.showModal) $scope.currentTab = 'attendance';
                        if($scope.isBigScreen || view.type == 'agendaDay'){
                            $scope.showModal = true;

                            if($currentEvent) $currentEvent.removeClass('current-event');
                            $currentEvent = $(jsEvent.currentTarget);
                            $currentEvent.addClass('current-event');
                        }

                        $scope.currentEvent = event;
                        currentEventCopy = angular.copy(event);

                        if(event.course){
                            setCurrentCourseEvents();
                        }
                    },
                    viewRender: function(view){
                        $timeout(function(){
                            var heightToSet = $scope.isBigScreen ? ($('.calendar-container').height() - 10 ) : $(window).height();
                            uiCalendarConfig.calendars.sessionCalendar.fullCalendar('option', 'height', heightToSet);
                            handleWindowResize(view);
                        });
                    },
                    dayClick: function(date, jsEvent, view) {
                        if(!$scope.isBigScreen && view.type === 'month'){
                            uiCalendarConfig.calendars.sessionCalendar.fullCalendar('changeView', 'agendaDay');
                            uiCalendarConfig.calendars.sessionCalendar.fullCalendar('gotoDate', date);
                        } else if (Modernizr.touch) {
                            handleServiceDrop(date, angular.copy(serviceDefaults));
                        }
                    }
                }
            };

            var updateSessionTiming = function(session, delta, revertDate, reloadRanges){
                var newDate = getNewDate(session.timing);
                newDate.add(delta);

                _.assign(session.timing, {
                    startDate: newDate.format('YYYY-MM-DD'),
                    startTime: newDate.format('HH:mm')
                });

                $activityIndicator.startAnimating();
                updateSession(session).then(function(session){
                    $scope.removeAlerts();
                    if(reloadRanges) uiCalendarConfig.calendars.sessionCalendar.fullCalendar('refetchEvents');
                }, function(error){
                    revertDate();
                    handleClashingError(error);
                }).finally(function(){
                    $activityIndicator.stopAnimating();
                });
            };

            var handleWindowResize = function(viewName){
                var $sessionCalendar = uiCalendarConfig.calendars.sessionCalendar;
                if($scope.isBigScreen){
                    $sessionCalendar.find('.fc-agendaWeek-button').show();
                } else {
                    $sessionCalendar.find('.fc-agendaWeek-button').hide();
                    $scope.toggleOpen = false;
                    if(viewName === 'agendaWeek'){
                        $sessionCalendar.fullCalendar('changeView', 'agendaDay');
                    }
                }
                $sessionCalendar.fullCalendar('option', 'height', ($('.calendar-container').height() - 10));
            };

            var handleClashingError = function(error){
                var clashingMessage = error.data[0].data || error.data;
                clashingMessage = clashingMessage.substring(clashingMessage.indexOf(":") + 2, clashingMessage.indexOf(";"));

                $scope.addAlert({
                    type: 'danger',
                    message: 'scheduling:clashing-error',
                    clashingMessage: clashingMessage
                });
            };

            var handleServiceDrop = function(date, serviceData){
                $scope.currentTab = 'general';
                $scope.showModal = true;
                var session = buildSessionObject(date, serviceData);
                var repeatFrequency = serviceData.repetition.repeatFrequency;
                tempEventId = _.uniqueId('service_');

                _.times(serviceData.repetition.sessionCount, function(index){
                    var newEvent = buildCalendarEvent(moment(date).add(index, repeatFrequency), session);
                    $scope.events.push(newEvent);
                    uiCalendarConfig.calendars.sessionCalendar.fullCalendar('renderEvent', newEvent);
                    if(index === 0){
                        $scope.currentEvent = newEvent;
                        $scope.currentEvent.course = {pricing:newEvent.session.pricing};
                    }
                });
            };

            var addCoursesWithinInterval = function(courses){
                _.forEach(courses, function(course){
                    addSessionsWithinInterval(course.sessions, course);
                });
            };

            var addSessionsWithinInterval = function(sessions, course){
                _.forEach(sessions, function(session){
                    var newDate = getNewDate(session.timing);
                    $scope.events.push(buildCalendarEvent(newDate, session, course));
                });
            };

            var buildCalendarEvent = function(date, session, course){
                var dateClone = date.clone();
                var duration = session.timing.duration;
                // set default display length to never be less than 30
                duration =  duration < 30 ? 30 : duration;

                return {
                    _id: tempEventId,
                    tempEventId: tempEventId,
                    title: session.service.name,
                    start: moment(dateClone),
                    end: moment(dateClone.add(duration, 'minutes')),
                    allDay: false,
                    className: session.presentation.colour,
                    session: session,
                    course: course
                };
            };

            var buildSessionObject = function(date, serviceData){
                return {
                    service: serviceData,
                    location: {
                        id: $scope.currentLocationId
                    },
                    coach: {
                        id: $scope.currentCoachId
                    },
                    timing: {
                        startDate: date.format('YYYY-MM-DD'),
                        startTime: date.format('HH:mm'),
                        duration: serviceData.timing.duration
                    },
                    booking: {
                        isOnlineBookable: serviceData.booking ? serviceData.booking.isOnlineBookable : true,
                        studentCapacity: serviceData.booking ? serviceData.booking.studentCapacity : 1,
                        bookings: []
                    },
                    pricing: serviceData.pricing,
                    presentation: serviceData.presentation,
                    repetition: serviceData.repetition
                };
            };

            $scope.filterSessions = function(){
                $scope.removeAlerts();
                uiCalendarConfig.calendars.sessionCalendar.fullCalendar('refetchEvents');
                // SET BIZ HOURS
                // uiCalendarConfig.calendars.sessionCalendar.fullCalendar({businessHours: {}});
                // uiCalendarConfig.calendars.sessionCalendar.fullCalendar('render');
            };

            // var buildAvailableHours = function(coachAvailibility){}

            // HELPER FUNCTIONS
            $scope.minutesToStr = function(duration){
                return Math.floor(duration / 60) + ":" + duration % 60;
            };

            $scope.getCurrentCoach = function(){
                if($scope.coachList){
                    return _.result(_.find($scope.coachList, {id: $scope.currentCoachId}), 'name');
                }
            };

            $scope.cancelModalEdit = function(){
                if(currentEventCopy){
                    // must keep autosaved edits even if canceled
                    _.assign(currentEventCopy.session.booking.bookings, $scope.currentEvent.session.booking.bookings);
                    _.assign($scope.currentEvent, currentEventCopy);
                    uiCalendarConfig.calendars.sessionCalendar.fullCalendar('updateEvent', $scope.currentEvent);
                }
                closeModal(true);
            };

            $scope.saveModalEdit = function(){
                forceFormTouched();
                if($scope.currentSessionForm.$valid){
                    var course = $scope.currentEvent.course;
                    if($scope.currentEvent.tempEventId && course){
                        var session = $scope.currentEvent.session;
                        if ($scope.currentEvent.course.pricing && $scope.currentEvent.course.pricing.coursePrice){
                            session.pricing.coursePrice = $scope.currentEvent.course.pricing.coursePrice;     
                        }
                         saveSession(session);
                    } else if(course){
                        sessionOrCourseModal($scope).then(function(id){
                            if(id === course.id){
                                saveSession(assignCourseAttributes(course));
                            } else {
                                saveSession($scope.currentEvent.session);
                            }
                        }); 
                    } else {
                        saveSession($scope.currentEvent.session);
                    }
                }
            };

            var assignCourseAttributes = function(course){
                return _.assign($scope.currentEvent.session, {
                    id: course.id,
                    repetition: course.repetition,
                    timing: {
                        duration: $scope.currentEvent.session.timing.duration,
                        startDate: course.timing.startDate,
                        startTime: $scope.currentEvent.session.timing.startTime
                    },
                    pricing: {
                        sessionPrice: $scope.currentEvent.session.pricing.sessionPrice,
                        coursePrice: course.pricing.coursePrice
                    }
                });
            };

            var saveSession = function(session){
                startCalendarLoading();
                updateSession(session).then(function(session){
                    if($scope.currentEvent.tempEventId){
                        removeTempEvents();
                        delete $scope.currentEvent.tempEventId;
                        if(session.sessions){
                            $scope.currentEvent.session = session.sessions[0];
                            $scope.currentEvent.course = session;
                        } else {
                            $scope.currentEvent.session = session;
                        }
                    } else {
                        closeModal();
                    }
                    $scope.removeAlerts();
                    uiCalendarConfig.calendars.sessionCalendar.fullCalendar('refetchEvents');
                }, handleCalendarErrors);
            };

            $scope.$on('fetchSuccesful', function(){
                if($scope.currentEvent) {
                    $scope.currentEvent = _.find($scope.events, function(event){
                        return event.session.id === $scope.currentEvent.session.id;
                    });
                    if($scope.currentEvent) setCurrentCourseEvents();
                }
            });

            var setCurrentCourseEvents = function(){
                $scope.currentCourseEvents = _.filter($scope.events, function(event){
                    return event.course && event.course.id === $scope.currentEvent.course.id;
                });
            };

            $scope.deleteSession = function(){
                if($scope.currentEvent.course){
                    sessionOrCourseModal($scope).then(deleteSessions);
                } else {
                    deleteSessions($scope.currentEvent.session.id);
                }
            };

            var deleteSessions = function(id){
                startCalendarLoading();
                coachSeekAPIService.delete({section: 'Sessions', id: id})
                    .$promise.then(function(){

                        $scope.addAlert({
                            type: 'success',
                            message: id === $scope.currentEvent.session.parentId ? "scheduling:delete-course-success" : "scheduling:delete-session-success",
                            name: $scope.currentEvent.session.service.name,
                            startDate: $scope.currentEvent.start.format("MMMM Do YYYY, h:mm a")
                        });
                        closeModal();
                        uiCalendarConfig.calendars.sessionCalendar.fullCalendar('refetchEvents');
                    },  function(error){
                        $scope.handleErrors(error);
                        stopCalendarLoading();
                    });
            };

            var handleCalendarErrors = function(error){
                _.forEach(error.data, function(error){
                    if(error.code === "clashing-session"){
                        handleClashingError(error);
                    } else {
                        $scope.addAlert({
                            type: 'danger',
                            message: error.message ? error.message: error
                        });
                    }
                });
                stopCalendarLoading();
            };

            var closeModal = function(resetTimePicker){
                removeTempEvents();
                $scope.$broadcast('closeTimePicker', resetTimePicker);
                $scope.currentSessionForm.$setUntouched();
                $scope.currentSessionForm.$setPristine();
                $scope.showModal = false;
            };

            var forceFormTouched = function(){
                $scope.currentSessionForm.coaches.$setTouched();
                $scope.currentSessionForm.locations.$setTouched();
                $scope.currentSessionForm.sessionPrice.$setTouched();
                $scope.currentSessionForm.coursePrice.$setTouched();
            };

            var removeTempEvents = function(){
                if(tempEventId){
                    uiCalendarConfig.calendars.sessionCalendar.fullCalendar('removeEvents', tempEventId);
                    tempEventId = null;
                }
            };

            var getNewDate = function(timing){
                return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm");
            };

            var updateSession = function(sessionObject){
                return coachSeekAPIService.save({section: 'Sessions'}, sessionObject).$promise;
            };

            var startCalendarLoading = function(){
                if(!$scope.calendarLoading){
                    $scope.calendarLoading = true;
                }
            };

            var stopCalendarLoading = function(){
                $scope.calendarLoading = false;
            };

            // TODO - do this in repeat selector
            $scope.$watch('currentEvent.session.repetition.sessionCount', function(newVal){
                if($scope.currentEvent && $scope.currentEvent.tempEventId && newVal < 2 && $scope.currentEvent.course.pricing && $scope.currentEvent.course.pricing.coursePrice){
                    delete $scope.currentEvent.course.pricing.coursePrice;
                }
            });

            // INITIAL LOAD
            startCalendarLoading();
            $q.all({
                    coaches: coachSeekAPIService.query({section: 'Coaches'}).$promise,
                    locations: coachSeekAPIService.query({section: 'Locations'}).$promise,
                    services: coachSeekAPIService.query({section: 'Services'}).$promise
                })
                .then(function(response) {
                    $scope.coachList    = response.coaches;
                    $scope.locationList = response.locations;
                    $scope.serviceList  = response.services;
                },function(error){
                    $scope.handleErrors(error);
                    stopCalendarLoading();
                });
    }]);
angular.module('scheduling.directives', [])
    .directive('schedulingServicesList', function(){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/schedulingServicesList.html'
        };
    })
    .directive('modalSessionForm', ['uiCalendarConfig', function(uiCalendarConfig){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/modalSessionForm.html',
            link: function(scope){
                scope.changeServiceName = function(){
                    var newService = _.find(scope.serviceList, {id: scope.currentSessionForm.services.$viewValue});
                    scope.currentEvent.session.presentation.colour = newService.presentation.colour;
                    _.assign(scope.currentEvent, {
                        className: newService.presentation.colour,
                        title: newService.name
                    });
                    updateCurrentEvent();
                };

                scope.changeLocationName = function(){
                    var newLocation = _.find(scope.locationList, {id: scope.currentSessionForm.locations.$viewValue});
                    scope.currentEvent.session.location = newLocation;
                    updateCurrentEvent();
                };

                var updateCurrentEvent = function(){
                    //TODO - why does this freak out when currentEvent is a new event?
                    if(!scope.currentEvent.tempEventId){
                        uiCalendarConfig.calendars.sessionCalendar.fullCalendar('updateEvent', scope.currentEvent);
                    }
                };

                scope.requireSessionPrice = function(){
                    if(scope.currentEvent && scope.currentEvent.course && scope.currentEvent.course.pricing){
                        return priceRequired(scope.currentEvent.course.pricing.coursePrice);
                    } else if(scope.currentEvent && scope.currentEvent.session.repetition.sessionCount === 1 ){
                        return true;
                    }
                };

                scope.requireCoursePrice = function(){
                    if(scope.currentEvent && scope.currentEvent.session.pricing){
                        return priceRequired(scope.currentEvent.session.pricing.sessionPrice);
                    }
                };

                function priceRequired(price){
                    if(price === 0){
                        return false;
                    } else {
                        return !price;
                    }
                }

                $(".session-form").css("height", "100%").css("height", "-=285px"); 
            }
        };
    }])
    .directive('startTimePicker', function(){
        return {
            scope: {
                startTime: '='
            },
            restrict: "E",
            templateUrl:'scheduling/partials/startTimePicker.html',
            link: function(scope, elem){
                scope.editingTime = false;

                var startTimeCopy,
                    $timePickerContainer = angular.element(elem.find('.time-picker-container'));

                scope.editTime = function(currentTime){
                    if(!scope.editingTime) {
                        startTimeCopy = angular.copy(scope.startTime);
                        scope.editingTime = true;
                    }
                };

                scope.$on('closeTimePicker', function(event, resetTime){
                    if(resetTime && startTimeCopy){
                        scope.startTime = startTimeCopy;
                    }
                    scope.editingTime = false;
                    $timePickerContainer.one('$animate:after', function(){
                        startTimeCopy = null;
                    });
                });
            }
        };
    })
    .directive('modalSessionAttendanceList', ['coachSeekAPIService', function(coachSeekAPIService){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/modalSessionAttendanceList.html',
            link: function(scope){
                $(".attendance-list .student-list").css("height", "-=330px"); 
                $(".attendance-list div.customer-list ul.short-list").css("height", "-=365px"); 
                $(".attendance-list div.customer-list ul").css("height", "-=330px");


                scope.showCustomers = false;

                scope.showCustomerList = function(){
                    scope.showCustomers = true;
                };

                scope.hideCustomerList = function(){
                    scope.showCustomers = false;
                };

                scope.blockAddBookings = function(){
                    if(scope.currentEvent){
                        var session = scope.currentEvent.session;
                        return session.booking.studentCapacity - _.size(session.booking.bookings) <= 0
                    }
                };

                scope.$watch('currentEvent', function(){
                    scope.showCustomers = false;
                });

                coachSeekAPIService.query({section: 'Customers'})
                    .$promise.then(function(customerList){
                        scope.itemList  =  customerList;
                    }, scope.handleErrors);

              
            }
        };
    }])
    .directive('modalCustomerDetails', ['coachSeekAPIService', '$q', function(coachSeekAPIService, $q){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/modalCustomerDetails.html',
            link: function(scope){
                scope.addStudent = function(addToCourse){
                    if(scope.isCourseStudent && !addToCourse){
                        var courseBooking = _.find(scope.currentEvent.course.booking.bookings, function(booking){
                            return booking.customer.id === scope.item.id;
                        });

                        scope.bookingLoading = true;
                        coachSeekAPIService.delete({section: 'Bookings', id: courseBooking.id})
                            .$promise.then(function(){
                                removeBookingsFromCourseSessions(courseBooking);
                                saveBooking(addToCourse);
                            }, scope.handleErrors);
                    } else if (scope.currentEvent.course && addToCourse){
                        //Remove from all individual sessions (API and UI)
                        var deleteBookingsPromises = [];
                        _.each(scope.currentCourseEvents, function(event){
                            var booking = _.find(event.session.booking.bookings, function(booking){
                                return booking.customer.id === scope.item.id;
                            });
                            if(booking) {
                                deleteBookingsPromises.push(coachSeekAPIService.delete({section: 'Bookings', id: booking.id}));
                            }
                        });

                        scope.bookingLoading = true;
                        $q.all(deleteBookingsPromises)
                            .then(function() {
                                _.each(scope.currentCourseEvents, function(event){
                                    var booking = _.find(event.session.booking.bookings, function(booking){
                                        return booking.customer.id === scope.item.id;
                                    });
                                    if(booking) _.pull(event.session.booking.bookings, booking);
                                    booking = _.find(event.course.booking.bookings, function(booking){
                                        return booking.customer.id === scope.item.id;
                                    });
                                    if(booking) _.pull(event.course.booking.bookings, booking);
                                });
                                saveBooking(addToCourse);
                            }, scope.handleErrors);
                    } else {
                        saveBooking(addToCourse);
                    }
                };

                function removeBookingsFromCourseSessions(courseBooking){
                    _.each(scope.currentCourseEvents, function(event){
                        var booking = _.find(event.session.booking.bookings, function(booking){
                            return booking.parentId === courseBooking.id;
                        });
                        if(booking) _.pull(event.session.booking.bookings, booking);
                    });
                }

                function saveBooking(addToCourse){
                    var bookingObject = buildBooking(addToCourse);
                    scope.bookingLoading = true;
                    coachSeekAPIService.save({section: 'Bookings'}, bookingObject)
                        .$promise.then(function(booking){
                            _.assign(booking.customer, {
                                firstName: scope.item.firstName,
                                lastName: scope.item.lastName
                            });
                            if(booking.course){
                                scope.currentEvent.course.booking.bookings.push(booking);
                                addBookingsToCourseSessions(booking);
                                scope.isSessionStudent = false;
                                scope.isCourseStudent = true;
                            } else {
                                scope.isSessionStudent = true;
                                scope.isCourseStudent = false;
                                scope.currentEvent.session.booking.bookings.push(booking);               
                            }
                        }, scope.handleErrors).finally(function(){
                            scope.bookingLoading = false;
                        });
                }

                function addBookingsToCourseSessions(courseBooking){
                    _.each(scope.currentCourseEvents, function(event){
                        // if bookings does not have this customer we push it
                        var booking = _.find(courseBooking.sessionBookings, function(sessionBooking){
                            return sessionBooking.session.id === event.session.id;
                        });
                        if(booking){
                            _.assign(booking.customer, {
                                firstName: scope.item.firstName,
                                lastName: scope.item.lastName
                            });
                            event.session.booking.bookings.push(booking);
                        }
                    });
                }

                scope.$watch('currentEvent.session.booking.bookings', function(newBookings){
                    if(newBookings){
                        scope.isSessionStudent = false;
                        scope.isCourseStudent = false;
                        var customerBooking = getSessionBooking(newBookings);
                        if(_.size(customerBooking) && customerBooking[0].parentId){
                            scope.isCourseStudent = true;
                        } else if(_.size(customerBooking)){
                            scope.isSessionStudent = true;
                        }
                    }
                }, true);

                function getSessionBooking(bookings){
                    return _.filter(bookings, function(booking){
                        return booking.customer.id === scope.item.id;
                    });
                }

                function buildBooking(addToCourse){
                    return {
                        session: {
                            id: addToCourse ? scope.currentEvent.course.id : scope.currentEvent.session.id,
                            name: scope.currentEvent.session.service.name
                        },
                        customer: {
                            id: scope.item.id,
                            firstName: scope.item.firstName,
                            lastName: scope.item.lastName
                        },
                        paymentStatus: "awaiting-invoice",
                        hasAttended: false
                    };
                }
            }
        };
    }])
    .directive('customerBooking', ['coachSeekAPIService', 'sessionOrCourseModal', function(coachSeekAPIService, sessionOrCourseModal){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/customerBooking.html',
            link: function(scope){
                scope.toggleAttendance = function(){
                    updateBooking({
                        commandName: 'BookingSetAttendance',
                        hasAttended: !scope.booking.hasAttended
                    }).then(function(){
                        scope.booking.hasAttended = !scope.booking.hasAttended;
                    },scope.handleErrors).finally(function(){
                        scope.bookingLoading = false;
                    });
                };

                scope.removeBooking = function(){
                    //must determine if current booking is a course booking
                    if(scope.currentEvent.course && scope.booking.parentId){
                        sessionOrCourseModal(scope).then(function(id){
                            if(id === scope.currentEvent.course.id){
                                bookingRemoval(scope.booking.parentId, true);
                            } else {
                                bookingRemoval(scope.booking.id);
                            }
                        });
                    } else {
                        bookingRemoval(scope.booking.id);
                    }
                };

                function bookingRemoval(bookingId, removeFromCourse){
                    scope.bookingLoading = true;
                    coachSeekAPIService.delete({section: 'Bookings', id: bookingId})
                        .$promise.then(function(){
                            _.pull(scope.currentEvent.session.booking.bookings, scope.booking);
                            if(removeFromCourse){
                                removeBookingsFromCourseSessions();
                            }
                        },scope.handleErrors).finally(function(){
                            scope.bookingLoading = false;
                        });
                }

                function removeBookingsFromCourseSessions(){
                    _.each(scope.currentCourseEvents, function(event){
                        var booking = _.find(event.session.booking.bookings, function(booking){
                            return booking.customer.id === scope.booking.customer.id;
                        });
                        if(booking) _.pull(event.session.booking.bookings, booking);
                    });
                }

                var paymentStatusOptions = [
                    'awaiting-invoice',
                    'awaiting-payment',
                    'paid',
                    'overdue'
                ];

                var paymentStatusIndex = _.indexOf(paymentStatusOptions, scope.booking.paymentStatus);
                // if we havn't set payment status set to default
                if(paymentStatusIndex === -1) paymentStatusIndex = 0;
                scope.paymentStatus = paymentStatusOptions[paymentStatusIndex];

                scope.changePaymentStatus = function(){
                    paymentStatusIndex++;
                    if(paymentStatusIndex === _.size(paymentStatusOptions)) {
                        paymentStatusIndex = 0;
                    }

                    scope.paymentStatus = paymentStatusOptions[paymentStatusIndex];
                    savePaymentStatus();
                };

                var savePaymentStatus = _.debounce(function(){
                    updateBooking({
                        commandName: 'BookingSetPaymentStatus',
                        paymentStatus: scope.paymentStatus
                    }).then(function(){
                        scope.booking.paymentStatus = scope.paymentStatus;
                    },scope.handleErrors).finally(function(){
                        scope.bookingLoading = false;
                    });
                }, 1000);

                function updateBooking(updateCommand){
                    scope.bookingLoading = true;
                    return coachSeekAPIService.save({section: 'Bookings', id: scope.booking.id}, updateCommand).$promise;
                }
            }
        };
    }]);

angular.module('scheduling',
    [
        'scheduling.controllers',
        'scheduling.directives',
        'scheduling.services',

        'ngDragDrop',
        'ui.calendar'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('scheduling', {
                url: "/scheduling",
                templateUrl: "scheduling/partials/schedulingView.html",
                controller: 'schedulingCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);
angular.module('scheduling.services', [])
    .service('sessionOrCourseModal', ['$modal', '$rootScope',
        function ($modal, $rootScope) {
            return function(scope) {
                scope.removeAlerts();
                var instance = $modal.open({
                    scope: scope,
                    templateUrl: 'scheduling/partials/sessionOrCourseModal.html',
                    backdropClass: 'session-or-course-modal-backdrop',
                    windowClass: 'session-or-course-modal-window'
                });

                return instance.result.then(function(id){
                    return id;
                });
            };
        }
    ]);
})();