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
    .text('Init.')
    .on('click', jip.click);

  let label = d3.select('body')
        .append('p').attr('id', 'clickModeP')
        .append('label')
        .text('Click for new');

  label.append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .on('click', function (d,i) {
      debug('check clicked: %s; %s', d, i);
      d3.event.stopPropagation();
    });

  // label.on('click', function (d, i) {
  //   debug('mode clicked: %s; %s', d, i);
  //   var mode = 'new';
  //   switch(mode) {
  //   case 'new':
  //     mode = 'select';
  //       label.text('Click to select');
  //     // d3.select('#clickModeP')
  //     //   .text('Click to select');
  //     break;
  //   case 'select': mode = 'new';
  //     label.text('Click for new');
  //     // d3.select('#clickModeP')
  //     break;
  //   }
  // });

};


window.jip = jip;
