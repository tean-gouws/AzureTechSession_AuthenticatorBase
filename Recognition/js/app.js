var recording = false;

$(document).ready(function () {
    $("#screenshot-video").hide(); 
function handleError(error) {
  console.error('navigator.getUserMedia error: ', error);
}
  var constraints = {video: true};
  var video = document.querySelector('#screenshot-video');
  var canvas = document.createElement('canvas');

  function handleSuccess(stream) {
    video.srcObject = stream;
  }

  navigator.mediaDevices.getUserMedia(constraints).
      then(handleSuccess).catch(handleError);

    function Identify(){
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.toBlob(function (blob) {
            $.ajax({
                url: "FUNCTION APP URL",
                cache: false,
                contentType: "image/png",
                processData: false,
                data: blob, 
                method: 'POST',
                success: function(data) {
                    if(data){
                        alert(data);
                    }else{
                        
                        alert("Face Identification Failed");
                    }
                    $('#recordButton').attr("src", "keyon.png");
                    $("#screenshot-video").hide(); 
                },
                error:function(){
                    $('#recordButton').attr("src", "keyon.png");
                    alert("Face Identification Error");
                    $("#screenshot-video").hide(); 
                }
            });
            
        });    
    }

    $('#recordButton').on('mousedown', function () {
        $(this).attr("src", "keyon.png");
        //Fr.voice.record();
        $("#screenshot-video").show(); 
        recording = true;
    });
    
    $('#recordButton').on('mouseup mouseleave', function () {
        if (recording == true) {
            $(this).attr("src", "doublering.gif");
            Identify();
            
            recording = false;
            //Fr.voice.export(upload, "blob");
            //restore();
        }
    });
});
