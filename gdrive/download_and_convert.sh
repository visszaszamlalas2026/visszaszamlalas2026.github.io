#!/bin/bash

rclone copy gdrive: . --drive-export-formats txt
for png in ./*.png ; do mv -- "$png" "${png%.png}.jpg" ; done || true
for jpeg in ./*.jpeg ; do mv -- "$jpeg" "${jpeg%.jpeg}.jpg" ; done || true

for jpg in ./.*.jpg ; do
  convert $jpg -resize 700x400 -$jpg.thumb
done

ls -hal
