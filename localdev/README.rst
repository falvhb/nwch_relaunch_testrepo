=============================
Local Development Environment
=============================

This folder contains a buildout which creates an nginx which is able to use
the local node server and run it against an external environment.

Installation
============

First you need python 2.7 installed on your system.

Then set the current working directory to this folder and run the following
commands::

    $ python bootstrap.py
    $ bin/buildout -N

Now you have an nginx which can be started under supervisor control::

    $ bin/supervisord

To check if nginx is running::

    $ bin/supervisorctl status
    nginx                            RUNNING   pid 19029, uptime 0:00:09

If you find something else this log is of interest::

    $ tail var/log/supervisor/nginx-stdout---supervisor-...


Select A Backend
================

To select a backend to use buildout must run with different configurations::

Development
-----------

This is default and is activated with::

    $ bin/buildout -N


Staging
-------

Run buildout this way::

    $ bin/buildout -N -c staging.cfg
