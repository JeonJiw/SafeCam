# PostgreSQL

## 1. Using the psql Client (PostgreSQL's native client)

### Connecting:

````bash
psql -U <DB_USERNAME> -d <DB_DATABASE>

### Listing Databases:

```SQL
<DB_NAME>=>\l
or
<DB_NAME>=>\list

### Listing Tables:

```SQL
<DB_NAME>=>\dt

### Or to see tables in a specific schema:

```SQL
<DB_NAME>=>\dt <schema_name>.*


### Viewing Table Structure (Columns):

```SQL
<DB_NAME>=>\d <table_name>

### Querying Data:

```SQL
<DB_NAME>=>SELECT * FROM <table_name>;

### Exiting:

```SQL
<DB_NAME>=>\q
or press Ctrl + D.
````
