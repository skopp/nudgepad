fixPermissionsUbuntu ()
{
  cd $dataPath
  
  # allow everyone to execute this directory
  sudo chmod 711 ~
  
  # todo, improve this. start with 0 permissions, work way toward proper.
  
  # proxy folder
  # only ubuntu can go in here
  sudo chown -R ubuntu:ubuntu proxy/
  sudo chmod -R 700 proxy/
  
  # server folder
  # ubuntu has read/write/execute
  # sites can read files, execute directory
  sudo chown -R ubuntu:sites server/
  sudo chmod -R 750 server
  sudo chmod 710 server
  
  
  # client folder
  # clients can read files, execute directory
  sudo chown -R ubuntu:sites client/
  sudo chmod -R 750 client
  sudo chmod 710 client
  
  
  # sites
  # 
  sudo chown ubuntu:sites sites
  sudo chmod 710 sites
  for domain in $sites
    do
      sudo chown -R $domain:$domain $sitesPath/$domain
      sudo chmod -R 700 $sitesPath/$domain/
  done
}

fixPermissionsMac ()
{
  for FOLDER in space spacefix
  do
  	echo $FOLDER
  done
}

fixPermissions ()
{
  cd $dataPath
  if isMac
    then
      fixPermissionsMac
    else
      fixPermissionsUbuntu
  fi  
}


