# Utah Freight Visualization and Analysis Software
This initial setup of this app was taken from <a href="https://github.com/dittonjs/4610Spring25ClassExamples">Joseph Ditton's repo</a>. Thank you Professor Ditton!
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

**Features**
- Visualization of routes along a map interface
- Visualization of statistics relating to individual trips

## Running the app locally
1. Download <a href="https://www.docker.com/products/docker-desktop/">Docker Desktop</a>
2. Run Docker Desktop as an administrator
3. Open a terminal (as administrator) in the project's root directory (the folder with docker-compose.yml)
4. Run `docker compose up`
5. Open another terminal and run the following commands:
    *   `docker exec freight_server npm run prisma-generate`
    *   `docker exec freight_server npm run prisma-migrate`
6. Restart the Server Container
    1. This can be done in the Docker Desktop apps in the "Containers" tab
        * Locate the container, click on it, and click the Restart icon.
7. Visit `localhost:3000` and verify the server is running
8. Set up the database: *see below*


## Setting up the database. 
Find the monthly-split data files here 
<a href="https://usu.box.com/s/0r4puni3cx0mar4181faqvaj7uaku5l3">Stops</a>
and here 
<a href="https://usu.box.com/s/63ziurrmh5hrqutouw0x89ad0tpefxd8">Routes</a>

To fully download all of Routes data, you will need ~80GB of free storage.

1. Copy your data files into db_worker/monthly_route_data and db_worker/monthly_stop_data
2. Ensure the docker containers are running.
3. Open a terminal inside the db_worker directory.
4. Run the commands 
    * `python load_stop_data_into_db_parallel.py --month 1 --host localhost --password password` 
    * `python load_route_data_into_db_parallel.py --month 1 --host localhost --password password`
    * **\*Note\*** these python scripts will use a lot of CPU power. Use the --workers option to specify how many processors should be used
5. Run these commands for as many months as you wish to have the data for.
    * Please note that some of the "route" data files are very large and will take a while to load into the database.
    * Also, pay attention to your storage, as running these scripts do not "Cut + Paste" but rather "Copy + Paste". You can remove the data files after they have been loaded into the database.
6. Run the command `docker exec -it freight_db psql -U postgres -d mydatabase` and verify the tables were created using a command such as
```sql
SELECT * FROM month_01_routes LIMIT 10;
```
and 
```sql
SELECT * FROM month_01_stops LIMIT 10;
```

Once the database has been setup, you can now visit localhost:3000 and make a query.

## How to use this software

Navigate to the endpoint you have designated for the application to run. Assuming everything is set up properly, you should be on the map. Here, there are a few sections used for data visualization parameter inputs.

1. The Datasets themselves come in several different buttons. Clicking one will cause the application to request and display the data.
2. A calendar that allows you to pick the time range over which you want to see the data
3. A route point sampling parameter. This is the number of points the application will skip before adding a point to the route-line. Higher numbers mean that you skip more points, improving performance at the cost of accuracy.
4. The maximum number of results to return. For the routes this means the maximum number of points the application will attempt to retrieve and display on the map.

This panel also includes a hide button, which you can click if you want a better view of the map.



# Detailed Development Oriented Guide

## A Brief Overview of The Tech Stack

### The Frontend
The frontend uses React + TypeScript. To create the map and draw things on it, we are using the Leaflet library. The frontend serves as a way to easily interface with the database and visualize the data using the map.

### The Backend
There are two main pieces to the backend. First, there is the API server, which uses ExpressJS to handle requests from the frontend. The API server then sends a formal request for data to the database worker. The database worker (db_worker) takes the request, decides what operations it needs to do, and then executes the query. The API server and db_worker communicate using RabbitMQ, and message queue. 

### The Database
This application uses a PostgreSQL database with the PostGIS extension for handling the geographical data.

All of these services are ran as docker containers.


## A Deeper Look

### The API Server
The API server handles the HTTP requests sent from the client. It has the following endpoints

