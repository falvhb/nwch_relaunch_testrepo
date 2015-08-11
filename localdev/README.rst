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

Initial Step
------------

This initial step is only needed the first time after cloning the
repository::

    $ cd localdev
    $ python bootstrap.py

Building The Proxy
------------------

This step will do a complete rebuild and restart of the proxy. This step is
needed initially or after a change was made in the nginx configuration::

    $ ./build.sh

Manual Build
------------

Note that these steps are not needed if you use the "build.sh" script::

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

First make sure this folder exists::

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

    $ cd localdev
    $ ./build.sh
    
Or manually::

    $ cd localdev
    $ rm nginx/www.conf
    $ bin/buildout -N
    $ bin/supervisorctl restart nginx


Staging
-------

Activate with::

    $ cd localdev
    $ rm nginx/www.conf
    $ bin/buildout -N -c staging.cfg
    $ bin/supervisorctl restart nginx


Local
-----

This environment needs a fully working local a-z setup.

Activate with::

    $ cd localdev
    $ rm nginx/www.conf
    $ bin/buildout -N -c local.cfg
    $ bin/supervisorctl restart nginx


Access To Different Domains
===========================

Domains are mapped to different ports::

    localhost:8801 aaz;
    localhost:8804 aaz;
    localhost:8805 blz;
    localhost:8806 liz;
    localhost:8807 soz;
    localhost:8808 ot;
    localhost:8809 gtb;

The HTTP-header "x-skin" contains the skin name.

This header can be accessed in the node server::

    req.headers['x-skin']
