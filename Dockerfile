FROM gcc

ARG filename

RUN mkdir -p /usr/src/app

COPY /server/temp /usr/src/app

RUN gcc /usr/src/app/$filename.c -o /usr/src/app/$filename

RUN usr/src/app/$filename

RUN ls /usr/src/app
