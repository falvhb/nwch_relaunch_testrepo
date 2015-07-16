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


For homebrew you also need to add this to your .profile or .bashrc::

    export C_INCLUDE_PATH="/usr/local/include"
    export LIBRARY_PATH="/usr/local/lib"


Installation
============

Set the current working directory to '/localdev' folder and run the following
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


Workaround For Openresty Download Problems
==========================================

We are experiencing download problems with openresty using buildout. This
workaround help to install the local nginx.

First make shure this folder exists::

    ~/.buildout/cache

Make sure the file ~/.buildout/default.cfg exists and contains these
entries::

    [buildout]
    eggs-directory = /Users/<your username>/.buildout/eggs
    download-cache = /Users/<your username>/.buildout/cache

Now download the openresty file and move it to the buildout cache::

    $ wget  http://openresty.org/download/ngx_openresty-1.4.3.6.tar.gz
    $ mv ngx_openresty-1.4.3.6.tar.gz ~/.buildout/cache/26b5e8f396fd26c987f4e15572e11526

Now buildout should work.


Usage
=====

To use the server connect to http://localhost:8801 in your browser.


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


Local
-----

This environment needs a fully working local a-z setup.

Activate with::

    $ rm localdev/nginx/www.conf
    $ bin/buildout -N -c local.cfg
    $ bin/supervisorctl restart nginx
