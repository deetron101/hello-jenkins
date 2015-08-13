(function ($) {

  $(document).ready(function(){

    var imgFiles;

    $("#uploadImage").change(function () {
      imgFiles = this.files;
      if (imgFiles && imgFiles[0]) {
        var reader = new FileReader();
        reader.onload = imageIsLoaded;
        reader.readAsDataURL(imgFiles[0]);
      }
    });

    function imageIsLoaded(e) {
      $('#myImg').attr('src', e.target.result);
    };

    $("#submitImage").click(function(){
      var formData = new FormData();
      formData.append('files', imgFiles[0]);
      $.ajax({
        url: '/api/upload',
        type: 'post',
        processData: false, // important
        contentType: false, // important
        data: formData
      });
    });

  });



})(window.$ || window.jQuery);




