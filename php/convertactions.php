<?php
$action = $_POST['action'];

if ($action == "reloadinfo") {
  $info = shell_exec('cat ../scripts/output.txt | tail -c 100');
  if($info == ""){
    echo "no file";
  }
  echo $info;

} elseif ($action == "startinfo") {
  $info = shell_exec("cat ../scripts/output.txt | grep Duration | tr -s ' ' '\n' | head -n 3 | tail -n 1");
  echo $info;

  $command = <<<'EOD'
  cd ../videos
  for file in *.ts
  do
  ffmpeg -i $file -hide_banner 2>&1 | grep Duration | tr -s ' ' '\n' | head -n 3 | tail -n 1
  done
EOD;

  echo ";";
  $info = shell_exec($command); //send time of all videos
  echo $info;
  echo ";";

  $command = <<<'EOD'
  cd ../scripts
  for file in $(cat finished.txt)
  do
  ffmpeg -i $file -hide_banner 2>&1 | grep Duration | tr -s ' ' '\n' | head -n 3 | tail -n 1
  done
EOD;

$info = shell_exec($command); //send time of all videos
echo $info;
echo ";";

$command = <<<'EOD'
cd ../scripts

cat output.txt | grep Input | tr -s ' ' '\n' | tail -n 1
EOD;

$info = shell_exec($command);
echo $info;


} elseif ($action == "showvids") {
  $command = <<<'EOD'
  cd ../videos
  for file in *.ts
  do
  du -h $file
  done
EOD;
  $info = shell_exec($command);
  echo $info;
}elseif ($action == "gettotaltime") {
  $command = <<<'EOD'
  cd ../videos
  for file in *.ts
  do
  ffmpeg -i $file -hide_banner 2>&1 | grep Duration | tr -s ' ' '\n' | head -n 3 | tail -n 1
  done
EOD;

  $info = shell_exec($command);
  echo $info;
}elseif ($action == "startconv") {
  $info = shell_exec("cd ../scripts; sudo screen -S convert -dm bash convert.sh");
  echo "convertion started";
} elseif ($action == "stopconv") {
  $info = shell_exec("sudo screen -S convert -X quit");
  echo $info;
}elseif ($action == "shutdown") {
  $info = shell_exec("sudo shutdown -h 0");
  echo $info;
} else {
  echo "wrong action";
}


 ?>
