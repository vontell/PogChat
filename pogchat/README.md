# Twitch Pro Chat Server

### Setting Up MySQL
```
/usr/local/bin/mysql.server start
```

### Setting up the DB

```
create database pogchat;
create user 'pogchamp'@'%' identified by 'ThePassword';
grant all on pogchat.* to 'pogchamp'@'%';
```

### Building Docker

```
docker build --build-arg JAR_FILE=build/libs/\*.jar -t vontech.pogchat .
```

```
docker run -p 5000:8080 vontech/pogchat --env-file local-env.txt
```