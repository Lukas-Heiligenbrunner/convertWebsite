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
    console.log(JSON.parse(data));
    var startdata = JSON.parse(data);

    totaltimeofcurr = timetoseconds(startdata.currentprogress.duration);

    totaltime=0;
    console.log(startdata.allfiles.length);
    for(var i=0;i<startdata.allfiles.length;i++) {
      totaltime+=timetoseconds(startdata.allfiles[i].duration);
      console.log("forloop"+timetoseconds(startdata.allfiles[i].duration));
    }
    console.log(totaltime);

    finishedtime=0;
    for(var i=0;i<startdata.finishedfiles.length;i++) {
      finishedtime+=timetoseconds(startdata.finishedfiles[i].duration);
    }
    console.log(finishedtime);

    var currname = startdata.currentprogress.filename;
    $('#currfile')[0].innerHTML="now converting: "+currname;

  },'text');

}

var lastpercent=0;
  function reloadinfo() {
    $.post('php/convertactions.php','action=reloadinfo',function(data){

      var index = data.indexOf("time=");

      if(index != -1)
      {
      currenttime = timetoseconds(data.slice(index+5, index+16));
      percent = currenttime/totaltimeofcurr*100;
      percent*=100;
      percent=Math.round(percent);
      percent/=100;

      if(lastpercent > percent)
      {
        getstartinfo();
      }
      lastpercent=percent;

      percenttot = (currenttime+finishedtime)/totaltime*100;
      percenttot*=100;
      percenttot=Math.round(percenttot);
      percenttot/=100;


    }else {
        //percent = 100;
        //percenttot = 100;
    }

    $("#progbar")[0].innerHTML = percent+"%";
    $("#progbar")[0].style.width = percent+"%";

    $("#totalprogbar")[0].innerHTML = percenttot+"%";
    $("#totalprogbar")[0].style.width = percenttot+"%";
    },'text');
  }

  $('#btnshowvids').click(function() {
    $.post('php/convertactions.php','action=showvids',function(data){
      $('.outputcontainer')[0].innerHTML = data;
    },'text');
  });

  $('#btnstartconv').click(function() {
    $.post('php/convertactions.php','action=startconv',function(data){
      console.log(data);
    },'text');
    getstartinfo();
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


  function timetoseconds(mytime) {
    var arr = mytime.split(':');
    var hourssecs = Number(arr[0])*3600;
    var minutessecs = Number(arr[1])*60;
    var seconds = Number(arr[2]);
    var allsecs = hourssecs+minutessecs+seconds;
    return allsecs;
  }

});
