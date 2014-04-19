var myApp = angular.module('myApp', ['infinite-scroll']);

myApp.controller('DemoController', function($scope, GitHub) {
  $scope.github = new GitHub();
});

// GitHub constructor function to encapsulate HTTP and pagination logic
myApp.factory('GitHub', function($http) {
  var GitHub = function() {
    this.items = [];
    this.busy = false;
    this.lastsha = '';
    this.meta = '';
  };

  GitHub.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    var url = "https://api.github.com/repos/musescore/MuseScore/commits?callback=JSON_CALLBACK&top=master";
    if (this.lastsha !== '')
      url += "&last_sha=" + this.lastsha;
    $http.jsonp(url).success(function(data) {
      var items = data.data;
      console.log(items);
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
      if (data.meta.status == 200) {
        this.lastsha = items[items.length - 1].sha;
      } else {
        this.lastsha = '';
      }
      this.meta = data.meta;
      this.busy = false;
    }.bind(this));
  };

  return GitHub;
});