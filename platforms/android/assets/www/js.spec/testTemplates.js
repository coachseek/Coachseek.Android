angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('index.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head>\n" +
    "    <meta charset=\"utf-8\" />\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\">\n" +
    "    <title>Coachseek</title>\n" +
    "    <link rel=\"shortcut icon\" href=\"assets/pics/favicon.png\">\n" +
    "    <link rel=\"stylesheet\" href=\"css/style.css\">\n" +
    "    <script src=\"//static.intercomcdn.com/intercom.v1.js\"></script>\n" +
    "    <script src=\"js/libs.js\"></script>\n" +
    "    <script src=\"js/scripts.js\"></script>\n" +
    "    <script src=\"js/templates.js\"></script>\n" +
    "</head>\n" +
    "<body ng-app=\"app\" ng-controller=\"appCtrl\" ng-strict-di ng-class=\"{'with-navbar': currentUser}\">\n" +
    "    <div id=\"wrapper\" ng-class=\"!isCollapsed?'toggled': ''\">\n" +
    "        <div class=\"navbar navbar-inverse navbar-fixed-top\" ng-show=\"currentUser\">\n" +
    "            <div class=\"container-fluid\">\n" +
    "                <div class=\"navbar-header\">\n" +
    "                    <button class=\"navbar-toggle pull-left\" type=\"button\" ng-click=\"isCollapsed = !isCollapsed\">\n" +
    "                        <i class=\"fa fa-bars fa-2x\"></i>\n" +
    "                    </button>\n" +
    "                    <activity-indicator class=\"pull-right\"  ui-sref=\"scheduling\"></activity-indicator>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "           <!-- Sidebar -->\n" +
    "            <div ng-class=\"isBigScreen ? '' : 'sidebar-wrapper' \">\n" +
    "                <ul ng-class=\"isBigScreen? 'nav navbar-nav' : 'sidebar-nav' \"  ng-click=\"isCollapsed = !isCollapsed\">\n" +
    "                    <li class=\"toggle-icon\">\n" +
    "                        <a>\n" +
    "                            <i class=\"fa fa-bars fa-2x\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li><a ui-sref=\"scheduling\" ui-sref-active=\"active\">{{'scheduling' | i18next}}</a></li>\n" +
    "                    <li><a ui-sref=\"customers\" ui-sref-active=\"active\">{{'customers' | i18next}}</a></li>\n" +
    "                    <li><a ui-sref=\"businessSetup.business\" ng-class=\"{ active: $state.includes('businessSetup') }\">{{'settings' | i18next}}</a></li>\n" +
    "                    <li><a ui-sref=\"bookingAdmin\" ui-sref-active=\"active\">{{'booking' | i18next}}</a></li>\n" +
    "                    <li>\n" +
    "                    </li>\n" +
    "                    <li class=\"login-right\">\n" +
    "                        <a class=\"kb-link fa fa-question-circle\" ng-hide=\"!isBigScreen\" href=\"http://support.coachseek.com/\" target=\"_blank\"></a>\n" +
    "                        <a class=\"logout\" ng-click=\"currentUser ? logout() : login()\" ng-i18next>{{currentUser ? 'logout-text' : 'login-text'}}</a>\n" +
    "                    </li>\n" +
    "                 </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div id=\"page-content-wrapper\" ng-click=\"isCollapsed = true\">\n" +
    "            <div class=\"main-container\">\n" +
    "                <div ui-view id=\"main-view\" state=\"{{$state.current.name}}\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"alert-container\">\n" +
    "                <alert class=\"fade-in-out\" ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" dismiss-on-timeout=\"{{alert.dismissTimeout}}\" close=\"closeAlert($index)\" >\n" +
    "                    <span ng-i18next=\"[i18next]({alert:alert}){{alert.message}}\"></span>\n" +
    "                </alert>\n" +
    "            </div>\n" +
    "         </div>\n" +
    "    </div>\n" +
    "</body>\n" +
    "</html>\n"
  );

}]);
