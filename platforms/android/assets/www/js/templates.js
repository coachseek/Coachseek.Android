angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/partials/activityIndicator.html',
    "<div class=\"indicator-container\">\n" +
    "    <div class='outer-logo'></div>\n" +
    "    <div ng-class=\"{active: AILoading}\" class='inner-logo'></div>\n" +
    "</div>"
  );


  $templateCache.put('app/partials/comingSoon.html',
    "<div class=\"coming-soon-container\">\n" +
    "    <div class=\"coming-soon-message\" ng-i18next>{{feedbackSent ? 'feedback-thanks' : 'coming-soon'}}</div>\n" +
    "    <div class=\"coming-soon-submessage\" ng-i18next>{{feedbackSent ? 'feedback-thanks-submessage' : 'coming-soon-submessage'}}</div>\n" +
    "    <form ng-hide=\"feedbackSent\" name=\"feedbackForm\" novalidate ng-enter=\"saveFeedback()\">\n" +
    "        <textarea name=\"feedback\" ng-model=\"feedback\"></textarea>\n" +
    "        <button class=\"save-button\" ng-click=\"saveFeedback()\">{{'save' | i18next}}</button>\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('app/partials/durationPicker.html',
    "<div class=\"duration-picker-container\" ng-class=\"{editing: editingTime}\">\n" +
    "    <input type=\"text\" ng-click=\"editTime()\" ng-model='time' class=\"time-picker-time\" ng-readonly=\"true\">\n" +
    "\n" +
    "    <div class=\"time-picker-container\" ng-show=\"editingTime\">\n" +
    "        <time-picker time=\"time\"></time-picker>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('app/partials/ellipsisAnimated.html',
    "<span class='ellipsis_animated-inner'>\n" +
    "    <span>.</span>\n" +
    "    <span>.</span>\n" +
    "    <span>.</span>\n" +
    "</span>"
  );


  $templateCache.put('app/partials/loadingAnimation.html',
    "<span></span>\n" +
    "<span></span>\n" +
    "<span></span>\n" +
    "<span></span>\n" +
    "<span></span>"
  );


  $templateCache.put('app/partials/loginModal.html',
    "<div class=\"login-modal-container\">\n" +
    "    <div class=\"coachseek-logo\"></div>\n" +
    "    <form name=\"loginForm\" novalidate ng-enter=\"attemptLogin(email, password)\">\n" +
    "        <input class=\"login-email\" name=\"email\" type=\"email\" ng-model=\"email\" placeholder=\"{{'login.placeholder.email' | i18next}}\"  required ng-maxlength=100 />\n" +
    "\n" +
    "        <input class=\"login-password\" name=\"password\" type=\"password\" ng-model=\"password\" placeholder=\"&#xf1e3;&#xf1e3;&#xf1e3;&#xf1e3;&#xf1e3;&#xf1e3;\" required ng-minlength=6 ng-maxlength=50 />\n" +
    "        <label name=\"password\">{{'login.password-min' | i18next}}</label>\n" +
    "    </form>\n" +
    "    <button class=\"save-button\" ng-click=\"attemptLogin(email, password)\" ng-disabled=\"AILoading\"><span ng-i18next>{{AILoading ? 'login.logging-in' : 'login.login-to-coachseek'}}</span><ellipsis-animated ng-show=\"AILoading\"/></button>\n" +
    "    <div class=\"new-user\">{{'login.new-here' | i18next}}<a ng-click=\"cancel()\" ui-sref=\"newUserSetup\">{{'login.create-account' | i18next}}</a></div>\n" +
    "</div>"
  );


  $templateCache.put('app/partials/selectArrows.html',
    "<span class=\"select-arrows\">\n" +
    "    <i class=\"fa fa-caret-up\"></i>\n" +
    "    <i class=\"fa fa-caret-down\"></i>\n" +
    "</span>"
  );


  $templateCache.put('booking/partials/bookNowButton.html',
    "<a id=\"booking-preview-button\" \n" +
    "style=\"cursor: pointer;color: #FFFFFF;border-radius: 3px;text-decoration: none;padding: 10px 27px;background: #525252;-webkit-box-shadow: 0px 2px 6px -2px rgba(0,0,0,0.75);-moz-box-shadow: 0px 2px 6px -2px rgba(0,0,0,0.75);box-shadow: 0px 2px 6px -2px rgba(0,0,0,0.75);\"\n" +
    "href=\"https://{{currentUser.business.domain}}.coachseek.com\"\n" +
    "target=\"_blank\"\n" +
    ">{{'booking:book-now' | i18next}}</a>"
  );


  $templateCache.put('booking/partials/booking.html',
    "<div class=\"current-booking-status\">\n" +
    "    <div class=\"border-right\"><p>{{'booking:current-booking' | i18next}}  {{business.name}}<p></div>\n" +
    "    <div class=\"border-right\"><p>{{currentBooking.filters.location.name}}</p></div>\n" +
    "    <div class=\"border-right\"><p>{{currentBooking.filters.service.name}}</p></div>\n" +
    "    <booking-date-range></booking-date-range>\n" +
    "    <booking-price></booking-price>\n" +
    "</div>\n" +
    "<div class=\"booking-container\">  \n" +
    "    <div ui-view=\"booking-view\" class=\"booking-content-container\"></div>\n" +
    "</div>\n" +
    "<a class=\"powered-by\" href=\"http://www.coachseek.com/\" target=\"_blank\">\n" +
    "    <div><span>{{'booking:powered-by' | i18next}}</span><span class=\"logo\"></span></div>\n" +
    "</a>"
  );


  $templateCache.put('booking/partials/bookingAdminView.html',
    "<!-- <div class=\"booking-admin-nav-container\">\n" +
    "        <a class=\"booking-nav active\" >{{'booking:booking-admin.onlinebooking' | i18next}}</a>\n" +
    "        <a class=\"booking-nav\">{{'booking:booking-admin.payments' | i18next}}</a>    \n" +
    "</div> -->\n" +
    "<div class=\"booking-admin-container\">    \n" +
    "    <!-- <hr class=\"double-wide\"> -->\n" +
    "    <div class=\"booking-admin-onlinebooking\">\n" +
    "        <label>{{'booking:booking-admin.address' | i18next}}</label>\n" +
    "        <input type=\"text\" ng-readonly=\"true\" value=\"{{currentUser.business.domain}}.coachseek.com\">\n" +
    "        <a  class=\"booking-preview-button\"\n" +
    "            ng-href=\"window.open('https://{{currentUser.business.domain}}.coachseek.com', '_system','location=yes');\"\n" +
    "        >\n" +
    "            {{'booking:preview-button' | i18next}}\n" +
    "        </a>\n" +
    "        <label class=\"clearfix\">{{'booking:booking-admin.code' | i18next}}</label>\n" +
    "        <input    ng-readonly=\"true\" ng-model=\"buttonHTML\"/>\n" +
    "        <button class=\"booking-admin-copy-btn clearfix\" clip-copy=\"buttonHTML\" clip-click=\"copied = true\" ng-i18next>{{copied ? 'booking:booking-admin.copied' : 'booking:booking-admin.code-btn'}}</button>\n" +
    "    </div>\n" +
    "<!--         <div class=\"booking-admin-payments\">\n" +
    "        <label>{{'booking:booking-admin.accept-payments' | i18next}}</label>\n" +
    "        <select name=\"\" id=\"\">\n" +
    "            <option value=\"\">Yes</option>\n" +
    "            <option value=\"\">No</option>\n" +
    "        </select>\n" +
    "        <hr>\n" +
    "        <p class=\"paypal\">{{'booking:booking-admin.paypal' | i18next}}</p>    \n" +
    "        <p>{{'booking:booking-admin.activate' | i18next}}</p>\n" +
    "\n" +
    "        <label for=\"\">{{'booking:booking-admin.email' | i18next}}</label>\n" +
    "        <input type=\"text\">\n" +
    "        <button class=\"booking-admin-save-btn\">{{'booking:booking-admin.save' | i18next}}</button>\n" +
    "        </div> -->\n" +
    "    \n" +
    "</div>\n"
  );


  $templateCache.put('booking/partials/bookingConfirmationView.html',
    "<hr/>\n" +
    "<div class=\"booking-details-container\">\n" +
    "    <div class=\"booking-details\">\n" +
    "        <h4>{{'booking:booking-for' | i18next}} {{currentBooking.customer.firstName}} {{currentBooking.customer.lastName}}</h4>\n" +
    "        <p>{{currentBooking.filters.location.name}}</p>\n" +
    "        <p>{{currentBooking.filters.service.name}}</p>\n" +
    "        <p>{{calculateBookingDateRange()}}</p>\n" +
    "        <h2>{{'booking:confirmation.total' | i18next}} <span ng-i18next=\"denominations.{{business.currency}}\"></span>{{calculateTotalPrice()}} {{business.currency}}</h2>\n" +
    "    </div>\n" +
    "    <loading-animation ng-show=\"processingBooking\"></loading-animation>\n" +
    "    <div ng-hide=\"processingBooking || bookingConfirmed\">\n" +
    "        <button class=\"back-button\" ui-sref=\"booking.details\">{{'booking:confirmation.change-booking' | i18next}}</button>\n" +
    "        <button class=\"continue-button\" ng-click=\"processBooking()\">{{'booking:confirmation.process-booking' | i18next}}</button>\n" +
    "    </div>\n" +
    "    <div ng-show=\"bookingConfirmed\" class=\"booking-confirmed\">\n" +
    "        <h4>{{'booking:confirmation.booking-confirmed' | i18next}}</h4>\n" +
    "        <button class=\"continue-button\" ng-click=\"resetBookings()\">{{'booking:confirmation.reset-bookings' | i18next}}</button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<hr/>"
  );


  $templateCache.put('booking/partials/bookingCourseSessions.html',
    "<div class=\"full-course session-box\" ng-click=\"toggleEntireCourse()\" ng-disabled=\"availableSessions.length === 0\" ng-class=\"{'selected': booking.course && booking.course.id === event.id}\">\n" +
    "    <div class=\"selected-checkbox\"><i ng-class=\"currentBooking.booking.course.id === event.id ? 'fa-check-circle' : 'fa-circle-o' \" class=\"fa\"></i></div>\n" +
    "    <span ng-i18next=\"[html]booking:{{isBefore(event) ? 'rest-of-course' : 'full-course'}}\"></span> <span ng-i18next=\"denominations.{{business.currency}}\"></span>{{fullCoursePrice}}\n" +
    "</div>\n" +
    "<div class=\"course-session session-box\" ng-init=\"availableSessionSpaces = getSessionSpacesAvailable(session); isBefore=isBefore(session)\"  ng-repeat=\"session in selectedEvent.sessions\" ng-click=\"toggleSessionSelect(session)\" ng-class=\"{selected: isSelected(session), 'is-before': isBefore, 'sold-out': availableSessionSpaces <= 0}\">\n" +
    "    <div class=\"selected-checkbox\"><i ng-class=\"isSelected(session) ? 'fa-check-circle' : 'fa-circle-o' \" class=\"fa\"></i></i></div>\n" +
    "    <div class=\"full-session-banner\" ng-show=\"availableSessionSpaces <= 0\">{{'booking:full-session' | i18next}}</div>\n" +
    "    <p>{{getSessionDate(session)}}</p>\n" +
    "    <p>{{getEventTimeRange(session)}}</p>\n" +
    "    <p ng-if=\"event.pricing.sessionPrice >=0\"><span ng-i18next=\"denominations.{{business.currency}}\"></span>{{session.pricing.sessionPrice}} {{'booking:per-session' | i18next}}</p>\n" +
    "    <p ng-i18next=\"[i18next]({count:availableSessionSpaces})booking:spaces-available\" class=\"spaces-available\"></p>\n" +
    "</div>"
  );


  $templateCache.put('booking/partials/bookingCustomerDetailsView.html',
    "<form name=\"form\" class=\"booking-customer-form crud-item\">\n" +
    "    <div class=\"form-input\">\n" +
    "        <label name=\"firstName\">{{'booking:details.first-name' | i18next}}</label>\n" +
    "        <input name=\"firstName\" ng-model=\"currentBooking.customer.firstName\" placeholder=\"{{'booking:details.first-name-placeholder' | i18next}}\"    required ng-maxlength=\"50\" />\n" +
    "\n" +
    "        <div class=\"error-messages\" ng-messages=\"form.firstName.$error\" ng-if=\"form.firstName.$touched\">\n" +
    "            <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            <div ng-message=\"duplicatename\">{{'businessSetup:error.duplicatename' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-input\">\n" +
    "        <label name=\"lastName\">{{'booking:details.last-name' | i18next}}</label>\n" +
    "        <input name=\"lastName\" ng-model=\"currentBooking.customer.lastName\" required ng-maxlength=\"50\" />\n" +
    "\n" +
    "        <div class=\"error-messages\" ng-messages=\"form.lastName.$error\" ng-if=\"form.lastName.$touched\">\n" +
    "            <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            <div ng-message=\"duplicatename\"><i class='fa fa-2x fa-times'></i></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-input\">\n" +
    "        <label name=\"email\">{{'booking:details.email' | i18next}}</label>\n" +
    "        <input type=\"email\" name=\"email\" ng-model=\"currentBooking.customer.email\" placeholder=\"{{'booking:details.email-placeholder' | i18next}}\" ng-maxlength=\"100\" required/>\n" +
    "\n" +
    "        <div class=\"error-messages\" ng-messages=\"form.email.$error\" ng-if=\"form.email.$touched\">\n" +
    "            <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            <div ng-message=\"email\">{{'businessSetup:error.email' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-input\">\n" +
    "        <label name=\"phone\">{{'booking:details.phone' | i18next}}</label>\n" +
    "        <input name=\"phone\" ng-model=\"currentBooking.customer.phone\" placeholder=\"{{'booking:details.phone-placeholder' | i18next}}\" ng-maxlength=\"50\" required/>\n" +
    "\n" +
    "        <div class=\"error-messages\" ng-messages=\"form.phone.$error\" ng-if=\"form.phone.$touched\">\n" +
    "            <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "<button class=\"back-button\" ui-sref=\"booking.selection\">{{'booking:common.back' | i18next}}</button>\n" +
    "<button class=\"continue-button\" ng-disabled=\"form.$invalid\" ui-sref=\"booking.confirmation\">{{'booking:common.next' | i18next}}</button>\n"
  );


  $templateCache.put('booking/partials/bookingDateRange.html',
    "<div class=\"border-right\"><p>{{calculateBookingDateRange()}}</p></div>\n"
  );


  $templateCache.put('booking/partials/bookingPaymentView.html',
    "<div class=\"content-container\">\n" +
    "  <div class=\"content container\">\n" +
    "    <div class=\"content-center\">\n" +
    "      <h3>Booking with {{\"coach name\"}}</h3>\n" +
    "      <input type=\"input\" ng-model=\"bookingEmail\">\n" +
    "      {{ bookingEmail }}\n" +
    "      <form action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\">\n" +
    "        <input type=\"hidden\" name=\"cmd\" value=\"_xclick\">\n" +
    "        <input type=\"hidden\" name=\"business\" ng-value=\"bookingEmail\">\n" +
    "        <input type=\"hidden\" name=\"item_name\" value=\"Item Name\">\n" +
    "        <input type=\"hidden\" name=\"currency_code\" value=\"USD\">\n" +
    "        <input type=\"hidden\" name=\"amount\" value=\"0.00\">\n" +
    "        <input type=\"image\" src=\"http://www.paypal.com/en_US/i/btn/x-click-but01.gif\" name=\"submit\" alt=\"Make payments with PayPal - it's fast, free and secure!\" style=\"border: 0px none ; padding: 0px; width: 62px; height: 31px;\">\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"actions col-xs-12 col-sm-5\">\n" +
    "      <a class=\"back-link\" ui-sref=\"booking.details\">{{'booking:common.back' | i18next}}</a>\n" +
    "      <button class=\"btn-save btn-large\" ng-disabled=\"true\" ng-click=\"initPaypalPayment()\"><span ng-i18next>{{AILoading ? 'waiting...' : 'Continue'}}</span>\n" +
    "      </button>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('booking/partials/bookingPrice.html',
    "<div><h4><span ng-i18next=\"denominations.{{business.currency}}\"></span>{{calculateTotalPrice()}} {{business.currency}}</h4></div>"
  );


  $templateCache.put('booking/partials/bookingRectangle.html',
    "<div ng-click=\"toggleEventSelect()\" class=\"event\">\n" +
    "    <div class=\"selected-checkbox\" ng-hide=\"event.sessions && event.pricing.sessionPrice >= 0\"><i ng-class=\"selectedEvent && selectedEvent.id === event.id ? 'fa-check-circle' : 'fa-circle-o' \" class=\"fa\"></i></div>\n" +
    "    <i ng-show=\"isBigScreen\" class=\"expand fa fa-expand\" ng-if=\"event.sessions && event.pricing.sessionPrice >= 0 && selectedEvent.id !== event.id\"></i>\n" +
    "    <div class=\"event-info-container\">\n" +
    "        <p class=\"date-range\">{{getEventDateRange()}}</p>\n" +
    "        <p class=\"session-type\" ng-if=\"event.sessions\" ng-i18next=\"[i18next]({count:event.repetition.sessionCount})booking:{{event.repetition.repeatFrequency}}\"></p>\n" +
    "        <hr/>\n" +
    "        <div class=\"booking-rectangle-info\">\n" +
    "            <i class=\"fa fa-clock-o\"></i>\n" +
    "            <p>{{getEventTimeRange()}}</p>    \n" +
    "        </div>\n" +
    "        <div class=\"booking-rectangle-info\">\n" +
    "            <i class=\"fa fa-usd\"></i>\n" +
    "            <p ng-if=\"event.pricing.sessionPrice >=0\"><span ng-i18next=\"denominations.{{business.currency}}\"></span>{{event.pricing.sessionPrice}} {{'booking:per-session' | i18next}}</p>  \n" +
    "            <p ng-if=\"event.sessions && event.pricing.coursePrice >=0\"><span ng-i18next=\"denominations.{{business.currency}}\"></span>{{fullCoursePrice}} {{'booking:full-course' | i18next}}</p>\n" +
    "        </div>\n" +
    "        <div class=\"booking-rectangle-info\">\n" +
    "            <i class=\"fa fa-user\"></i>\n" +
    "            <p ng-i18next=\"[i18next]({count:spacesAvailable})booking:spaces-available\" class=\"spaces-available\"></p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"course-sessions-container\" ng-show=\"event.sessions && selectedEvent.id === event.id && event.pricing.sessionPrice >=0\">\n" +
    "        <div class=\"close-event\" ng-click=\"closeEvent()\"><span ng-if=\"isBigScreen\">{{'booking:close' | i18next}}</span><i class=\"fa fa-close\"></i></div>\n" +
    "        <hr/>\n" +
    "        <div class=\"event-begun\" ng-show=\"isBefore(event)\"><i class=\"fa fa-exclamation-circle\"> {{'booking:event-begun' | i18next}}</i></div>\n" +
    "        <booking-course-sessions></booking-course-sessions>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('booking/partials/bookingSelectionView.html',
    "<div class=\"booking-selection-container\" ng-show=\"eventsExist\">\n" +
    "    <div class=\"form-input location-selection\">\n" +
    "        <label for=\"location\">{{'booking:location-section.label' | i18next}}</label>\n" +
    "        <select-arrows></select-arrows>\n" +
    "        <select name=\"location\" ng-disabled=\"loadingSessions\" ng-options=\"location.name for location in locations\" ng-model=\"currentBooking.filters.location\" id=\"location\" required ng-change=\"filterByLocation(true)\">\n" +
    "        </select>\n" +
    "    </div>\n" +
    "    <div class=\"form-input service-selection\">\n" +
    "        <label  name=\"service\">{{'booking:services-section.label' | i18next}}</label>\n" +
    "        <select-arrows></select-arrows>\n" +
    "        <select name=\"service\" ng-disabled=\"loadingSessions || !currentBooking.filters.location\" ng-model=\"currentBooking.filters.service\" ng-options=\"service.name for service in services\" ng-change=\"filterByService(true)\" required></select>\n" +
    "    </div>\n" +
    "    <button class=\"continue-button\" ui-sref=\"booking.details\" ng-disabled=\"disableContinue()\">{{'booking:common.next'|i18next}}</button>\n" +
    "    <div ng-show=\"currentBooking.filters.service && !loadingSessions\" class=\"service-description\">{{currentBooking.filters.service.description}}</div>\n" +
    "    <div class=\"service-description\" ng-if=\"!loadingSessions && serviceDescription\">\n" +
    "        <div>{{serviceDescription}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"events-container\" ng-if=\"currentBooking.filters.service && !loadingSessions\">\n" +
    "        <hr/>\n" +
    "        <label class=\"block bold\">{{'booking:event-select' | i18next}}</label>\n" +
    "        <booking-rectangle ng-repeat=\"event in events\" ng-class=\"{'expanded': event.sessions && event.pricing.sessionPrice >= 0 && selectedEvent.id === event.id, 'selected': selectedEvent && selectedEvent.id === event.id}\"></booking-rectangle>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<loading-animation ng-show=\"loadingSessions\"></loading-animation>\n" +
    "<div class=\"no-events-message\" ng-show=\"!eventsExist && !loadingSessions\">\n" +
    "    <h1>{{'booking:hey-there' | i18next}}</h1>\n" +
    "    <h3>{{'booking:no-events' | i18next}}</h3>\n" +
    "</div>\n"
  );


  $templateCache.put('businessSetup/partials/businessRegistrationView.html',
    "<div class=\"coachseek-logo\"></div>\n" +
    "<h4>{{'businessSetup:onboarding.welcome' | i18next}}</h4>\n" +
    "<p>{{'businessSetup:onboarding.no-card-required' | i18next}}</p>\n" +
    "<p>{{'businessSetup:onboarding.existing-member' | i18next}}<span ui-sref=\"scheduling\"> {{'businessSetup:onboarding.login' | i18next}}</span></p>\n" +
    "<hr class=\"double-wide\"/>\n" +
    "<div class=\"business-item-view crud-item\">\n" +
    "    <form name=\"itemForm\" novalidate ng-enter=\"saveItem(item)\">\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"name\">{{'businessSetup:business-details.name' | i18next}}</label>\n" +
    "            <input name=\"name\" ng-model=\"business.name\" placeholder=\"{{'businessSetup:business-details.placeholder.name' | i18next}}\" required ng-maxlength=50 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.name.$error\" ng-if=\"itemForm.name.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"duplicatename\">{{'businessSetup:error.duplicatename' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"firstName\">{{'person-details.first-name' | i18next}}</label>\n" +
    "            <input name=\"firstName\" ng-model=\"admin.firstName\" placeholder=\"{{'person-details.placeholder.first-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.firstName.$error\" ng-if=\"itemForm.firstName.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input right-col\">\n" +
    "            <label name=\"lastName\">{{'person-details.last-name' | i18next}}</label>\n" +
    "            <input name=\"lastName\" ng-model=\"admin.lastName\" placeholder=\"{{'person-details.placeholder.last-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.lastName.$error\" ng-if=\"itemForm.lastName.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"email\">{{'person-details.email' | i18next}}</label>\n" +
    "            <input type=\"email\" name=\"email\" ng-model=\"admin.email\" placeholder=\"{{'person-details.placeholder.email' | i18next}}\"  required ng-maxlength=100 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.email.$error\" ng-if=\"itemForm.email.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"email\">{{'businessSetup:error.email' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"password\">{{'person-details.password' | i18next}}</label>\n" +
    "            <input name=\"password\" type=\"password\" ng-model=\"admin.password\" placeholder=\"&#xf1e3;&#xf1e3;&#xf1e3;&#xf1e3;&#xf1e3;&#xf1e3;\" required ng-minlength=6 ng-maxlength=50 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.password.$error\" ng-if=\"itemForm.password.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"minlength\">{{'businessSetup:error.minlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <currency-picker></currency-picker>\n" +
    "    </form>\n" +
    "\n" +
    "    <button class=\"save-button\" ng-click=\"saveItem(item)\" ng-disabled=\"AILoading\"><span ng-i18next>{{AILoading ? 'saving' : 'save-details'}}</span><ellipsis-animated ng-show=\"AILoading\"/></button>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/businessSetup.html',
    "<div class=\"setup-nav-container\">\n" +
    "    <a class=\"setup-nav nav-to-business\" ui-sref=\"businessSetup.business\" ui-sref-active=\"active\">{{'businessSetup:nav-to-business' | i18next}}</a>\n" +
    "    <a class=\"setup-nav nav-to-locations\" ui-sref=\"businessSetup.locations\" ui-sref-active=\"active\">{{'businessSetup:nav-to-locations' | i18next}}</a>\n" +
    "    <a class=\"setup-nav nav-to-coaches\" ui-sref=\"businessSetup.coachList\" ui-sref-active=\"active\">{{'businessSetup:nav-to-coaches' | i18next}}</a>\n" +
    "    <a class=\"setup-nav nav-to-services\" ui-sref=\"businessSetup.services\" ui-sref-active=\"active\">{{'businessSetup:nav-to-services' | i18next}}</a>\n" +
    "    <hr class=\"double-wide\">\n" +
    "</div>\n" +
    "<div class=\"list-item-container-wrapper\">  \n" +
    "    <div ui-view=\"list-item-view\"></div>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/businessView.html',
    "<div class=\"business-list-view crud-list\" ng-hide=\"item\">\n" +
    "    <ul>\n" +
    "        <li class=\"business-details\">\n" +
    "            <button class=\"edit-item\" ng-click=\"editItem()\">{{'edit-details' | i18next}}</button>\n" +
    "            <span class=\"item-title\">{{business.name}}</span>\n" +
    "            <span class=\"item-subtitle\" >{{business.currency}}</span>\n" +
    "            <span class=\"item-subtitle last\">{{business.domain}}.coachseek.com</span>\n" +
    "            <hr/>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div class=\"business-item-view crud-item\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" novalidate ng-enter=\"saveItem(item)\">\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"name\">{{'businessSetup:business-details.name' | i18next}}</label>\n" +
    "            <input name=\"name\" ng-model=\"business.name\" placeholder=\"{{'businessSetup:business-details.placeholder.name' | i18next}}\" required ng-maxlength=50 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.name.$error\" ng-if=\"itemForm.name.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"duplicatename\">{{'businessSetup:error.duplicatename' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <currency-picker></currency-picker>\n" +
    "    </form>\n" +
    "\n" +
    "    <button class=\"save-button\" ng-click=\"saveItem(item)\" ng-disabled=\"AILoading\"><span ng-i18next>{{AILoading ? 'saving' : 'save-details'}}</span><ellipsis-animated ng-show=\"AILoading\"/></button>\n" +
    "    <button class=\"cancel-button\" ng-hide=\"newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/coachesView.html',
    "<div class=\"coach-list-view crud-list\" ng-hide=\"item\" ng-tab-add=\"createItem()\">\n" +
    "    <button class=\"create-item\" ng-click=\"createItem()\" ng-disabled=\"AILoading\">\n" +
    "        <i class=\"fa fa-plus\"></i>\n" +
    "        {{'businessSetup:add-coach' | i18next}}\n" +
    "    </button>\n" +
    "    <hr />\n" +
    "    <ul>\n" +
    "        <li class=\"coach-details\" ng-repeat=\"item in itemList | orderBy:'lastName'\">\n" +
    "            <!-- show coach edit on click -->\n" +
    "            <button class=\"edit-item\" ng-click=\"editItem(item)\">{{'edit-details' | i18next}}</button>\n" +
    "            <span class=\"item-title\">{{item.firstName}} {{item.lastName}}</span>\n" +
    "            <span class=\"item-subtitle last\">{{item.phone}}</span>\n" +
    "            <hr />\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div class=\"coach-item-view crud-item\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" novalidate ng-enter=\"saveItem(item)\">\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"firstName\">{{'person-details.first-name' | i18next}}</label>\n" +
    "            <input name=\"firstName\" ng-model=\"item.firstName\" placeholder=\"{{'person-details.placeholder.first-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.firstName.$error || itemForm.lastName.$error\" ng-if=\"itemForm.firstName.$touched || itemForm.lastName.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"duplicatename\">{{'businessSetup:error.duplicatename' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input right-col\">\n" +
    "            <label name=\"lastName\">{{'person-details.last-name' | i18next}}</label>\n" +
    "            <input name=\"lastName\" ng-model=\"item.lastName\" placeholder=\"{{'person-details.placeholder.last-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.firstName.$error || itemForm.lastName.$error\" ng-if=\"itemForm.firstName.$touched || itemForm.lastName.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"duplicatename\"><i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"email\">{{'person-details.email' | i18next}}</label>\n" +
    "            <input type=\"email\" name=\"email\" ng-model=\"item.email\" placeholder=\"{{'person-details.placeholder.email' | i18next}}\"  required ng-maxlength=100 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.email.$error\" ng-if=\"itemForm.email.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"email\">{{'businessSetup:error.email' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"phone\">{{'person-details.phone' | i18next}}</label>\n" +
    "            <input name=\"phone\" ng-model=\"item.phone\" placeholder=\"{{'person-details.placeholder.phone' | i18next}}\"  required ng-maxlength=50 />\n" +
    "            \n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.phone.$error\" ng-if=\"itemForm.phone.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <label>{{'person-details.availability' | i18next}}</label>\n" +
    "        <time-slot></time-slot>\n" +
    "    </form>\n" +
    "\n" +
    "    <button class=\"save-button\" ng-click=\"saveItem(item)\" ng-disabled=\"AILoading\"><span ng-i18next>{{AILoading ? 'saving' : 'save-details'}}</span><ellipsis-animated ng-show=\"AILoading\"/></button>\n" +
    "    <button class=\"cancel-button\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/colorPicker.html',
    "<ul >\n" +
    "    <li \n" +
    "        ng-repeat=\"color in colors\"\n" +
    "        ng-class=\"{selected: (color===currentColor)}\"\n" +
    "        ng-click=\"$parent.currentColor = color\"\n" +
    "        class=\"{{color}}\"\n" +
    "    ></li>\n" +
    "</ul>"
  );


  $templateCache.put('businessSetup/partials/currencyPicker.html',
    "<div class=\"form-input\">\n" +
    "    <label name=\"currency\">{{'operating-currency' | i18next}}</label>\n" +
    "    <select-arrows></select-arrows>\n" +
    "    <select name=\"currency\" class=\"currency-picker\" ng-model=\"business.currency\" ng-options=\"currency as currency for currency in currencies\" required></select>\n" +
    "\n" +
    "    <div class=\"error-messages\" ng-messages=\"itemForm.currency.$error\" ng-if=\"itemForm.currency.$touched\">\n" +
    "        <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/locationsView.html',
    "<div class=\"location-list-view crud-list\" ng-hide=\"item\" ng-tab-add=\"createItem()\">\n" +
    "    <button class=\"create-item\" ng-click=\"createItem()\" ng-disabled=\"AILoading\">\n" +
    "        <i class=\"fa fa-plus\"></i>\n" +
    "        {{'businessSetup:add-location' | i18next}}\n" +
    "    </button>\n" +
    "    <hr />\n" +
    "    <ul>\n" +
    "        <li class=\"location-details\" ng-repeat=\"item in itemList | orderBy:'name'\">\n" +
    "            <button class=\"edit-item\" ng-click=\"editItem(item)\">{{'edit-details' | i18next}}</button>\n" +
    "            <span class=\"item-title\">{{item.name}}</span>\n" +
    "            <span class=\"item-subtitle last\">{{item.address}}</span>\n" +
    "            <hr />\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div class=\"location-item-view crud-item\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" novalidate ng-enter=\"saveItem(item)\">\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"name\">{{'businessSetup:location-details.name' | i18next}}</label>\n" +
    "            <input name=\"name\" ng-model=\"item.name\" placeholder=\"{{'businessSetup:location-details.placeholder.name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.name.$error\" ng-if=\"itemForm.name.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"duplicatename\">{{'businessSetup:error.duplicatename' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <hr />\n" +
    "        <!-- <div class=\"form-input\">\n" +
    "            <label name=\"address\">{{'businessSetup:location-details.address' | i18next}}</label>\n" +
    "            <input name=\"address\" ng-blur=\"updateAddress()\" ng-model=\"item.address\" placeholder=\"{{'businessSetup:location-details.placeholder.address' | i18next}}\"/>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"city\">{{'businessSetup:location-details.city' | i18next}}</label>\n" +
    "            <input name=\"city\" ng-model=\"item.city\" placeholder=\"{{'businessSetup:location-details.placeholder.city' | i18next}}\"/>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"form-input right-col\">\n" +
    "            <label name=\"postCode\">{{'businessSetup:location-details.post-code' | i18next}}</label>\n" +
    "            <input name=\"postCode\" type=\"number\" ng-model=\"item.postCode\" placeholder=\"{{'businessSetup:location-details.placeholder.post-code' | i18next}}\"/>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"country\">{{'businessSetup:location-details.country' | i18next}}</label>\n" +
    "            <input name=\"country\" ng-model=\"item.country\" placeholder=\"{{'businessSetup:location-details.placeholder.country' | i18next}}\"/>\n" +
    "        </div> -->\n" +
    "    </form>\n" +
    "\n" +
    "    <button class=\"save-button\" ng-click=\"saveItem(item)\" ng-disabled=\"AILoading\"><span ng-i18next>{{AILoading ? 'saving' : 'save-details'}}</span><ellipsis-animated ng-show=\"AILoading\"/></button>\n" +
    "    <button class=\"cancel-button\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/repeatSelector.html',
    "<div class=\"form-input\">\n" +
    "    <label name=\"repeatable\" class=\"repeat-label\">{{'businessSetup:repeat-selector.is-repeatable' | i18next}}</label>\n" +
    "    <select class=\"repeatable-dropdown\"\n" +
    "        ng-model=\"isRepeatable\"\n" +
    "        ng-options=\"opt.value as (opt.text |i18next) for opt in repeatableOptions\"\n" +
    "        ng-change=\"toggleRepeatable()\">\n" +
    "    </select>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-input frequency-selector\" ng-show=\"isRepeatable\">\n" +
    "    <span>{{'businessSetup:repeat-selector.repeat-session' | i18next}}</span>\n" +
    "    <select class=\"repeat-frequency\" name=\"frequency\" ng-model=\"repeatFrequency\">\n" +
    "        <option ng-repeat=\"item in frequencies\" value=\"{{item.value}}\" ng-i18next>businessSetup:repeat-selector.{{item.text}}</option>\n" +
    "    </select>\n" +
    "    <span class=\"total-of\">{{'businessSetup:repeat-selector.total-of' | i18next}}</span>\n" +
    "    <input class=\"session-count\" name=\"sessionCount\" ng-blur=\"setValues()\" ng-focus=\"isFocused = true\" type=\"number\" ng-model=\"sessionCount\" placeholder=\"{{'businessSetup:repeat-selector.placeholder.session-count' | i18next}}\"  min=\"1\" max=\"30\" step=\"1\"/>\n" +
    "    <span class=\"days-or-weeks\" ng-i18next=\"{{ showStatus() }}\"></span>\n" +
    "    <!-- forever checkbox -->\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/servicesView.html',
    "<div class=\"service-list-view crud-list\" ng-hide=\"item\" ng-tab-add=\"createItem()\">\n" +
    "    <button class=\"create-item\" ng-click=\"createItem()\" ng-disabled=\"AILoading\">\n" +
    "        <i class=\"fa fa-plus\"></i>\n" +
    "        {{'businessSetup:add-service' | i18next}}\n" +
    "    </button>\n" +
    "    <hr />\n" +
    "    <ul>\n" +
    "        <li class=\"service-details\" ng-repeat=\"item in itemList | orderBy:'name'\">\n" +
    "            <button class=\"edit-item\" ng-click=\"editItem(item)\">{{'edit-details' | i18next}}</button>\n" +
    "            <span class=\"item-title\">{{item.name}}</span>\n" +
    "            <span class=\"item-subtitle service-description last\" ng-bind-html=\"item.description | linky:'_blank'\"></span>\n" +
    "            <hr />\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div class=\"service-item-view crud-item\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" novalidate ng-enter=\"saveItem(item)\">\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"name\">{{'businessSetup:service-details.name' | i18next}}</label>\n" +
    "            <input name=\"name\" ng-model=\"item.name\" placeholder=\"{{'businessSetup:service-details.placeholder.name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.name.$error\" ng-if=\"itemForm.name.$touched\">\n" +
    "                <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"duplicatename\">{{'businessSetup:error.duplicatename' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"description\">{{'businessSetup:service-details.description' | i18next}}</label>\n" +
    "            <textarea name=\"description\" ng-model=\"item.description\" placeholder=\"{{'businessSetup:service-details.placeholder.description' | i18next}}\" ng-maxlength=\"200\"></textarea>\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.description.$error\" ng-if=\"itemForm.description.$touched\">\n" +
    "                <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"duration\">{{'businessSetup:service-details.duration' | i18next}}</label>\n" +
    "            <duration-picker duration=\"item.timing.duration\"></duration-picker>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"studentCapacity\">{{'businessSetup:service-details.student-capacity' | i18next}}</label>\n" +
    "            <input name=\"studentCapacity\" type=\"number\" ng-model=\"item.booking.studentCapacity\" placeholder=\"{{'businessSetup:service-details.placeholder.student-capacity' | i18next}}\"  min=\"1\" ng-max=\"100\" />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"itemForm.studentCapacity.$error\" ng-if=\"itemForm.studentCapacity.$touched\">\n" +
    "                <div ng-message=\"max\">{{'businessSetup:error.max-capacity' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                <div ng-message=\"min\">{{'businessSetup:error.min-capacity' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input right-col\">\n" +
    "            <label name=\"isOnlineBookable\">{{'businessSetup:service-details.is-online-bookable' | i18next}}</label>\n" +
    "            <select name=\"isOnlineBookable\"\n" +
    "                class=\"online-bookable\"\n" +
    "                ng-model=\"item.booking.isOnlineBookable\"\n" +
    "                ng-options=\"opt.value as (opt.text |i18next) for opt in [{text:'yes', value: true},{text:'no', value: false}]\">\n" +
    "            </select>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label>{{'businessSetup:service-details.service-colour' | i18next}}</label>\n" +
    "            <color-picker\n" +
    "                current-color=\"item.presentation.colour\"\n" +
    "            ></color-picker>\n" +
    "        </div>\n" +
    "\n" +
    "        <repeat-selector\n" +
    "            repeat-frequency=\"item.repetition.repeatFrequency\"\n" +
    "            session-count=\"item.repetition.sessionCount\"\n" +
    "        ></repeat-selector>\n" +
    "\n" +
    "        <div class=\"session-price form-input left-col\">\n" +
    "            <label name=\"sessionPrice\">{{'businessSetup:service-details.session-price' | i18next}}</label>\n" +
    "            <span class=\"money-sign\" ng-i18next=\"denominations.{{currentUser.business.currency}}\"></span>\n" +
    "            <input name=\"sessionPrice\" type=\"number\" ng-model=\"item.pricing.sessionPrice\" placeholder=\"{{'businessSetup:service-details.placeholder.session-price' | i18next}}\"  min=\"0\" step=\"1.00\"  />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"course-price form-input right-col\" ng-hide=\"item.repetition.sessionCount < 2\" >\n" +
    "            <label name=\"coursePrice\">{{'businessSetup:service-details.course-price' | i18next}}</label>\n" +
    "            <span class=\"money-sign\" ng-i18next=\"denominations.{{currentUser.business.currency}}\"></span>\n" +
    "            <input name=\"coursePrice\" type=\"number\" ng-model=\"item.pricing.coursePrice\" placeholder=\"{{'businessSetup:service-details.placeholder.course-price' | i18next}}\"  min=\"0\" step=\"1.00\" />\n" +
    "        </div>\n" +
    "    </form>\n" +
    "    <button class=\"save-button\" ng-click=\"saveItem(item)\" ng-disabled=\"AILoading\"><span ng-i18next>{{AILoading ? 'saving' : 'save-details'}}</span><ellipsis-animated ng-show=\"AILoading\"/></button>\n" +
    "    <button class=\"cancel-button\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/timePicker.html',
    "<div class=\"time-picker\">\n" +
    "    <div class=\"hours\"> \n" +
    "        <span class=\"increase\" ng-click=\"increaseHours()\">\n" +
    "            <i class=\"fa fa-chevron-up\"></i> \n" +
    "        </span>\n" +
    "        <div class=\"display\"> {{displayHours}} </div>\n" +
    "        <span class=\"decrease\" ng-click=\"decreaseHours()\">\n" +
    "            <i class=\"fa fa-chevron-down\"></i> \n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <div class=\"semi-colon\"> : </div>\n" +
    "    <div class=\"minutes\">\n" +
    "        <span class=\"increase\" ng-click=\"increaseMinutes()\"> \n" +
    "            <i class=\"fa fa-chevron-up\"></i> \n" +
    "        </span>\n" +
    "        <div class=\"display\"> {{displayMinutes}} </div>\n" +
    "        <span class=\"decrease\" ng-click=\"decreaseMinutes()\"> \n" +
    "            <i class=\"fa fa-chevron-down\"></i> \n" +
    "        </span> \n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"button-container\">\n" +
    "        <button class=\"time-picker-cancel-button\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "        <button class=\"time-picker-save-button\" ng-click=\"saveEdit()\">{{'save' | i18next}}</button>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/timeRangePicker.html',
    "<input type=\"text\" ng-click=\"editTime('startTime')\" ng-model='workingHours.startTime' class=\"time-picker-time start\" ng-readonly=\"true\">\n" +
    "<span class='to-text'>{{'to' | i18next}}</span>\n" +
    "<input type=\"text\" ng-click=\"editTime('finishTime')\" ng-model='workingHours.finishTime' class=\"time-picker-time finish\" ng-readonly=\"true\">\n" +
    "\n" +
    "<div class=\"time-picker-container\" ng-show=\"editingTime\">\n" +
    "    <time-picker ng-if=\"currentTime === 'startTime'\" time=\"workingHours.startTime\"></time-picker>\n" +
    "    <time-picker ng-if=\"currentTime === 'finishTime'\" time=\"workingHours.finishTime\"></time-picker>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\" ng-class=\"item.workingHours[weekday].isAvailable ? 'open' : 'closed'\" class=\"weekday\">\n" +
    "    <div class=\"weekday-text\" ng-i18next>businessSetup:weekdays.{{weekday}}</div>\n" +
    "    <time-range-picker\n" +
    "        class=\"slide-closed\"\n" +
    "        ng-model=\"item.workingHours[weekday]\"\n" +
    "        working-hours=\"item.workingHours[weekday]\"\n" +
    "        ng-show='item.workingHours[weekday].isAvailable'>\n" +
    "    </time-range-picker>\n" +
    "    <button\n" +
    "        type=\"button\"\n" +
    "        class=\"toggle-time-slot\"\n" +
    "        ng-model=\"item.workingHours[weekday].isAvailable\"\n" +
    "        ng-click=\"item.workingHours[weekday].isAvailable = !item.workingHours[weekday].isAvailable\">\n" +
    "        <i\n" +
    "            class=\"fa fa-2x\"\n" +
    "            ng-class=\"item.workingHours[weekday].isAvailable ? 'fa-angle-left' : 'fa-angle-right' \"\n" +
    "        ></i>\n" +
    "    </button>\n" +
    "</div>"
  );


  $templateCache.put('customers/partials/customersView.html',
    "<div class=\"customers-list-view crud-list\" ng-hide=\"item\" ng-tab-add=\"createItem()\">\n" +
    "    <button class=\"create-item\" ng-click=\"createItem()\" ng-disabled=\"AILoading\">\n" +
    "        <i class=\"fa fa-plus\"></i>\n" +
    "        {{'customers:add-customer' | i18next}}\n" +
    "    </button>\n" +
    "    <div class=\"customer-list\" ng-controller=\"customerSearchCtrl\">\n" +
    "        <div class=\"search-container\">\n" +
    "            <i class=\"fa fa-lg fa-search\"></i>\n" +
    "            <input ng-model=\"searchText\" placeholder=\"{{'customers:search-customers' | i18next}}\"/>\n" +
    "        </div>\n" +
    "        <div class=\"letter-search\" ng-if=\"isBigScreen\">\n" +
    "            <span ng-repeat=\"letter in alphabetLetters\" ng-class=\"{active: searchLetter === letter}\" ng-click=\"sortBy(letter)\">{{letter}}</span>\n" +
    "        </div>\n" +
    "        <hr class=\"double-wide\" ng-if=\"isBigScreen\"/>\n" +
    "        <ul infinite-scroll='loadMore()'>\n" +
    "            <li class=\"customer-details\" ng-repeat=\"item in customerList\">\n" +
    "                <button class=\"edit-item\" ng-click=\"editItem(item)\">{{'edit-details' | i18next}}</button>\n" +
    "                <div ng-if=\"searchText\">\n" +
    "                    <span class=\"item-title first-name\" ng-bind-html=\"item.firstName | highlight:this\">{{item.firstName}}</span>\n" +
    "                    <span class=\"item-title last-name\" ng-bind-html=\"item.lastName | highlight:this\">{{item.lastName}}</span>\n" +
    "                    <span class=\"item-subtitle last\" ng-bind-html=\"item.phone | highlight:this\">{{item.phone}}</span>\n" +
    "                </div>\n" +
    "                <div ng-if=\"!searchText\">\n" +
    "                    <span class=\"item-title first-name\">{{item.firstName}}</span>\n" +
    "                    <span class=\"item-title last-name\" ng-bind-html=\"item.lastName | highlight:this\">{{item.lastName}}</span>\n" +
    "                    <span class=\"item-subtitle last\">{{item.phone}}</span>\n" +
    "                </div>\n" +
    "                <hr/>\n" +
    "            </li>\n" +
    "            <div class=\"no-customers\" ng-if=\"!customerList.length && !AILoading\">{{'customers:no-customers-found' | i18next}}</div>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"customers-item-view crud-item\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" novalidate ng-enter=\"saveItem(item)\">\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"firstName\">{{'person-details.first-name' | i18next}}</label>\n" +
    "            <input name=\"firstName\" ng-model=\"item.firstName\" placeholder=\"{{'person-details.placeholder.first-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "                <div class=\"error-messages\" ng-messages=\"itemForm.firstName.$error || itemForm.lastName.$error\" ng-if=\"itemForm.firstName.$touched || itemForm.lastName.$touched\">\n" +
    "                    <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                    <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                    <div ng-message=\"duplicatename\">{{'businessSetup:error.duplicatename' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-input right-col\">\n" +
    "                <label name=\"lastName\">{{'person-details.last-name' | i18next}}</label>\n" +
    "                <input name=\"lastName\" ng-model=\"item.lastName\" placeholder=\"{{'person-details.placeholder.last-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "                <div class=\"error-messages\" ng-messages=\"itemForm.firstName.$error || itemForm.lastName.$error\" ng-if=\"itemForm.firstName.$touched || itemForm.lastName.$touched\">\n" +
    "                    <div ng-message=\"required\">{{'businessSetup:error.required' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                    <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                    <div ng-message=\"duplicatename\"><i class='fa fa-2x fa-times'></i></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-input\">\n" +
    "                <label name=\"email\">{{'person-details.email' | i18next}}</label>\n" +
    "                <input type=\"email\" name=\"email\" ng-model=\"item.email\" placeholder=\"{{'person-details.placeholder.email' | i18next}}\" ng-maxlength=100 />\n" +
    "\n" +
    "                <div class=\"error-messages\" ng-messages=\"itemForm.email.$error\" ng-if=\"itemForm.email.$touched\">\n" +
    "                    <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                    <div ng-message=\"email\">{{'businessSetup:error.email' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-input\">\n" +
    "                <label name=\"phone\">{{'person-details.phone' | i18next}}</label>\n" +
    "                <input name=\"phone\" ng-model=\"item.phone\" placeholder=\"{{'person-details.placeholder.phone' | i18next}}\" ng-maxlength=50 />\n" +
    "\n" +
    "                <div class=\"error-messages\" ng-messages=\"itemForm.phone.$error\" ng-if=\"itemForm.phone.$touched\">\n" +
    "                    <div ng-message=\"maxlength\">{{'businessSetup:error.maxlength' | i18next}}<i class='fa fa-2x fa-times'></i></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "\n" +
    "        <button class=\"save-button\" ng-click=\"saveItem(item)\" ng-disabled=\"AILoading\"><span ng-i18next>{{AILoading ? 'saving' : 'save-details'}}</span><ellipsis-animated ng-show=\"AILoading\"/></button>\n" +
    "        <button class=\"cancel-button\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scheduling/partials/customerBooking.html',
    "<li class=\"student-details\">\n" +
    "    <div class=\"attending-checkbox\" ng-disabled=\"bookingLoading\" ng-click=\"toggleAttendance()\">\n" +
    "        <i class=\"fa\" ng-class=\"{'fa-check': booking.hasAttended}\" ng-hide=\"bookingLoading\"></i>\n" +
    "        <ellipsis-animated ng-show=\"bookingLoading\"/>\n" +
    "    </div>\n" +
    "    <div class=\"item-title\">{{booking.customer.firstName}} <br ng-hide=\"isBigScreen\">{{booking.customer.lastName}}</div>\n" +
    "    <div class=\"delete-booking delete-button\" ng-click=\"removeBooking()\" ng-disabled=\"bookingLoading\">\n" +
    "        <i class=\"fa fa-trash-o\"></i>\n" +
    "    </div>\n" +
    "    <div class=\"payment-status\" ng-disabled=\"bookingLoading\" ng-class=\"paymentStatus\" ng-click=\"changePaymentStatus()\" ng-i18next='scheduling:payment-status.{{paymentStatus}}'></div>\n" +
    "</li>"
  );


  $templateCache.put('scheduling/partials/modalCustomerDetails.html',
    "<li class=\"customer-details\">\n" +
    "    <span class=\"item-title first-name\" ng-bind-html=\"item.firstName | highlight:this\">{{item.firstName}}</span>\n" +
    "    <span class=\"item-title last-name\" ng-bind-html=\"item.lastName | highlight:this\">{{item.lastName}}</span>\n" +
    "    <button class=\"add-student to-course fa\" ng-if=\"currentEvent.course\" ng-disabled=\"isCourseStudent\" ng-class=\"isCourseStudent ? 'fa-check' : 'fa-plus'\" ng-click=\"addStudent(true)\" ng-hide=\"bookingLoading\"></button>\n" +
    "    <button class=\"add-student to-session fa\" ng-disabled=\"isSessionStudent\" ng-class=\"isSessionStudent ? 'fa-check' : 'fa-plus'\" ng-click=\"addStudent(false)\" ng-hide=\"bookingLoading\"></button>\n" +
    "    <ellipsis-animated ng-show=\"bookingLoading\"></ellipsis-animated>\n" +
    "</li>"
  );


  $templateCache.put('scheduling/partials/modalSessionAttendanceList.html',
    "<div class=\"attendance-list\">\n" +
    "    <div class=\"session-modal-title\">\n" +
    "        <span ng-i18next>{{showCustomers ? 'scheduling:add-student' : 'scheduling:service-details.register'}}</span>\n" +
    "        <i class=\"fa fa-times\" ng-click=\"cancelModalEdit()\"></i>        \n" +
    "    </div>\n" +
    "    <button class=\"create-item\" ng-click=\"showCustomerList()\" ng-hide=\"showCustomers\" ng-disabled=\"blockAddBookings()\">\n" +
    "        <i class=\"fa fa-plus\"></i>\n" +
    "        {{'scheduling:add-student' | i18next}}\n" +
    "    </button>\n" +
    "    <div class=\"customer-list\" ng-show=\"showCustomers\" ng-controller=\"customerSearchCtrl\">\n" +
    "        <span class=\"back-arrow\" ng-click=\"hideCustomerList()\">\n" +
    "            <i class=\"fa fa-left-single-arrow\"></i>\n" +
    "            <span>{{'scheduling:back' | i18next}}</span>\n" +
    "        </span>\n" +
    "        <div class=\"search-container\">\n" +
    "            <i class=\"fa fa-lg fa-search\"></i>    \n" +
    "            <input ng-model=\"searchText\" placeholder=\"{{'customers:search-customers' | i18next}}\"/>\n" +
    "            <div class=\"add-to-titles\" ng-if=\"currentEvent.course\">\n" +
    "                <div>{{'customers:entire-course' | i18next}}</div>\n" +
    "                <div>{{'customers:single-session' | i18next}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <ul infinite-scroll='loadMore()' ng-class=\"{'short-list': currentEvent.course}\">\n" +
    "            <modal-customer-details ng-repeat=\"item in customerList\"></modal-customer-details>\n" +
    "            <div class=\"no-customers\" ng-if=\"!customerList.length\">{{'customers:no-customers-found' | i18next}}</div>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"student-list\" ng-hide=\"showCustomers\">\n" +
    "        <ul>\n" +
    "            <customer-booking ng-repeat=\"booking in currentEvent.session.booking.bookings | orderBy:['customer.lastName', 'customer.firstName']\"></customer-booking>\n" +
    "            <div class=\"no-students\" ng-if=\"!currentEvent.session.booking.bookings\">{{'scheduling:no-students-found' | i18next}}</div>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('scheduling/partials/modalSessionForm.html',
    "<div class=\"session-modal-title\">\n" +
    "    {{'scheduling:service-details.general' | i18next}}\n" +
    "    <i class=\"fa fa-times\" ng-click=\"cancelModalEdit()\"></i>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"session-form crud-item\">\n" +
    "    <form name=\"currentSessionForm\" novalidate ng-enter=\"saveEdit()\" ng-show=\"currentTab === 'general'\">\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"duration\">{{'scheduling:service-details.start-time' | i18next}}</label>\n" +
    "            <start-time-picker start-time=\"currentEvent.session.timing.startTime\"></start-time-picker>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"duration\">{{'scheduling:service-details.duration' | i18next}}</label>\n" +
    "            <duration-picker duration=\"currentEvent.session.timing.duration\"></duration-picker>\n" +
    "        </div>\n" +
    "    \n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"services\">{{'scheduling:service-name' | i18next}}</label>\n" +
    "            <select-arrows></select-arrows>\n" +
    "            <select class=\"services\" name=\"services\" ng-change=\"changeServiceName()\" ng-model=\"currentEvent.session.service.id\" required>\n" +
    "                <option ng-repeat=\"service in serviceList\" value=\"{{service.id}}\">{{service.name}}</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"locations\">{{'scheduling:location' | i18next}}</label>\n" +
    "            <select-arrows></select-arrows>\n" +
    "            <select class=\"locations\" name=\"locations\" ng-change=\"changeLocationName()\"  ng-model=\"currentEvent.session.location.id\" required>\n" +
    "                <option ng-repeat=\"location in locationList\" value=\"{{location.id}}\">{{location.name}}</option>\n" +
    "            </select>\n" +
    "\n" +
    "            <div class=\"error-messages locations\" ng-messages=\"currentSessionForm.locations.$error\" ng-if=\"currentSessionForm.locations.$touched\">\n" +
    "                <div class=\"required\" ng-message=\"required\">{{'scheduling:error.location-required' | i18next}}</div>\n" +
    "            </div>\n" +
    "            <div class=\"prompt-messages\" ng-messages=\"currentSessionForm.locations.$error\" ng-if=\"currentSessionForm.locations.$untouched\">\n" +
    "                <div ng-message=\"required\">{{'scheduling:prompt.location' | i18next}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"coaches\">{{'scheduling:coach' | i18next}}</label>\n" +
    "            <select-arrows></select-arrows>\n" +
    "            <select class=\"coaches\" name=\"coaches\" ng-model=\"currentEvent.session.coach.id\" required>\n" +
    "                <option ng-repeat=\"coach in coachList\" value=\"{{coach.id}}\">{{coach.name}}</option>\n" +
    "            </select>\n" +
    "            <div class=\"error-messages coaches\" ng-messages=\"currentSessionForm.coaches.$error\" ng-if=\"currentSessionForm.coaches.$touched\">\n" +
    "                <div class=\"required\" ng-message=\"required\">{{'scheduling:error.coach-required' | i18next}}</div>\n" +
    "            </div>\n" +
    "            <div class=\"prompt-messages\" ng-messages=\"currentSessionForm.coaches.$error\" ng-if=\"currentSessionForm.coaches.$untouched\">\n" +
    "                <div ng-message=\"required\">{{'scheduling:prompt.coach' | i18next}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"studentCapacity\">{{'businessSetup:service-details.student-capacity' | i18next}}</label>\n" +
    "            <input name=\"studentCapacity\" type=\"number\" ng-model=\"currentEvent.session.booking.studentCapacity\" placeholder=\"{{'businessSetup:service-details.placeholder.student-capacity' | i18next}}\"  ng-min=\"1\"  ng-max=\"100\" />\n" +
    "\n" +
    "            <div class=\"error-messages\" ng-messages=\"currentSessionForm.studentCapacity.$error\" ng-if=\"currentSessionForm.studentCapacity.$touched\">\n" +
    "                <div ng-message=\"max\">{{'businessSetup:error.max-capacity' | i18next}}</div>\n" +
    "                <div ng-message=\"min\">{{'businessSetup:error.min-capacity' | i18next}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"isOnlineBookable\">{{'businessSetup:service-details.is-online-bookable' | i18next}}</label>\n" +
    "            <select-arrows></select-arrows>\n" +
    "            <select class=\"online-bookable\" name=\"isOnlineBookable\"\n" +
    "                ng-model=\"currentEvent.session.booking.isOnlineBookable\"\n" +
    "                ng-options=\"opt.value as (opt.text |i18next) for opt in [{text:'yes', value: true},{text:'no', value: false}]\">\n" +
    "            </select>\n" +
    "        </div>\n" +
    "\n" +
    "        <repeat-selector\n" +
    "            ng-show=\"currentEvent.tempEventId\"\n" +
    "            repeat-frequency=\"currentEvent.session.repetition.repeatFrequency\"\n" +
    "            session-count=\"currentEvent.session.repetition.sessionCount\"\n" +
    "        ></repeat-selector>\n" +
    "\n" +
    "        <div class=\"session-price form-input\">\n" +
    "            <label name=\"sessionPrice\">{{'scheduling:service-details.session-price' | i18next}}</label>\n" +
    "            <span class=\"money-sign\" ng-i18next=\"denominations.{{currentUser.business.currency}}\"></span>\n" +
    "            <input name=\"sessionPrice\" type=\"number\" ng-model=\"currentEvent.session.pricing.sessionPrice\" placeholder=\"{{'scheduling:service-details.placeholder.session-price' | i18next}}\"  min=\"0\" step=\"1.00\"  ng-required=\"requireSessionPrice()\"/>\n" +
    "\n" +
    "            <div class=\"error-messages price\" ng-messages=\"currentSessionForm.sessionPrice.$error\" ng-show=\"currentSessionForm.sessionPrice.$touched\">\n" +
    "                <div class=\"required\" ng-message=\"required\"><span ng-i18next=\"[html]{{currentEvent.course.sessions || currentEvent.session.repetition.sessionCount > 1 ? 'scheduling:error.price-required' : 'scheduling:error.session-price-required'}}\"></span></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"course-price form-input\" ng-show=\"currentEvent.session.repetition.sessionCount > 1 || currentEvent.course.sessions\" >\n" +
    "            <label name=\"coursePrice\">{{'scheduling:service-details.course-price' | i18next}}</label>\n" +
    "            <span class=\"money-sign\" ng-i18next=\"denominations.{{currentUser.business.currency}}\"></span>\n" +
    "            <input name=\"coursePrice\" type=\"number\" ng-model=\"currentEvent.course.pricing.coursePrice\" placeholder=\"{{'scheduling:service-details.placeholder.course-price' | i18next}}\"  min=\"0\" step=\"1.00\" ng-required=\"requireCoursePrice()\"/>\n" +
    "\n" +
    "            <div class=\"error-messages price\" ng-messages=\"currentSessionForm.coursePrice.$error\" ng-show=\"currentSessionForm.coursePrice.$touched\">\n" +
    "                <div class=\"required\" ng-message=\"required\">{{'scheduling:error.price-required' | i18next}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"edit-button-container\">\n" +
    "    <button class=\"delete-button delete-session\" ng-click=\"deleteSession()\" ng-hide=\"currentEvent.tempEventId\">\n" +
    "        <i class=\"fa fa-trash-o\"></i>\n" +
    "    </button>\n" +
    "    <button class=\"save-button\" ng-click=\"saveModalEdit()\" ng-disabled=\"calendarLoading\"><span ng-i18next>{{calendarLoading ? 'saving' : (saved ? 'saved':'save-details') }}</span><ellipsis-animated ng-show=\"calendarLoading\"/></button>\n" +
    "    <button class=\"cancel-button\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelModalEdit()\">{{'cancel' | i18next}}</button>\n" +
    "</div>"
  );


  $templateCache.put('scheduling/partials/schedulingServicesList.html',
    "<span\n" +
    "    class=\"toggle-service-drawer\"\n" +
    "    ng-click=\"toggleOpen = !toggleOpen\" ng-show=\"isBigScreen\">\n" +
    "        <i class=\"fa\" ng-show=\"isBigScreen\" ng-class=\"toggleOpen ? 'fa-left-single-arrow' : 'fa-right-single-arrow' \"></i>\n" +
    " </span>\n" +
    "\n" +
    "<h4 ui-sref=\"businessSetup.services\">{{'scheduling:services-title' | i18next}}</h4>\n" +
    "<div class=\"services-list\" ng-disabled=\"showModal\">\n" +
    "    <div class=\"no-services-message\" ng-show=\"serviceList.length === 0\">\n" +
    "        <div class=\"no-services-start\">{{'scheduling:no-services.start' | i18next}}</div>\n" +
    "        <div class=\"no-services-middle\">{{'scheduling:no-services.middle' | i18next}}</div>\n" +
    "        <div class=\"no-services-end\">{{'scheduling:no-services.end' | i18next}}</div>\n" +
    "    </div>\n" +
    "    <button class=\"create-item\" ui-sref=\"businessSetup.services.newItem\">\n" +
    "        <i class=\"fa fa-plus\"></i>\n" +
    "        {{'businessSetup:add-service' | i18next}}\n" +
    "    </button>\n" +
    "\n" +
    "    <ul ng-class=\"toggleOpen ? 'services-list-show' : 'services-list-hide' \">\n" +
    "        <li \n" +
    "            data-drag=\"true\"\n" +
    "            data-service=\"{{item}}\" \n" +
    "            data-duration=\"{{minutesToStr(item.timing.duration)}}\"\n" +
    "            jqyoui-draggable=\"{onStart: 'toggleDrag', onStop: 'toggleDrag'}\"\n" +
    "            data-jqyoui-options=\"draggableOptions\" \n" +
    "            class=\"service-details\" \n" +
    "            ng-repeat=\"item in serviceList | orderBy:'name'\">\n" +
    "                <i class=\"fa fa-bars\"></i>\n" +
    "                <span class=\"colour-circle {{item.presentation.colour}}\"></span>\n" +
    "                <div class=\"service-text\">\n" +
    "                    <h5 class=\"service-name\">{{item.name}}</h5>\n" +
    "                    <div class=\"service-description\" ng-if=\"item.description\">{{item.description}}</div>\n" +
    "                </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>"
  );


  $templateCache.put('scheduling/partials/schedulingView.html',
    "<div ng-class=\"{'calendar-fix': showModal}\">\n" +
    "    <div class=\"services-list-container\" ng-init=\"toggleOpen = isBigScreen\" ng-class=\"{closed: !toggleOpen}\">\n" +
    "        <scheduling-services-list></scheduling-services-list>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"page-loading\" ng-show=\"calendarLoading\">\n" +
    "        <div class=\"indicator-container\">\n" +
    "            <div class='outer-logo'></div>\n" +
    "            <div ng-class=\"{active: calendarLoading}\" class='inner-logo'></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"calendar-container calendar-container-desktop\" ng-class=\"{'toggle-closed': !toggleOpen }\">\n" +
    "        <div class=\"dropdown-container\" ng-class=\"isBigScreen? 'coach-list' : 'coach-list-responsive' \" ng-disabled=\"showModal\">\n" +
    "            <select ng-init=\"currentCoachId=''\" ng-change=\"filterSessions()\" name=\"coaches\" ng-model=\"currentCoachId\">\n" +
    "                <option value=\"\">{{'scheduling:all-coaches' | i18next}}</option>\n" +
    "                <option ng-repeat=\"coach in coachList\" value=\"{{coach.id}}\">{{coach.name}}</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div class=\"dropdown-container\" ng-class=\"isBigScreen? 'location-list' :'location-list-responsive' \" ng-disabled=\"showModal\">\n" +
    "            <select ng-init=\"currentLocationId=''\" ng-change=\"filterSessions()\" name=\"locations\" ng-model=\"currentLocationId\">\n" +
    "                <option value=\"\">{{'scheduling:all-locations' | i18next}}</option>\n" +
    "                <option ng-repeat=\"location in locationList\" value=\"{{location.id}}\">{{location.name}}</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div class=\"coach-title\" ng-show=\"isBigScreen\">{{getCurrentCoach() || 'All Coaches'}}</div>\n" +
    "        <div class=\"calendar\" id=\"session-calendar\" ui-calendar=\"uiConfig.calendar\" ng-model=\"eventSources\" calendar=\"sessionCalendar\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"session-modal session-modal-responsive\" ng-show=\"showModal\">\n" +
    "        <div class=\"session-header\" ng-class='currentEvent.session.presentation.colour'>\n" +
    "            <p class=\"date\">{{currentEvent._start | amDateFormat:'dddd, MMMM Do YYYY'}}</p>\n" +
    "            <p class=\"time\">{{currentEvent._start | amDateFormat:'h:mm a'}}</p>\n" +
    "        </div>\n" +
    "        <div class=\"session-modal-nav\" ng-init=\"currentTab = 'general'\">\n" +
    "            <div class=\"general\" ng-class=\"{active: currentTab === 'general'}\" ng-click=\"currentTab = 'general'\">{{'scheduling:general' | i18next}}</div>\n" +
    "            <div class=\"attendance\" ng-disabled=\"currentEvent.tempEventId\" ng-class=\"{active: currentTab === 'attendance'}\" ng-click=\"currentTab = 'attendance'\">{{'scheduling:attendance' | i18next}}</div>\n" +
    "        </div>\n" +
    "        <hr class=\"double-wide\"/>\n" +
    "            \n" +
    "        <modal-session-form ng-show=\"currentTab === 'general'\"></modal-session-form>\n" +
    "\n" +
    "        <modal-session-attendance-list ng-show=\"currentTab === 'attendance'\"></modal-session-attendance-list> \n" +
    "\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('scheduling/partials/sessionOrCourseModal.html',
    "<div class=\"alert-container\">\n" +
    "    <span class=\"fa fa-close\" ng-click=\"$dismiss()\"></span>\n" +
    "    <p class=\"session-or-course-text\">{{'scheduling:session-or-course' | i18next}}</p>\n" +
    "    <div class=\"button-container\">\n" +
    "        <button class=\"session-button\" ng-click=\"$close(currentEvent.session.id)\">{{'scheduling:this-session' | i18next}}</button>\n" +
    "        <button class=\"course-button\" ng-click=\"$close(currentEvent.course.id)\">{{'scheduling:entire-course' | i18next}}</button>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('scheduling/partials/startTimePicker.html',
    "<input type=\"text\" ng-click=\"editTime()\" ng-model='startTime' class=\"time-picker-time\" ng-readonly=\"true\">\n" +
    "<div class=\"time-picker-container\" ng-show=\"editingTime\">\n" +
    "    <time-picker time=\"startTime\"></time-picker>\n" +
    "</div>"
  );

}]);
