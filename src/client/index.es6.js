const debug = require('debug')('jip:d3_test');
const d3 = require('d3');

// namespace
let jip = window.jip || {};

jip.click = function(d, i) {
  debug('clicked: %s; %s', d, i);

};

jip.init = function() {
  d3.select('body')
    .append('div')
    .append('p')
    .text('init')
    .on('click', jip.click);
};


window.jip = jip;
