# Project overview
PostgreSQL Tuning Wizard is a web-based tool that checks SQL queries and PostgreSQL execiution plans for common performance and optimization issues and provides recommendations for improving query performance
# Purpose
The purpose of the project is to provide a simple and accessible interface for SQL tuning. The tool helps users identify common performance problems without requiring them to manually interpret PostgreSQL execution plans 
# Features
  * PostgreSQL database connection
  * SQL query input
  * EXPLAIN and EXPLAIN ANALYZE execution
  * Execution plan analysis
  * Index recommendations
  * PostgreSQL statistics checks
  * SQL query recommendations
  * Query performance information, including planning and execution time and buffer usage
# Project structure
The analyzer package contains the logic responsible for analyzing SQL queries and PostgreSQL execution plans.
</br></br>
The templates directory contains the HTML interface, while static contains the JavaScript and CSS files used by the frontend
</br></br>
**app.py** is the main Flask application entry point
# Technologies used
  * Python
  * Flask
  * PostgreSQL
  * psycopg
  * pglast
  * sqlparse
  * HTML
  * CSS
  * JavaScript
# Installation
## Prerequisites
* Python 3.x
* PostgreSQL
* A PostgreSQL database accessible by the application
## Setup
Clone the repository and navigate to the project directory:
```angular2html
git clone https://github.com/bisoftbilgi/postgresql-index-advsisor.git
cd postgresql-index-advsisor
```
Create and activate a virtual environment:
```angular2html
python -m venv .venv
source .venv/bin/activate
```
On Windows:
```angular2html
.venv\Scripts\activate
```
Install the required dependencies:
```angular2html
pip install -r requirements.txt
```
# How to run
Start the Flask application:
```angular2html
python app.py
```
The application will be available at the local address shown in the terminal
# How to use
1. Open the application in a web browser
2. Enter the PostgreSQL database connection information
3. Connect to the database
4. Enter the SQL query that should be analyzed
5. Choose whether to run EXPLAIN or EXPLAIN ANALYZE
6. Run the analysis
7. Review the execution information and recommendations provided by the wizard
# Example analysis
The wizard can analyze a query and provide information such as:
* Planning time
* Execution time
* Number of returned rows
* Shared buffer hits
* Shared buffer reads
* Temporary blocks written
* Detected execution plan issues
* Index recommendations
* SQL optimization recommendations

For example, a query performing a sequential scan on a large table may trigger an index recommendation when the analyzed conditions indicate that an index could improve performance
# Limitations
* The tool focuses on common PostgreSQL optimization patterns rather than providing a complete database tuning solution
* Recommendations are rule-based and should be reviewed by the user before being applied
* Query performance can depend on database size, hardware, configuration, data distribution and workload, which cannot always be determined from a single execution plan
* The tool does not automatically apply recommended database changes
* The quality of recommendations depends on the information available in the execution plan and database statistics