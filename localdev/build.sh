#/bin/bash
echo "---------------------------------------------------------------------------"
echo "Rebuilding proxy for use with dev environment"
echo "---------------------------------------------------------------------------"
rm nginx/www.conf
bin/buildout -N
echo "---------------------------------------------------------------------------"
echo "Shutdown proxy"
echo "---------------------------------------------------------------------------"
bin/supervisorctl shutdown
echo "---------------------------------------------------------------------------"
echo "Starting proxy"
echo "---------------------------------------------------------------------------"
bin/supervisord
bin/supervisorctl status

