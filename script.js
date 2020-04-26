let title = null;
let vurl = null;
let aurl = null;
let vurls = [];
let aurls = [];
let aformat = null;
let vformat = null;
let aformats = [];
let vformats = [];
let etitle = null;
let size = null;

$(document).ready(function () {
  $("#audioSelect, #videoSelect, #start").hide();
  $("#urlSubmit").click(function () {
    $("#tite").hide(200);
    $("#audioSelect, #videoSelect, #start").hide(200);
    $("#download").hide(200);
    let url = $("#urlInput").val();
    if (url != "") {
      let res = { url: url };
      $(".loading").show(200);
      $.post("https://youtubedl-backend.herokuapp.com/urlstart", res, function (data) {
        title = data.name;
        etitle = encodeURIComponent(title);
        etitle = escape(etitle);
        vurls = [...data.vurls];
        aurls = [...data.aurls];
        vformats = [...data.vformats];
        aformats = [...data.aformats];
        console.log(data);
        $(".loading").hide(200);
        $("#title").html(title);
        $("#title").show(200);
        selectionMaker(data.vcodecs, data.acodecs);
        $("#audioSelect, #videoSelect, #start").show(300);
      });
    }
  });
  $("#start").click(function (e) {
    $("#audioSelect, #videoSelect, #start").hide(200, function () {
      $(".loading").show(200);
    });
    if ($("#videoSelect").val() != "0") {
      vurl = vurls[Number($("#videoSelect").val()) - 1];
      aurl = aurls[Number($("#audioSelect").val()) - 1];
      vformat = vformats[Number($("#videoSelect").val()) - 1];
      aformat = aformats[Number($("#audioSelect").val()) - 1];
      console.log(aformat);
      let res = { aurl: aurl, vurl: vurl, vformat: vformat, aformat: aformat };
      console.log(res);
      $.post("https://youtubedl-backend.herokuapp.com/video", res, function (data) {
        console.log(data);
        checkStatus();
      });
    }
  });
});

function selectionMaker(vcodecs, acodecs) {
  $("#audioSelect").html('<option selected value="0">Select Audio</option>');
  $("#videoSelect").html('<option selected value="0">Select Video</option>');

  for (i = 0; i < vcodecs.length; i++) {
    $("#videoSelect").append(
      `<option value=` + (i + 1) + `>` + vcodecs[i] + `</option>`
    );
  }
  for (i = 0; i < acodecs.length; i++) {
    $("#audioSelect").append(
      `<option value=` + (i + 1) + `>` + acodecs[i] + `</option>`
    );
  }
}

function checkStatus() {
  let interval = setInterval(function () {
    $.post("https://youtubedl-backend.herokuapp.com/check", function (data) {
      console.log(data);
      if (data == true) {
        clearInterval(interval);
        $(".loading").hide(200);
        $("#download").show(200);
        $("#download")
          .parent()
          .attr(
            "href",
            "https://youtubedl-backend.herokuapp.com/download/" + etitle + ".mkv"
          );
      } else if (data == "error") {
        clearInterval(interval);
        alert("Error ! Please try again");
        $("#audioSelect, #videoSelect, #start").show(300);
      }
    });
  }, 2000);
}
