#/bin/bash
echo "---------------------------------------------------------------------------"
echo "Rebuilding proxy for use with local environment"
echo "---------------------------------------------------------------------------"
rm nginx/www.conf
bin/buildout -Nc local.cfg
echo "---------------------------------------------------------------------------"
echo "Shutdown proxy"
echo "---------------------------------------------------------------------------"
bin/supervisorctl shutdown
echo "---------------------------------------------------------------------------"
echo "Starting proxy"
echo "---------------------------------------------------------------------------"
bin/supervisord
sleep 2
bin/supervisorctl status

