angular.module("ionic")

  .directive('syncFocusWith', function() {
    return function($scope, $element) {
      $scope.$watch("focusValue", function() {
        $element[0].focus();

      })
    }
  })

  .directive('test', function($timeout){
      return  function(scope, element, attrs) {
        $timeout(function() {
          element[0].focus();
        });
      }
    }
    //element.text($scope.message);
  )

  .directive('ionSearchBar', function($timeout) {
    return {
      restrict: 'EA',
      replace: true,
      scope: false,
      link: function(scope, element, attrs) {
        scope.placeholder = attrs.placeholder || '';
        scope.search = {value: '', focus: false};
        if (attrs.class) {
          element.addClass(attrs.class);
        }

        // We need the actual input field to detect focus and blur
        var inputElement = element.find('input')[0];

        // This function is triggered when the user presses the `Cancel` button
        scope.cancelSearch = function() {
          // Manually trigger blur
          inputElement.blur();
          scope.map_available = true;
          scope.search.value = '';
        };

        scope.clearSearch = function(){
          scope.search.value = '';
          $timeout(function () {
            document.getElementById('input_search').focus();
          }, 0);
        };

        scope.keyup = function(event_key){
          var keyCode = event_key.keyCode;
          // If enter key is pressed
          if (keyCode == 13) {
            inputElement.blur();
            scope.map_available = true;
            //event.preventDefault();
          }
          else if(keyCode == 27){
            scope.cancelSearch();
          }
          else{
            scope.map_available = false;
          }
        };

        // When the user focuses the search bar
        angular.element(inputElement).bind('focus', function () {
          // We store the focus status in the model to show/hide the Cancel button
          scope.search.focus = 1;
          // Add a class to indicate focus to the search bar and the content area
          element.addClass('search-bar-focused');
          angular.element(document.querySelector('.has-search-bar')).addClass('search-bar-focused');
          // We need to call `$digest()` because we manually changed the model
          //scope.$digest();
        });

        // When the user leaves the search bar
        angular.element(inputElement).bind('blur', function() {
          scope.search.focus = 0;
          element.removeClass('search-bar-focused');
          angular.element(document.querySelector('.has-search-bar')).removeClass('search-bar-focused');
        });

      },
      template: '<div class="search-bar bar bar-header item-input-inset">' +
      '<div class="item-input-wrapper">' +
      '<i class="icon ion-ios-search placeholder-icon"></i>' +
      '<input type="search" id="input_search" placeholder="" ng-model="search.value" ng-keydown="keyup($event)">' +
      '<button ng-click="clearSearch()" class="button ion-android-close input-button button-small" ng-show="search.value.length">' +
      '</button>' +
      '</div>' +
      '<button class="button button-clear button-positive" ng-show="search.focus" ng-click="cancelSearch()">' +
      'Cancel' +
      '</button>' +
      '</div>'
    };
  });
