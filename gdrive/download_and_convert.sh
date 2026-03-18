#!/bin/bash

rclone copy gdrive: . --drive-export-formats txt

# rename everything to lowercase .jpg, could be simplified, idc
# also files will be converted anyways
for png in ./*.png ; do mv -- "$png" "${png%.png}.jpg" ; done || true
for PNG in ./*.PNG ; do mv -- "$PNG" "${PNG%.PNG}.jpg" ; done || true
for jpeg in ./*.jpeg ; do mv -- "$jpeg" "${jpeg%.jpeg}.jpg" ; done || true
for JPEG in ./*.JPEG ; do mv -- "$JPEG" "${JPEG%.JPEG}.jpg" ; done || true
for JPG in ./*.JPG ; do mv -- "$JPG" "${JPG%.JPG}.jpg" ; done || true

for jpg in ./*.jpg ; do
  convert $jpg -resize 111x80 "${jpg%.jpg}.thumb.jpg"
done

ls -hal
