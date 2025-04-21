# Utah Freight Visualization and Analysis Software

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgis.net/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)


A visualization and analysis platform for freight movement and stop data in Utah.

## Table of Contents
- [Features](#features)
- [Quick Start](#quick-start)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Usage Guide](#usage-guide)
- [README](#readme)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Development Guide](#development-guide)

## Features

- **Interactive Map Visualization**
  - Real-time display of truck routes and stops
  - Customizable data filtering and sampling
  - Heatmap generation for stop density analysis
  - Route analysis for Utah boundary crossings

- **Data Analysis**
  - Time-based filtering of freight movements
  - Route segmentation and analysis
  - Stop duration and location analysis
  - Customizable data sampling parameters

## Quick Start

### Installation

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Git
- Node.js (for development)

### Setup Steps
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd freight-data
   ```

2. Start the Docker containers:
   ```bash
   docker compose up
   ```

3. Initialize the database:
   ```bash
   docker exec freight_server npm run prisma-generate
   docker exec freight_server npm run prisma-migrate
   ```

4. Restart the server container:
   - Open Docker Desktop
   - Navigate to Containers
   - Find and restart the `freight_server` container

5. Verify the setup:
   - Visit `http://localhost:3000`
   - The application should be running

### Database Setup

### Data Sources
- [Monthly Stop Data](https://usu.box.com/s/0r4puni3cx0mar4181faqvaj7uaku5l3)
- [Monthly Route Data](https://usu.box.com/s/63ziurrmh5hrqutouw0x89ad0tpefxd8)

> **Note**: Route data requires approximately 80GB of storage space.

### Loading Data
1. Copy data files to appropriate directories:
   - Stop data: `db_worker/monthly_stop_data`
   - Route data: `db_worker/monthly_route_data`

2. Run data loading scripts:
   ```bash
   cd db_worker
   python load_stop_data_into_db_parallel.py --month 1 --host localhost --password password
   python load_route_data_into_db_parallel.py --month 1 --host localhost --password password
   ```

3. Verify data loading:
   ```bash
   docker exec -it freight_db psql -U postgres -d mydatabase
   ```
   ```sql
   SELECT * FROM month_01_routes LIMIT 10;
   SELECT * FROM month_01_stops LIMIT 10;
   ```

### Usage Guide

### Getting Started
1. Navigate to `http://localhost:3000` in your web browser
2. The application will load with a map interface and a collapsible sidebar
3. The sidebar contains all controls for data visualization and analysis

### Data Visualization Controls

#### Dataset Selection
The application offers three main visualization modes:
- **Freight Routes into Utah**: Shows routes that end within Utah's boundaries
- **Freight Routes from Utah**: Shows routes that start within Utah's boundaries
- **Heatmap of suspected Stops**: Displays a density-based visualization of truck stops

To select a mode:
1. Click the corresponding button in the sidebar
2. The map will update to show the selected visualization type

#### Date Range Selection
1. Use the calendar interface in the sidebar to select your date range
2. Click and drag to select multiple days, or click individual dates
3. The date range is limited to the year 2023
4. Both start and end dates must be selected to submit a query

#### Route Visualization Parameters
When viewing routes (into or from Utah), you can adjust:

1. **Route Point Sampling**
   - Controls the density of points shown on routes
   - Higher values skip more points, improving performance
   - Lower values show more detail but may impact performance
   - Minimum value: 1 (shows all points)
   - Default value: 3

2. **Maximum Results**
   - Limits the number of points displayed on the map
   - Helps manage performance with large datasets
   - Minimum value: 10,000 points
   - Default value: 10,000

#### Heatmap Parameters
When using the heatmap visualization, you can adjust:

1. **EPS (Epsilon)**
   - Controls the radius of the density clusters
   - Higher values create larger clusters
   - Lower values create more detailed, smaller clusters
   - Minimum value: 0.00001
   - Default value: 0.00001

2. **Minimum Samples**
   - Sets the minimum number of points required to form a cluster
   - Higher values require more points to create a visible cluster
   - Lower values show more potential stop locations
   - Minimum value: 1
   - Default value: 1

### Interface Features

#### Map Navigation
- **Zoom**: Use the mouse wheel or the +/- buttons
- **Pan**: Click and drag the map
- **Reset View**: Double-click to reset to the default view

#### Sidebar Controls
- **Hide/Show**: Click the arrow button to collapse/expand the sidebar
- **Loading Indicator**: Shows when data is being processed
- **Submit Query**: Click to apply your selected parameters and update the visualization

### Best Practices

1. **Performance Optimization**
   - Start with higher sampling values for initial exploration
   - Reduce sampling for detailed analysis of specific areas
   - Use the maximum results limit to prevent overwhelming the visualization

2. **Heatmap Analysis**
   - Start with default EPS and minimum samples values
   - Adjust EPS to focus on different scales of stop density
   - Use minimum samples to filter out noise in the data

3. **Route Analysis**
   - Use the date range to focus on specific time periods
   - Adjust sampling to balance detail and performance
   - Zoom in on areas of interest for detailed route inspection

### Troubleshooting

1. **No Data Displayed**
   - Verify date range is selected
   - Check that parameters are within valid ranges
   - Ensure the database is properly loaded with data

2. **Performance Issues**
   - Increase route point sampling
   - Reduce maximum results

3. **Visualization Problems**
   - Clear browser cache
   - Refresh the page
   - Verify database connection

## README

### Technology Stack

### Frontend
- **React + TypeScript**: Modern UI framework with type safety
- **Leaflet**: Interactive map visualization
- **Vite**: Fast build tool and development server

### Backend
- **Express.js**: RESTful API server
- **TypeScript**: Type-safe server code
- **Zod**: Schema validation and type safety
- **PostgreSQL**: Primary database
- **PostGIS**: Spatial data processing
- **RabbitMQ**: Message queue for async processing

### Infrastructure
- **Docker**: Containerization and deployment
- **Docker Compose**: Multi-container orchestration

### Project Structure

```
freight-data/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Main application pages
│   │   └── types/        # TypeScript type definitions
│   └── public/           # Static assets
├── server/               # Express.js backend
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   └── services/    # Business logic
│   └── index.ts         # Entrypoint
└── db_worker/           # Data processing scripts
    ├── src/            # Python scripts
    ├── monthly_route_data/ # Data files (in format month_##.csv)
    ├── monthly_stop_data/ 
    ├── load_route_data_into_db_parallel.py  # Data loading scripts
    └── load_stop_data_into_db_parallel.py 
```

### Development Guide

The API server provides the following endpoints:

- `/location` - Query points within geographical boundaries
- `/status/:jobId` - Check query job status
- `/heatmap` - Generate heatmap data
- `/from_utah` - Get routes starting in Utah
- `/to_utah` - Get routes ending in Utah

All endpoints use Zod schemas for validation and SQL injection prevention.

The Database Worker handles data loading and processing:

1. **Stop Data Loading**
   - Parallel processing with multiple workers
   - Data validation and transformation
   - Efficient bulk loading
   - Automatic index creation

2. **Route Data Loading**
   - Intelligent route segmentation
   - Speed calculation and validation
   - Stuck point detection
   - Parallel processing

The client is a React-based web application that provides an interactive interface for visualizing and analyzing freight data. It offers several key features for users:

1. **Interactive Map Visualization**
   - Displays truck routes and stops on a map interface
   - Supports zooming, panning, and map interaction
   - Shows geographical boundaries and regions of interest

2. **Data Visualization Controls**
   - Time range selection for filtering data
   - Route point sampling controls to adjust visualization density
   - Maximum results limit settings
   - Dataset selection (routes, stops, heatmaps)

3. **Heatmap Generation**
   - Visual representation of stop density
   - Configurable clustering parameters
   - Time-based filtering of heatmap data

4. **Route Analysis**
   - Visualization of routes entering and exiting Utah
   - Interactive route selection and inspection

5. **User Interface Features**
   - Collapsible sidebar for controls
   - Loading indicators for data processing
   - Interactive markers for stops and routes
   - Responsive design for different screen sizes

The client communicates with the API server to fetch and display data, providing a user-friendly interface for exploring and analyzing freight movement patterns.

## Acknowledgments

- Initial setup based on [Joseph Ditton's repository](https://github.com/dittonjs/4610Spring25ClassExamples)
