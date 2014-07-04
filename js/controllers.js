'use strict';

/* Controllers */

var xmlYmlConvertApp = angular.module('xmlYmlConvertApp', []);

xmlYmlConvertApp.controller('TextToConverCtrl', function($scope) {
	$scope.converted = "";
  $scope.convert = function(){
  	
  	var domElementToConvert = jQuery(jQuery.parseXML($scope.toConvert));

  	var ymlObject = {};

		domElementToConvert.find('trans-unit').each(function(){
			var id = jQuery(this).find('source').text();
			var value = jQuery(this).find('target').text();

			var idComponents = id.split('.');

			$scope.add(ymlObject, idComponents, value);

		});

		var yaml = jsyaml.dump(ymlObject, {});
		
  	$scope.converted = yaml;
  };
  $scope.add = function(object, ids, value){
  	var id = ids.shift();
  	if (jQuery.isEmptyObject(ids)) {
	  	object[id] = object[id] || value;
  	}
  	else {
  		object[id] = object[id] || {};
  		$scope.add(object[id], ids, value);
	  }
  };
});
