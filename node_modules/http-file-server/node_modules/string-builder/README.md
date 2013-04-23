# Description
A String Builder implementation in JavaScript for node.js

# Usage

For using String based storage

    var builder = new StringBuilder();
    builder.append('Some text');
    builder.toString('Some text');

For using Array based storage

    var builder = new StringBuilder(true);
    builder.append('Some text');
    builder.toString('Some text');

# Performance
See the timings.js for an idea. String concatenation performs better over Array join

    node test/timings.js
