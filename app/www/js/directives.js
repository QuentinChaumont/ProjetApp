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
  })

  .directive('autoComplete', function($timeout) {
    return function (scope, iElement, iAttrs) {
      iElement.autocomplete({
        source: scope[iAttrs.uiItems],
        select: function () {
          $timeout(function () {
            iElement.trigger('input');
          }, 0);
        }
      });
    }
  })

  .directive('cardAutocomplete', ['$http', function($http) {
    return {
      restrict: 'A',
      link: function(scope, elem, attr) {

        function filterCard(array, term) {
          var matcher = new RegExp('(' + $.ui.autocomplete.escapeRegex(term) + ')', 'gi');
          return $.grep(array, function (item) {
            return matcher.test(item.name);
          });
        }

        function highlightCard(text, term) {
          var matcher = new RegExp('(' + $.ui.autocomplete.escapeRegex(term) + ')', 'gi');
          return text.replace(matcher, '<strong>$1</strong>');
        }

        // elem is a jquery lite object if jquery is not present, but with jquery and jquery ui, it will be a full jquery object.
        elem.autocomplete({
          source:
            [
              { 'name' : 'Skylasher' },
        { 'name' : 'Thrashing Mossdog' },
        { 'name' : 'Zhur-Taa Druid' },
        { 'name' : 'Feral Animist' },
        { 'name' : 'Rubblebelt Maaka' },
        { 'name' : 'Mending Touch' },
        { 'name' : 'Weapon Surge' },
        { 'name' : 'Woodlot Crawler' },
        { 'name' : 'Phytoburst' },
        { 'name' : 'Smelt-Ward Gatekeepers' },
        { 'name' : 'Debt to the Deathless' },
        { 'name' : 'Woodlot Crawler' },
        { 'name' : 'Blaze Commando' },
        { 'name' : 'Uncovered Clues' }
        ]
            /*function(request, response) {
            // exemple appel rest pour filtrer les résultats
            /*$http.get("/magicsupremacy/rest/api/1/card/search?name=" + this.term).success(function(data) {
             response(data.cardslist);
             });

            response(filterCard(scope.cardslist, this.term));
          }*/
        ,
          focus: function(event, ui) {
            // on ne fait rien au survol de la souris sur les choix de la liste proposée
            return false;
          },
          select: function(event, ui) {
            // lors de la sélection d'un choix dans la liste, on affiche le libellé de la carte et on déclenche la recherche
            scope.card = ui.item.label;
            scope.$apply();
            return false;
          },
          appendTo : attr.appendTo

        }).data("ui-autocomplete")._renderItem = function(ul, item) {
          // set du label pour récupération dans la méthode select
          item.label = item.name;
          // nom de carte highlighted
          var cardNameHighlighted = highlightCard(item.name, this.term);

          // construction de l'affichage d'une ligne
          var cardLine = $("<div>").html(cardNameHighlighted);
          // sortie pour jquery-ui
          return $("<li>").append("<a>" + $("<div>").append(cardLine).html() + "</a>").appendTo(ul);
        };
      }
    }
  }]);
