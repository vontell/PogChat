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

### Building and Deploying for Heroku

1. Update the version within `build.gradle.kts`
2. Run `./gradlew bootBuildImage --builder heroku/spring-boot-buildpacks`
3. Run `docker tag pogchat:{VERSION_NUM}-SNAPSHOT registry.heroku.com/pogchatgg/web`
4. Run `heroku login`
5. Run `heroku container:login`
6. Run `docker push registry.heroku.com/pogchatgg/web`
7. Run `heroku container:release web --app pogchatgg`