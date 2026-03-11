#!/bin/bash

which gdown || pip install gdown

gdown $GDRIVE_FOLDER --folder &> gdown_logs.txt