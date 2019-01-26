#!/bin/bash

echo "" > finished.txt

for file in ../videos/*.ts
do
  echo "42" > output.txt
  ffmpeg -i "$file" -threads 2 -y "${file%.ts}".mp4 &> output.txt
  echo $file >> finished.txt
done

rm output.txt
