var app = angular.module("WikiApp", ["ngRoute", "ngResource"]);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/', {
        templateUrl: '/templates/index.html',
        controller: "FrontController",
        controllerAs: 'ctrl',
        title: 'homepage'
    }).
    when('/search', {
        templateUrl: 'templates/index.html',
        controller: "SearchController",
        controllerAs: 'ctrl',
        title: 'Recherche'
    }).
    when('/page/new', {
        templateUrl: 'templates/page/new_page.html',
        controller: "NewController",
        controllerAs: 'ctrl',
        title: 'Nouvel page'
    }).
    when('/page/:slug', {
        templateUrl: 'templates/page/page.html',
        controller: "PageController",
        controllerAs: 'ctrl',
        title: 'Page précise'
    }).
    when('/page/:slug/edit', {
        templateUrl: 'templates/page/edit.html',
        controller: "EditController",
        controllerAs: 'ctrl',
        title: 'Modifié page'
    }).
    when('/page/:slug/history', {
        templateUrl: 'templates/page/history.html',
        controller: "HistoryController",
        controllerAs: 'ctrl',
        title: 'Historique page'
    }).
    when('/page/:slug/history/:id', {
        templateUrl: 'templates/page/revision.html',
        controller: "RevisionController",
        controllerAs: 'ctrl',
        title: 'Revision page'
    }).
    when('/inscription', {
        templateUrl: 'templates/page/inscription.html',
        controller: "InscriptionController",
        controllerAs: 'ctrl',
        title: 'Inscription'
    })
}]);

app.run(['$rootScope', '$route', function($rootScope, $route) {
    $rootScope.$route = $route;
    $rootScope.$on('$routeChangeSuccess', function() {
        // Si on veux faire des trucs au changement de page
    });
}]);

// DIRECTIVE

app.directive('header', ['$http', '$window', function($http, $window){
    return {
        restrict: 'EA',
        link: function(scope, element, attrs) {

        },
        templateUrl: '/templates/bases/header.html',
        controller: function($scope, $http, user) {
            var ctrl = this;
            $scope.user = user;
            $scope.$watch(function(){return user;}, function(value, oldValue){
                if(oldValue !== value){
                    ctrl.id = value.id;
                    ctrl.username = value.username;
                    if(value.username === '' || typeof value.username === 'undefined'){
                        ctrl.online = 0;
                    }else{
                        ctrl.online = 1;
                    }
                }
            }, true);

            ctrl.connexion = function(mail, password){
                // Reset erreur
                ctrl.showerror = 0;
                ctrl.wrongmail = 0;
                ctrl.nopass = 0;
                ctrl.error = 0;

                if(!mail.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)) {
                    ctrl.wrongmail = 1;
                    ctrl.error = 1;
                }

                if(!password || password === ''){
                    ctrl.nopass = 1;
                    ctrl.error = 1;
                }

                if(!ctrl.error){
                    var data = {
                        "email" : mail,
                        "password" : password
                    };
                    var myJSON = JSON.stringify(data);

                    $http.post('/api/v1/user/login', myJSON).then(
                        function(success){
                            ctrl.mail = '';
                            ctrl.password = '';
                            $scope.user.id = success.data.id;
                            $scope.user.username = success.data.username;
                        },
                        function(error){
                            console.log(error);
                        }
                    )
                }
            };

            ctrl.deconnexion = function(){
                $scope.user.id = undefined;
                $scope.user.username = '';
            };
        },
        controllerAs: 'ctrl'
    }
}]);

app.directive('footer', ['$http', function($http){
    return {
        restrict: 'EA',
        templateUrl: '/templates/bases/footer.html'
    }
}]);

app.directive('titre', ['$http', function($http){
    return {
        restrict: 'EA',
        templateUrl: '/templates/bases/title.html'
    }
}]);

// END DIRECTIVE

app.factory("user",function(){
    return {};
});