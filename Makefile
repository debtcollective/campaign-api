tag = latest
export tag

build:
	docker build -t debtcollective/campaign-api:$(tag) .

push:
	docker push debtcollective/campaign-api:$(tag)
