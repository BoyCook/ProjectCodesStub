## Description

A simple file based HTTP server in node.js based upon [HttpFileServerJS](https://github.com/BoyCook/HttpFileServerJS).
It will serve up content from the filesystem, choosing a file based upon the URL path provided and the content type in `Accept` header.

## How it works

It's quite simple, like you'd expect an HTTP server like [Apache](http://httpd.apache.org) or [Nginx](http://nginx.org) to work.
The service uses the URL path to work out what directory to look in but it also uses the `Accept` header to work what the file extension is.
If the path is a directory it will serve back the contents, if it's a file then it will serve the file back.
If nothing is found a 404 is issued. The logic the server uses is:

* Check for directory `{path}`
* Check for file `{path}.{Accept}`
* Check for file `{path}`

## Data dir

One of the [HttpFileServerJS](https://github.com/BoyCook/HttpFileServerJS) parameters is a base directory for where the
service will look for data files. In this case it is the directory `./data`. There is already a directory structure with some
sample files in there for usage:

* `employees`
* `projectcodes`
* `timesheets`

Please look at the sample files to note suggested formats etc.

## Functionality available

* Project codes
    * List all
    * View instance
    * Create new
* Time Sheets
    * List all
    * View instance
    * Create new (test purposes only)
* Employees
    * List all
    * View instance
    * Create new (test purposes only)
    * Assign project code
    * Book time to project code

##  Web resources available

* `/projectcodes` GET
* `/projectcodes/{id}` GET/PUT
* `/timesheets` GET
* `/timesheets/{id}` GET/PUT
* `/employees` GET
* `/employees/{id}` GET/PUT
* `/employees/{id}/projectcodes` GET
* `/employees/{id}/projectcodes/{id}` GET/PUT
* `/employees/{id}/timesheets` GET
* `/employees/{id}/timesheets/{id}` GET/PUT
* `/employees/{id}/timesheets/{id}/project` GET/PUT

## Project codes

Project codes are stored in the directory `./data/projectcodes`, to list them all use:

    GET /projectcodes

To serve an individual project code file `./data/projectcodes/PC0001.json` use:

    GET /projectcodes/PC0001
    Accept application/json (because it uses the accept header to get the extension)

Or you can use the extension directly:

    GET /projectcodes/PC0001.json

To create a project code file `./data/projectcodes/{id}.json` use:

    PUT /projectcodes/{id}
    Data { "code": "{id}" }

The project code `id` format is `PC` followed by 4 numbers: `PC[0-9][0-9][0-9][0-9]`

## Time sheets

Time sheets are stored in the directory `./data/timesheets`, to list them all use:

    GET /timesheets

To serve an individual time sheet file `./data/timesheets/TS130513.json` use:

    GET /timesheets/TS130513
    Accept application/json (because it uses the accept header to get the extension)

Or you can use the extension directly:

    GET /timesheets/TS130513.json

To create a time sheet file `./data/timesheets/{id}.json` use:

    PUT /timesheets/{id}
    Data { "code": "{id}", "date": "{date}" }

The time sheet `id` format is `TS` followed by the week commencing date: `PC[dd][mm][yy]`

## Employees

Employees are stored in the directory `./data/timesheets`, to list them all use:

    GET /employees

To serve an individual employee file `./data/timesheets/TS130513.json` use:

    GET /employees/123
    Accept application/json (because it uses the accept header to get the extension)

Or you can use the extension directly:

    GET /employees/123.json

To create an employee file `./data/employee/{id}.json` use:

    PUT /employee/{id}
    Data { "id": "{id}" }

Employee is a special case. Creating an employee also creates sub-directories to store project codes and time sheets:

    ./data/employee/{id}
    ./data/employee/{id}/projectcodes
    ./data/employee/{id}/timesheets

The employee `id` format is just 3 numbers: `[0-9][0-9][0-9]`

## Prerequisites

* You must first install node.js http://nodejs.org
* If you can install [git](http://git**scm.com) that is ideal, otherwise you can download the project [here](https://github.com/BoyCook/ProjectCodesStub/archive/master.zip)

## Running

    node server.js

## Tests

Displaying results in the terminal (common usage):

    make test

Running all the tests (calls test**ci and test**cov ** best used by CI server):

    make test**all

Produce xUnit style XML report file:

    make test**ci

Running the tests with coverage and producing HTML Mocha coverage report file:

    make test**cov
