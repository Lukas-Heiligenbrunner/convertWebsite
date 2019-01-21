$(document).ready(function() {
  console.log("document loaded");

  //variables
  var selected;
  var percent=0;

  //function calls

  getPowerstate("/dev/sda");
  getPowerstate("/dev/sdb");
  getPowerstate("/dev/sdc");
  getPowerstate("/dev/sdd");
  getPowerstate("/dev/sde");

  getlsblk();

  getdf();

  getdiskusagediagram();

  //on click listener

  $.post('php/smartactions.php','action=getdisks',function(data){
    var disks = JSON.parse(data);
    console.log(disks);

  },'text');

  $(".driveselect").click(function() {
    select($(this)[0].innerHTML);
  });

  $("#btngethealth").click(function() {
    showloadingscreen();
    $.post( 'php/smartactions.php', "action=gethealth&device="+selected, function(data) {
          //console.log("replied data: "+data);
          document.getElementById('infospace').innerHTML = "<pre>"+data+"</pre>";
          hideloadingscreen();
       },
       'text'
    );
  });

  $("#btngetallinfo").click(function() {
    showloadingscreen();
    $.post( 'php/smartactions.php', "action=getallinfo&device="+selected, function(data) {
          //console.log("replied data: "+data);
          document.getElementById('infospace').innerHTML = "<pre>"+data+"</pre>";
          hideloadingscreen();
       },
       'text'
    );
  });

  $("#btngethtop").click(function() {
    showloadingscreen();
    $.post( 'php/smartactions.php', "action=htop", function(data) {
          //console.log("replied data: "+data);
          document.getElementById('infospace').innerHTML = "<pre>"+data+"</pre>";
          hideloadingscreen();
       },
       'text'
    );
  });

  $('#btnspinup').click(function() {
    showloadingscreen();
    $.post( 'php/smartactions.php', "action=spinup&device="+selected, function(data) {
         //console.log("replied data: "+data);
         hideloadingscreen();
         getPowerstate(selected);
       },
       'text'
    );
  });

  $('#btnspindown').click(function() {
    showloadingscreen();
    $.post( 'php/smartactions.php', "action=spindown&device="+selected, function(data) {
         //console.log("replied data: "+data);
         getPowerstate(selected);
         hideloadingscreen();
       },
       'text'
    );
  });

  $('#btnupdate').click(function() {
    showloadingscreen();
    $.post( 'php/smartactions.php', "action=update", function(data) {
          //console.log("replied data: "+data);
          $('#infospace')[0].innerHTML = "<pre>"+data+"</pre>";
          hideloadingscreen();
       },
       'text'
    );
  });

  //other functions

  function showloadingscreen() {
    document.getElementById('loadingscreen').innerHTML = "Loading... <img src='rsc/laden.gif' alt='#' width='50'>";
  }

  function hideloadingscreen() {
    document.getElementById('loadingscreen').innerHTML = "";
  }

  function select(vari){
    selected = "/dev/"+vari;
    $("#selection")[0].innerHTML = "Selected device: /dev/"+vari;
  }

  function getPowerstate(vari) {
    $.post( 'php/smartactions.php', "action=powerstate&device="+vari, function(data) {
         //console.log("replied data: "+data);
          document.getElementById(vari).innerHTML = data;
       },
       'text'
    );
  }

  function getlsblk() {
    showloadingscreen();
    $.post( 'php/smartactions.php', "action=lsblk", function(data) {
          //console.log("replied data: "+data);
          document.getElementById('lsblk').innerHTML = "<pre>"+data+"</pre>";
          hideloadingscreen();
       },
       'text'
    );
  }

  function getdf() {
    showloadingscreen();
    $.post( 'php/smartactions.php', "action=df", function(data) {
          //console.log("replied data: "+data);
          document.getElementById('df').innerHTML = "<pre>"+data+"</pre>";
          hideloadingscreen();
       },
       'text'
    );
  }

  //diagram functions

  function getdiskusagediagram() {
    showloadingscreen();
    $.post( 'php/smartactions.php', "action=dfrawdata", function(data) {
          //console.log("replied data: "+data);
          percent=Number(data);
          console.log(percent);
          google.charts.load("current", {packages:["corechart"]});
          google.charts.setOnLoadCallback(drawChart);

          hideloadingscreen();
       },
       'text'
    );
  }

  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Free',     100-percent],
      ['Used',    percent]
    ]);

    var options = {
      title: 'Data usage',
      pieHole: 0.4,
    };

    var chart = new google.visualization.PieChart(document.getElementById('datachart'));
    chart.draw(data, options);
  }


  /*
  //setInterval(printcpugraph, 1000);

  //printcpugraph();
  function printcpugraph() {

    $.post( 'php/smartactions.php', "action=cpugraph", function(data) {
          console.log("replied data: "+data);
          document.getElementById('infospace').innerHTML = "<pre>"+data+"</pre>";
          hideloadingscreen();
       },
       'text'
    );

    console.log("reprint graph");

    //google.charts.load('current', {'packages':['corechart']});
    //google.charts.setOnLoadCallback(drawChart);
  }

  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Sales', 'Expenses'],
      ['2004',  1000,      400],
      ['2005',  1170,      460],
      ['2006',  660,       1120],
      ['2007',  1030,      540]
    ]);

    var data = google.visualization.arrayToDataTable([
      ['Sales', 'Expenses'],
      [1000,      400],
      [ 1170,      460],
      [ 660,       1120],
      [ 1030,      540]
    ]);

    var options = {
      title: 'Company Performance',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('cpugraph'));

    chart.draw(data, options);
  }
  */


});
