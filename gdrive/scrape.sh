#!/bin/bash

which gdown || pip install gdown

gdown $GDRIVE_FOLDER --folder | tee gdown_logs.txt