[![Build Status](http://craigcook.co.uk/build/job/HTTP%20File%20Server/badge/icon)](http://craigcook.co.uk/build/job/HTTP%20File%20Server/)

## Description
A simple file based HTTP server in node.js. It will serve up content from the filesystem based upon the URL path provided
and the content type in 'Accept' header. This is quite useful when creating stubs for testing, or just plain HTTP file serving.

## How it works
It's quite simple, exactly as you'd expect an HTTP server like apache or nginx to work. The service uses the URL path
and the 'Accept' header to work out what to serve back. If the path is a directory it will serve back the contents,
if it's a file then it will serve the file back. If nothing is found a 404 is issued. The logic the server uses is:

* Check for directory 'path'
* Check for file 'path.{Accept}'
* Check for file 'path'

## Examples

List contents of directory `cars`

    GET /cars

Serve the file `./cars/bmw.html`

    GET /cars/bmw
    Accept text/html

or

    GET /cars/bmw.html

Create directory `./bikes`

    PUT /bikes

Create file `./bikes/harley`

    PUT /bikes/harley
    Data { "name": "Harley Davidson" }

## Prerequisites

You must first install node.js http://nodejs.org

## Usage

    var server = new HttpServer({port: 8080, baseDir: '.'});
    server.start();

## Tests

Displaying results in the terminal (common usage):

    make test

Running all the tests (calls test-ci and test-cov - best used by CI server):

    make test-all

Produce xUnit style XML report file:

    make test-ci

Running the tests with coverage and producing HTML Mocha coverage report file:

    make test-cov

## Links

* http://craigcook.co.uk/build/job/HTTP%20File%20Server
* http://craigcook.co.uk/quality/dashboard/index/241
