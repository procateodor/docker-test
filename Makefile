build:
	docker build -t fii-practic-api .
run:
	docker run -it -p 3000:3000 fii-practic-api