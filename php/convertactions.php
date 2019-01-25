<?php
$action = $_POST['action'];

if ($action == "reloadinfo") {
  $data = array('finished' => 0,'filename' => "", 'duration' => 0);

  $info = shell_exec('cat ../scripts/output.txt | tail -c 2');
  if ($info == 6) {
    //convertion finished
    $data['finished'] = TRUE;
  }else {
    //convertion running
    $data['finished'] = FALSE;

    $temp = shell_exec("cat ../scripts/output.txt | tail -c 100 | tr -s ' ' '\n' | grep time | tr -s '=' '\n' | tail -n 1");
    $temp = explode("\n",$temp)[0];
    $data['duration'] = $temp;

    $temp = shell_exec("cat ../scripts/output.txt | grep Input | tr -s ' ' '\n' | tail -n 1");
    $temp = explode("'",$temp);
    $temp = $temp[1];
    $data['filename'] = $temp;
  }
  echo json_encode($data);
} elseif ($action == "startinfo") {

  $data = array('currentprogress' => array('filename' => "",'size' => 0, 'duration' => 0), 'allfiles' => [], 'finishedfiles' => []);

  //parse data from output.txt to get current file information
  $temp = shell_exec("cat ../scripts/output.txt | grep Duration | tr -s ' ' '\n' | head -n 3 | tail -n 1");
  $temp = explode('.',$temp)[0];
  $data['currentprogress']['duration'] = $temp;

  $temp = shell_exec("cat ../scripts/output.txt | grep Input | tr -s ' ' '\n' | tail -n 1");
  $temp = explode("'",$temp);
  $temp = $temp[1];
  $data['currentprogress']['filename'] = $temp;

  $data['currentprogress']['size'] = filesize($temp);

  //get all video files
  $videos = scandir("../videos");
  array_shift($videos); //shift because of . and ..
  array_shift($videos);

  foreach ($videos as $i) {
    if(substr($i,-3)==".ts")
    {
      $i = "../videos/".$i;

      $duration = shell_exec("ffmpeg -i $i -hide_banner 2>&1 | grep Duration | tr -s ' ' '\n' | head -n 3 | tail -n 1");
      $duration = explode(',',$duration)[0];

      array_push($data['allfiles'],array('filename' => $i, 'size'=> filesize($i), 'duration' => $duration));
    }
  }

  $myfile = fopen("../scripts/finished.txt", "r") or die("Unable to open file!");
  $finishedvideos = fread($myfile,filesize("../scripts/finished.txt"));
  fclose($myfile);

  $finishedvideos = explode("\n",$finishedvideos);
  array_shift($finishedvideos);
  array_pop($finishedvideos);

  foreach ($finishedvideos as $i) {
    $duration = shell_exec("ffmpeg -i $i -hide_banner 2>&1 | grep Duration | tr -s ' ' '\n' | head -n 3 | tail -n 1");
    $duration = explode(',',$duration)[0];

    array_push($data['finishedfiles'],array('filename' => $i, 'size'=> filesize($i), 'duration' => $duration));
  }

echo json_encode($data);
}elseif ($action == "startconv") {
  $info = shell_exec("cd ../scripts; sudo screen -S convertssss -dm bash convert.sh");
  echo "convertion started";
} elseif ($action == "stopconv") {
  $info = shell_exec("sudo screen -S convertssss -X quit");
  echo $info;
}elseif ($action == "shutdown") {
  $info = shell_exec("sudo shutdown -h 0");
  echo $info;
} else {
  echo "wrong action";
}
?>
