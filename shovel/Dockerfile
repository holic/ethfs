FROM indexsupply/shovel:latest@sha256:5131d98cdecf458776e742aa65c4d126f13ca4abd72e2568aefdb86f2962f3fe
COPY config.json .
CMD shovel -config config.json -l :$PORT
