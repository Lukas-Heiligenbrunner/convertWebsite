$(document).ready(function() {

  var totaltimeofcurr;
  var totaltime=0;
  var finishedtime = 0;
  var currenttime;

  var temp = 0;

  var percent;
  var percenttot;


  setInterval(reloadinfo, 500);
  getstartinfo();

function getstartinfo() {

  $.post('php/convertactions.php','action=startinfo',function(data){
    var startdata = JSON.parse(data);
    console.log(startdata);

    totaltimeofcurr = timetoseconds(startdata.currentprogress.duration);

    totaltime=0;
    $('.convertionprogressnames')[0].innerHTML = "";
    for(var i=0;i<startdata.allfiles.length;i++) {
      totaltime+=timetoseconds(startdata.allfiles[i].duration);

      if ((JSON.stringify(startdata.finishedfiles)).includes(JSON.stringify(startdata.allfiles[i]))) {
        $('.convertionprogressnames')[0].innerHTML += "<div>"+"✅  "+startdata.finishedfiles[i].filename+"</div>";
      }else {
        $('.convertionprogressnames')[0].innerHTML += "<div>"+"🗷   "+startdata.allfiles[i].filename+"</div>";
      }
    }

    finishedtime=0;
    for(var i=0;i<startdata.finishedfiles.length;i++) {
      finishedtime+=timetoseconds(startdata.finishedfiles[i].duration);
    }

  },'text');

}

var lastpercent=0;
  function reloadinfo() {
    $.post('php/convertactions.php','action=reloadinfo',function(data){
      var reloaddata = JSON.parse(data);

      if (reloaddata.finishedall) {
        $('#currfile')[0].innerHTML="convertion finished";

      }else if (reloaddata.finishedcurr) {
        $('#currfile')[0].innerHTML="starting new file to convert";
      }else {
        $('#currfile')[0].innerHTML="active converting: "+ reloaddata.filename;

        percent=0;
        currenttime = timetoseconds(reloaddata.duration);
        percent = currenttime/totaltimeofcurr*100;
        percent=Math.round(percent*100)/100;

        if(lastpercent > percent)
        {
          getstartinfo();
        }
        lastpercent=percent;

        percenttot = (currenttime+finishedtime)/totaltime*100;
        percenttot=Math.round(percenttot*100)/100;

        $("#progbar")[0].innerHTML = percent+"%";
        $("#progbar")[0].style.width = percent+"%";

        $("#totalprogbar")[0].innerHTML = percenttot+"%";
        $("#totalprogbar")[0].style.width = percenttot+"%";
      }
    },'text');
  }

  $('#btnshowvids').click(function() {
    $.post('php/convertactions.php','action=startinfo',function(data){
      var startdata = JSON.parse(data);
      for (var i in startdata.allfiles) {
        $('.outputcontainer')[0].innerHTML += "<br>Filename: "+startdata.allfiles[i].filename+" | Filesize: "+startdata.allfiles[i].size+" Bytes | Duration:"+startdata.allfiles[i].duration+"</td></tr>";
      }

    },'text');
  });

  $('#btnstartconv').click(function() {
    $.post('php/convertactions.php','action=startconv',function(data){
      console.log(data);
      lastpercent=0;
      startinfoafterstart();
    },'text');
  });

  $('#btnstopconv').click(function() {
    $.post('php/convertactions.php','action=stopconv',function(data){
      console.log(data);
    },'text');
  });

  $('#btnshutdown').click(function() {
    $.post('php/convertactions.php','action=shutdown',function(data){
      console.log(data);
    },'text');
  });

  async function startinfoafterstart() {
    console.log('waiting 2 secs until getting data');
    await sleep(2000);
    getstartinfo();
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  function timetoseconds(mytime) {
    var arr = mytime.split(':');
    var hourssecs = Number(arr[0])*3600;
    var minutessecs = Number(arr[1])*60;
    var seconds = Number(arr[2]);
    var allsecs = hourssecs+minutessecs+seconds;
    return allsecs;
  }

});
