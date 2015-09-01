var create = angular.module('CreateCtrl', []);

create.controller("CreateController", ['$state', function($state){

  var imgFiles;

  $("#uploadImage").change(function () {
    imgFiles = this.files;
    console.log(imgFiles);
    if (imgFiles && imgFiles[0]) {
      console.log('here1');
      //var reader = new FileReader();
      //reader.onload = imageIsLoaded;
      //reader.readAsDataURL(imgFiles[0]);

}  });

  function imageIsLoaded(e) {
    $('#myImg').attr('src', e.target.result);
  };

  var createCtrl = this;
  createCtrl.data = {};

}]);