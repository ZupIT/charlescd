for category in ./plugins/*/
do
    category=${category%*/}
    category=${category##*/}

  for plugin in ./plugins/"$category"/*/
  do
    plugin=${plugin%*/}
    plugin=${plugin##*/}
    go build -buildmode=plugin -o ./dist/"$category"/"$plugin"/"$plugin".so ./plugins/"$category"/"$plugin"/*.go
    cp ./plugins/"$category"/"$plugin"/readme.yaml ./dist/"$category"/"$plugin"/readme.yaml
    echo Plugin "$plugin" builded
  done
done