#!/bin/sh

export DISPLAY=:0;
/opt/vc/bin/tvservice -p && sleep 1 && \
xset -display :0.0 dpms force on
chromium-browser --kiosk "https://trainboard.samleatherdale.com"
