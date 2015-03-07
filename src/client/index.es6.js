const debug = require('debug')('d3_test');
const d3 = require('d3');

// namespace
let jip = window.jip || {};

jip.init = function() {
  d3.select('body')
  .append('div')
  .append('p')
  .text('init');
};


window.jip = jip;
