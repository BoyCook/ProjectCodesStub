## Description
A simple file based HTTP server in node.js based upon [HttpFileServerJS](https://github.com/BoyCook/HttpFileServerJS).
It will serve up content from the filesystem, choosing a file based upon the URL path provided and the content type in 'Accept' header.

## How it works
It's quite simple, exactly as you'd expect an HTTP server like apache or nginx to work. The service uses the URL path
and the 'Accept' header to work out what to serve back. If the path is a directory it will serve back the contents,
if it's a file then it will serve the file back. If nothing is found a 404 is issued. The logic the server uses is:

* Check for directory '{path}'
* Check for file '{path}.{Accept}'
* Check for file '{path}'

## Data dir
One of the [HttpFileServerJS](https://github.com/BoyCook/HttpFileServerJS) parameters is a base directory for where the
data files are stored. In this case it is the directory `data`. There are already some sample files in there for usage.

## Project codes

This will list contents of directory `./data/codes`

    GET /codes

This will serve the file `./data/codes/123.json` (because it uses the accept header to get the extension)

    GET /codes/123
    Accept application/json

This will serve the file `./data/codes/123.json`

    GET /codes/123.json

## Prerequisites

You must first install node.js http://nodejs.org

## Running

    node server.js

## Tests

Displaying results in the terminal (common usage):

    make test

Running all the tests (calls test-ci and test-cov - best used by CI server):

    make test-all

Produce xUnit style XML report file:

    make test-ci

Running the tests with coverage and producing HTML Mocha coverage report file:

    make test-cov
