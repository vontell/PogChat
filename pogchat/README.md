# Twitch Pro Chat Server

### Setting up the DB

```
create database pogchat;
create user 'pogchamp'@'%' identified by 'ThePassword';
grant all on pogchat.* to 'pogchamp'@'%';
```