
##### production ######
.PHONY: build-production
build-production: ## Build the development docker image.
	docker-compose   -f docker/production/docker-compose.yml build

.PHONY: start-production
start-production: ## Start the development docker container.
	docker-compose   -f docker/production/docker-compose.yml up -d

.PHONY: stop-production
stop-production: ## Stop the development docker container.
	docker-compose  -f docker/production/docker-compose.yml down