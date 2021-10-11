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