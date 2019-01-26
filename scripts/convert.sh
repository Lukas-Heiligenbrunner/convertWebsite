#!/bin/bash

echo "" > finished.txt

for file in ../videos/*.ts
do
  echo "" > output.txt
  ffmpeg -i "$file" -threads 2 -y "${file%.ts}".mp4 &> output.txt
  echo $file >> finished.txt
done
