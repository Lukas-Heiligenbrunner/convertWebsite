<?php
$device = $_POST['device'];
$action = $_POST['action'];

if ($action == "spindown") {
  echo "spinning down";
  $info = shell_exec('sudo hdparm -y '.$device);
  if($info == ""){
    echo "an error occured...";
  }

} elseif ($action == "spinup") {
  echo "spinning up";
  $info = shell_exec('sudo smartctl -n never -H '.$device);
  if($info == ""){
    echo "an error occured...";
  }

}elseif ($action == "powerstate") {
  $info = shell_exec('sudo smartctl -n never '.$device.' | grep "Device is in"');
  echo $device.": ".$info;
}elseif ($action == "getallinfo") {
  $info = shell_exec('sudo smartctl -a '.$device);
  echo $info;
}elseif ($action == "gethealth") {
  $info = shell_exec('sudo smartctl -H '.$device);
  echo $info;
}elseif ($action == "lsblk") {
  $info = shell_exec('lsblk');
  echo $info;
}elseif ($action == "htop") {
  $info = sys_getloadavg();
  echo json_encode($info);
}elseif ($action == "df") {
  $info = shell_exec("df -h");
  echo $info;
}elseif ($action == "dfrawdata") {
  $info = shell_exec("df -h | grep /dev/md127 | tr -s ' ' '\n' | tail -n 2 | head -n 1 | cut -d'%' -f1");
  echo $info;
}elseif ($action == "cpugraph") {
  $info = array('0' => 0,'1' => 0, '2' => 0 , '3' => 0);

  $info['0'] = shell_exec("mpstat -P 0 | tr -s ' ' '\n' | head -n 21 | tail -n 1");
  $info['1'] = shell_exec("mpstat -P 1 | tr -s ' ' '\n' | head -n 21 | tail -n 1");
  $info['2'] = shell_exec("mpstat -P 2 | tr -s ' ' '\n' | head -n 21 | tail -n 1");
  $info['3'] = shell_exec("mpstat -P 3 | tr -s ' ' '\n' | head -n 21 | tail -n 1");

  echo json_encode($info);

}elseif ($action == "update") {

  ob_implicit_flush(true);
  ob_end_flush();

  $cmd = "sudo apt update";

  $descriptorspec = array(
     0 => array("pipe", "r"),   // stdin is a pipe that the child will read from
     1 => array("pipe", "w"),   // stdout is a pipe that the child will write to
     2 => array("pipe", "w")    // stderr is a pipe that the child will write to
  );


  $process = proc_open($cmd, $descriptorspec, $pipes, realpath('./'), array());

  if (is_resource($process)) {

      while ($s = fgets($pipes[1])) {
          print $s;

      }
  }

}else {
  echo "wrong action";
}
 ?>
