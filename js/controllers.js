'use strict';

/* Controllers */

var xmlYmlConvertApp = angular.module('xmlYmlConvertApp', []);

xmlYmlConvertApp.controller('TextToConverCtrl', function($scope) {
	$scope.converted = "";
  $scope.use_flatten = false;
  $scope.ymlObject = {};
  $scope.domElementToConvert = {};
  $scope.method = 'multiple_level';

  $scope.convert = function() {
  	
  	$scope.domElementToConvert = jQuery(jQuery.parseXML($scope.toConvert));

  	$scope.ymlObject = {};

    if ($scope.method === 'multiple_level') {
  		$scope.convertMultipleLevel();
    }
    else {
      $scope.use_flatten = false;
      $scope.convertFlatten();
    }

		var yaml = jsyaml.dump($scope.ymlObject, {});
		
  	$scope.converted = yaml;
  };

  $scope.convertMultipleLevel = function() {
    $scope.use_flatten = false;

    $scope.domElementToConvert.find('trans-unit').each(function(){
      var id = jQuery(this).find('source').text();
      var value = jQuery(this).find('target').text();

      var idComponents = id.split('.');

      if (false === $scope.add($scope.ymlObject, idComponents, value)) {
        // If we are in multiple level, restart with flatten mode.
        $scope.convertFlatten();
        return false;
      }

    });
  }

  $scope.convertFlatten = function() {
    $scope.domElementToConvert.find('trans-unit').each(function(){
      var id = jQuery(this).find('source').text();
      var value = jQuery(this).find('target').text();

      $scope.ymlObject[id] = value;

    });
  }

  $scope.add = function(object, ids, value){
  	var id = ids.shift();
  	if (jQuery.isEmptyObject(ids)) {
	  	object[id] = object[id] || value;
      return true;
  	}

		object[id] = object[id] || {};
    // In XML, we can have a source key which is the start of another source key.
    // Ex: menu.organize and menu.organize.title.
    // This is not possible on Yaml, so notice it to user and do not take care of
    // the first source key.
    if (typeof object[id] !== 'object') {
      $scope.use_flatten = true;
      $scope.ymlObject = {};
      return false;
    }

		return $scope.add(object[id], ids, value);
  };

  $scope.reset = function() {
    $scope.toConvert = '';
    $scope.converted = '';
    $scope.ymlObject = {};
    $scope.domElementToConvert = {};
  }
});
