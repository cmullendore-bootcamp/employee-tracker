#!/usr/bin/bash

mkdir /var/run/mysqld
chown mysql:mysql /var/run/mysqld
mysqld --daemonize
