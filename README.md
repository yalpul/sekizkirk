## Installation

Docker and docker-compose must be installed.

To build all the images and run the containers, run

`docker-compose up -d`

You need to have a `.env` file in the directory. Its contents should be the following:

```
EMAIL_HOST=
EMAIL_ADDR=
EMAIL_PASS=
```

You also need the course data folder since scraping all the data can take a very long time.
Place the course data in `/tmp/sk/`

After the containers are up and running. You should run these commands to create the database schemas.
```
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate
```
