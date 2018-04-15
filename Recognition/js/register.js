var recording = false;

$(document).ready(function () {

function handleError(error) {
  console.error('navigator.getUserMedia error: ', error);
}

$.fn.serializeFormJSON = function () {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var constraints = {video: true};

(function() {
    var video = document.querySelector('#screenshot-video');
    var canvas = document.createElement('canvas');

    function RegisterAgent(firstname,surname,codename,department,email){
        canvas.toBlob(function (blob) {
            $.ajax({
                url: "REGISTRATION LOGIC APP URL",
                cache: false,
                contentType: "image/png",
                processData: false,
                headers: {
                    "x-ms-meta-userdata": JSON.stringify($("#agentdetails").serializeFormJSON()),
                },
                data: blob, 
                method: 'POST',
                success: function(data) {
                    if(data)
                    {
                        $("#userid").val(data);
                    } else {
                        $('#capture1').prop("src","");
                        alert("Registration Failed, please try again");
                    }
                    $('#capturePhoto').show();
                },
                error:function(){
                    $('#capture1').prop("src","");
                    alert("Registration Failed, please try again");
                    $('#capturePhoto').show();
                }
            });
            $('#capturePhoto').hide();
        });    
    }

    function AddAgentFace(image){
        canvas.toBlob(function (blob) {
            $.ajax({
                url: "FACE TRAINING LOGIC APP URL",
                cache: false,
                contentType: "image/png",
                processData: false,
                headers: {
                    "x-ms-meta-userid": $("#userid").val()
                },
                data: blob, 
                method: 'POST',
                success: function(data) {
                    if(data){

                    }else{
                        $(image).removeAttr("src");
                    }
                    $('#capturePhoto').show();
                },
                error:function(){
                    $(image).removeAttr("src");
                    $('#capturePhoto').show();
                }
            });
            $('#capturePhoto').hide();
        });    
    }

    $('#capturePhoto').click(function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        if(!($("#capture1").attr("src"))){
            var firstname = $("#firstname").val();
            var surname = $("#surname").val();
            var codename = $("#codename").val();
            var department = $("#department").val();
            var email = $("#email").val();
            if(firstname == "" || surname == "" || codename == "" || department == "" || email == "")
            {
                alert("Please make sure that all registration fields are populated");
            }
            else
            {    
                $('#capture1').attr("src", canvas.toDataURL('image/png'));
                RegisterAgent(firstname,surname,codename,department,email);
            }
        } 
        else if(!($("#capture2").attr("src"))){
            if($("#userid").val())
            {
                $('#capture2').attr("src", canvas.toDataURL('image/png'));
                AddAgentFace('#capture2');
            }
        } 
        else if(!($("#capture3").attr("src"))){
            if($("#userid").val())
            {
                $('#capture3').attr("src", canvas.toDataURL('image/png'));
                AddAgentFace('#capture3');
            }
        }
    });

  function handleSuccess(stream) {
    video.srcObject = stream;
  }

  navigator.mediaDevices.getUserMedia(constraints).
      then(handleSuccess).catch(handleError);
})();

    $(document).on("click",
        "#upload",
        function() {
            var file_data = ""; 
	        $.ajax({
                url: "https://prod-11.westeurope.logic.azure.com:443/workflows/0ed54a4b48e944669cc4ca68e2079c1b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=iYy0GmUkv1UtcaEuPcNG3jhWpHISnwndMBpzPS89tjY",
                cache: false,
                contentType: "image/png",
                processData: false,
				headers:{"x-ms-meta-userid":"Tean Gouws"},
                data: file_data, // Setting the data attribute of ajax with file_data
                method : 'POST'
            });
        });


    function upload(blob) {
        var formData = new FormData();
        formData.append('file', blob);
        formData.append('id', $("#profileid").html());
        filename = "asdasd.wav";
        $.ajax({
            //    url: "../Home/Contact",
            url: "https://prod-11.westeurope.logic.azure.com:443/workflows/0ed54a4b48e944669cc4ca68e2079c1b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=iYy0GmUkv1UtcaEuPcNG3jhWpHISnwndMBpzPS89tjY&filename=" + filename,
            type: 'POST',
            data: blob,
            contentType: "audio/x-wav",
            processData: false,
            success: function (data) {
                //alert(data);
                $(this).attr("src", "keyoff.png");    
                //$("#attempt").html($("#attempt").html() + 1);

                //$("#profileid").html(data);
            },
            fail: function(data) {
                //alert(data);
                $(this).attr("src", "keyoff.png");
            }
        });
    }
    function upload2(blob) {
        var formData = new FormData();
        formData.append('file', blob);
        formData.append('id', $("#profileid").html());

        $.ajax({
            url: "../Home/Contact2",
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                $("#profileid").html(data);
            }
        });
    }

    $('#recordButton').on('mousedown', function () {
        recording = true;
        $(this).attr("src", "keyon.png");
        Fr.voice.record();
        $("#screenshot-video").show(); 
    }).on('mouseup mouseleave', function () {
        if (recording == true) {
            $(this).attr("src", "doublering.gif");
            $("#screenshot-video").hide(); 
            recording = false;
            Fr.voice.export(upload, "blob");
            restore();

        }
        });

    $('#identifyButton').on('mousedown', function () {
        recording = true;
        $(this).attr("src", "keyon.png");
        Fr.voice.record();
        $("#screenshot-video").show(); 
    }).on('mouseup mouseleave', function () {
        if (recording == true) {
            $(this).attr("src", "doublering.gif");
            $("#screenshot-video").hide(); 
            recording = false;
            Fr.voice.export(upload2, "blob");
            restore();

        }
    });
});


function restore() {
    $("#record, #live").removeClass("disabled");
    $("#pause").replaceWith('<a class="button one" id="pause">Pause</a>');
    $(".one").addClass("disabled");
    Fr.voice.stop();
}

function makeWaveform() {
    var analyser = Fr.voice.recorder.analyser;

    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    /**
     * The Waveform canvas
     */
    var WIDTH = 500,
        HEIGHT = 200;

    var canvasCtx = $("#level")[0].getContext("2d");
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
        var drawVisual = requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }
        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();
    };
    draw();
}

$(document).ready(function () {
    $(document).on("click", "#record:not(.disabled)", function () {
        Fr.voice.record($("#live").is(":checked"), function () {
            $(".recordButton").addClass("disabled");

            $("#live").addClass("disabled");
            $(".one").removeClass("disabled");

            makeWaveform();
        });
    });

    $(document).on("click", "#recordFor5:not(.disabled)", function () {
        Fr.voice.record($("#live").is(":checked"), function () {
            $(".recordButton").addClass("disabled");

            $("#live").addClass("disabled");
            $(".one").removeClass("disabled");

            makeWaveform();
        });

        Fr.voice.stopRecordingAfter(5000, function () {
            alert("Recording stopped after 5 seconds");
        });
    });

    $(document).on("click", "#pause:not(.disabled)", function () {
        if ($(this).hasClass("resume")) {
            Fr.voice.resume();
            $(this).replaceWith('<a class="button one" id="pause">Pause</a>');
        } else {
            Fr.voice.pause();
            $(this).replaceWith('<a class="button one resume" id="pause">Resume</a>');
        }
    });

    $(document).on("click", "#stop:not(.disabled)", function () {
        restore();
    });

    $(document).on("click", "#play:not(.disabled)", function () {
        if ($(this).parent().data("type") === "mp3") {
            Fr.voice.exportMP3(function (url) {
                $("#audio").attr("src", url);
                $("#audio")[0].play();
            }, "URL");
        } else {
            Fr.voice.export(function (url) {
                $("#audio").attr("src", url);
                $("#audio")[0].play();
            }, "URL");
        }
        restore();
    });

    $(document).on("click", "#download:not(.disabled)", function () {
        if ($(this).parent().data("type") === "mp3") {
            Fr.voice.exportMP3(function (url) {
                $("<a href='" + url + "' download='MyRecording.mp3'></a>")[0].click();
            }, "URL");
        } else {
            Fr.voice.export(function (url) {
                $("<a href='" + url + "' download='MyRecording.wav'></a>")[0].click();
            }, "URL");
        }
        restore();
    });

    $(document).on("click", "#base64:not(.disabled)", function () {
        if ($(this).parent().data("type") === "mp3") {
            Fr.voice.exportMP3(function (url) {
                console.log("Here is the base64 URL : " + url);
                alert("Check the web console for the URL");

                $("<a href='" + url + "' target='_blank'></a>")[0].click();
            }, "base64");
        } else {
            Fr.voice.export(function (url) {
                console.log("Here is the base64 URL : " + url);
                alert("Check the web console for the URL");

                $("<a href='" + url + "' target='_blank'></a>")[0].click();
            }, "base64");
        }
        restore();
    });

    $(document).on("click", "#save:not(.disabled)", function () {
        function upload(blob) {
            var formData = new FormData();
            formData.append('file', blob);
            formData.append('id', 'tean');

            $.ajax({
                url: "../Home/Contact",
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {


                }
            });
        }
        if ($(this).parent().data("type") === "mp3") {
            Fr.voice.exportMP3(upload, "blob");
        } else {
            Fr.voice.export(upload, "blob");
        }
        restore();
    });
});

