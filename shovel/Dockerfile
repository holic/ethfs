FROM indexsupply/shovel:latest@sha256:8be1d58084d044a6a68deb70e230a1cc7eb80cdfd65e82192490040ff43b035a
COPY config.json .
CMD shovel -config config.json -l :$PORT
