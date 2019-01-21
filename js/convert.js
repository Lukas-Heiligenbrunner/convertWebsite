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


    var arr = data.split(";");
    arr[0]=arr[0].substring(0,arr[0].length-2);
    totaltimeofcurr = timetoseconds(arr[0]);
    var totalarr = arr[1].split(",\n");
    totalarr.splice(-1);

    totaltime=0;
    for(var i=0;i<totalarr.length;i++) {
      totaltime+=timetoseconds(totalarr[i]);
    }

    var finished = arr[2].split(",\n");
    finished.splice(-1);
    //console.log(finished);

    finishedtime=0;
    for(var i=0;i<finished.length;i++) {
      finishedtime+=timetoseconds(finished[i]);
    }

    var currname = arr[3];
    currname=currname.substring(1,currname.length-3);
    $('#currfile')[0].innerHTML="now converting: "+currname;
    //console.log(currname);
//console.log(arr);
//console.log(totalarr);

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
        percent = 100;
        percenttot = 100;
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
