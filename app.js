angular.module('topGit', ['ngMaterial'])

  .factory('topGitSearchFactory', ['$http', function ($http) {
    return {
      getTopGithubRepos: function (stars, language, page) {
        var queryString = 'stars:%3E=' + stars + '+language:' + language
        return $http({
          method: 'GET',
          url: 'https://api.github.com/search/repositories?q=' + queryString,
          params: {page: page}
        })
      },

      getLanguages: function () {
        return $http({
          method: 'GET',
          url: 'https://gist.githubusercontent.com/mayurah/5a4d45d12615d52afc4d1c126e04c796/raw/ccbba9bb09312ae66cf85b037bafc670356cf2c9/languages.json'
        })
      }
    }
  }])

  .controller('topGitMainController', ['$scope', 'topGitSearchFactory','$filter', 
    function ($scope, topGitSearchFactory, $filter) {

      $scope.repos = []
      $scope.stars = 500

      $scope.languageSearch = function (query) {
        return topGitSearchFactory.getLanguages()
          .then (function (resp, status, header) {
            return $filter('filter')(resp.data, query)     
          })
      }

      $scope.$watch('searchLanguageItem', function (newVal, oldVal) {
        if(newVal != oldVal && newVal) {
          $scope.repos = []
          $scope.spinnerFlag = 1
          $scope.page = 1
          $scope.getRepos(1)
        }
      })

      $scope.$watch('stars', function (newVal, oldVal) {
        if(newVal != oldVal) {
          $scope.repos = []
          $scope.spinnerFlag = 1
          $scope.page = 1
          $scope.getRepos(1)
        }
      })

      $scope.getRepos = function (page) {
        topGitSearchFactory.getTopGithubRepos($scope.stars, $scope.searchLanguageItem, page)
          .then(function (resp) {
            $scope.spinnerFlag = 0
            $scope.reposHeader = resp.headers()
            $scope.totalCount = resp.data.total_count
            $scope.repos = resp.data.items
          })
      }

    }])