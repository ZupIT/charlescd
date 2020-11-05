for category in ./plugins/*/
do
    category=${category%*/}
    category=${category##*/}

  for plugin in ./plugins/"$category"/*/
  do
    plugin=${plugin%*/}
    plugin=${plugin##*/}
    go build -buildmode=plugin -o ./dist/"$category"/"$plugin"/"$plugin".so ./plugins/"$category"/"$plugin"/*.go
    cp ./plugins/"$category"/"$plugin"/readme.json ./dist/"$category"/"$plugin"/readme.json
    echo Plugin "$plugin" builded
  done
done