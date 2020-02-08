#!/bin/sh

sleep 1 && xset -display :0.0 dpms force off && \
/opt/vc/bin/tvservice -p && \
/opt/vc/bin/tvservice -o
killall chromium-browse