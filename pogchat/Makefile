build-docker:
	./gradlew bootBuildImage --builder heroku/spring-boot-buildpacks
	docker images | grep pogchat

deploy-heroku:
	docker tag pogchat:0.0.3-SNAPSHOT registry.heroku.com/pogchatgg/web
	docker push registry.heroku.com/pogchatgg/web
	heroku container:release web --app pogchatgg

run-docker:
	docker run -p 3306:3306 -p 8080:8080 --env-file .env pogchat:0.0.3-SNAPSHOT
