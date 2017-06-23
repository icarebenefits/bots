#!/usr/bin/env bash
########################################
### DEPLOYMENT SCRIPT FOR ICARE BOTS ###
# AUTHOR: TANKTM #######################
# DATE: 20170621 #######################
########################################

# MAIN #
case "$1" in
  bots)
    cd ~/bots
    ;;
  jobs)
    cd ~/jobs-server
    ;;
  *)
    echo $"Usage: $0 {bots|jobs}"
    exit 1
esac

if git pull ; then
  cd .deploy
  case "$2" in
    reconfig)
      mup reconfig
      ;;
    deploy)
      mup deploy
      ;;
    *)
      mup deploy
  esac
else
  echo "Pulling code Error $0"
fi
