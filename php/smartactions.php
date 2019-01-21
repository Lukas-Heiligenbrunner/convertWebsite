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
  $cmd = "sudo apt update";
  echo shell_exec($cmd);

}elseif ($action == "getdisks") {
  $command = "lsblk | grep -c disk";
  $disknumber = shell_exec($command);


  $data = array('disks' => array(),'parts' => array(),'raids' => array());

  //do for all devices
  for ($i=1; $i <= $disknumber; $i++) {
    $command = "lsblk | grep disk | head -n ".$i." | tail -n 1 | tr -s ' ' '\n'";
    $temp = shell_exec($command);
    $temparr = explode("\n",$temp);
    $data['disks'][$i-1] = $temparr;
  }

  $partnumber = shell_exec("lsblk -i| grep -c part");
  //do for all devices
  for ($i=1; $i <= $partnumber; $i++) {
    $command = "lsblk -i| grep part | head -n ".$i." | tail -n 1 | cut -c 3- | tr -s ' ' '\n'";
    $temp = shell_exec($command);
    $temparr = explode("\n",$temp);
    $data['parts'][$i-1] = $temparr;
  }

  $raidname = shell_exec("cat /proc/mdstat | grep active | tr -s ' ' '\n' | head -n 1");
  $raidname = "/dev/".$raidname;

  $data['raids'][0] = shell_exec("sudo mdadm --detail ".$raidname);

  //lsblk -i| grep part | head -n 1 | tail -n 1 | cut -c 3- | tr -s ' ' '\n'

  echo json_encode($data);
}else {
  echo "wrong action";
}
 ?>
