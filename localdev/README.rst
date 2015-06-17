=============================
Local Development Environment
=============================

This folder contains a buildout which creates an nginx which is able to use
the local node server and run it against an external environment.


System Requirements
===================

The pcre package needs to be installed.

Using macports::

    $ sudo port install pcre

Using homebrew::

    $ brew install pcre

Python 2.7 is needed.


Installation
============

Set the current working directory to this folder and run the following
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


Usage
=====

To use the server connect to "localhost:8801" in your favorite browser.


Select A Backend
================

To select a backend buildout must run with different configurations.

Before running buildout it is important to remove the file
localdev/nginx/www.conf because of a bug in buildout.


Development
-----------

This is the default and is activated with::

    $ rm localdev/nginx/www.conf
    $ bin/buildout -N
    $ bin/supervisorctl restart nginx

Staging
-------

Activate with::

    $ rm localdev/nginx/www.conf
    $ bin/buildout -N -c staging.cfg
    $ bin/supervisorctl restart nginx
