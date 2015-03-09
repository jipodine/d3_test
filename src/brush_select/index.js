var debug = require('debug')('jip:d3_test');
var d3 = require('d3');

// namespace
var jip = window.jip || {};


// jip.data = {
//   extend: [[-10, 10], [-10, 10]],
//   values: [
//     { x: 0, y: 0, r: 0.1, i: 0, n:'un'},
//     { x: 5, y: 5, r: 0.1, i: 1, n:'deux'},
//     { x: -5, y: -5, r: 0.1, i: 2, n:'trois'}
//   ]
// };

// jip.sketch = {
//   width: 950,
//   height: 500
// };



jip.click = function(d, i) {
  debug('clicked: %s; %s', d, i);

};




jip.init = function() {
  // jip.createControls();
  // jip.renderControls();

  jip.createSketch();
  jip.renderSketch();


};

// jip.createControls = function(width = '100%') {
//   d3.select('body')
//     .append('div')
//     .append('p')
//     .text('Init.')
//     .on('click', jip.click);

//   let label = d3.select('body')
//         .append('p').attr('id', 'clickModeP')
//         .append('label')
//         .text('Click for new');

//   label.append('input')
//     .attr('type', 'checkbox')
//     .attr('checked', true)
//     .on('click', function (d,i) {
//       debug('check clicked: %s; %s', d, i);
//       d3.event.stopPropagation();
//     });

//   // label.on('click', function (d, i) {
//   //   debug('mode clicked: %s; %s', d, i);
//   //   var mode = 'new';
//   //   switch(mode) {
//   //   case 'new':
//   //     mode = 'select';
//   //       label.text('Click to select');
//   //     // d3.select('#clickModeP')
//   //     //   .text('Click to select');
//   //     break;
//   //   case 'select': mode = 'new';
//   //     label.text('Click for new');
//   //     // d3.select('#clickModeP')
//   //     break;
//   //   }
//   // });

// };

// jip.renderControls = function() {

// };

jip.createSketch = function () {
  // sketch

  var margin = { top: 20, bottom: 20, left: 10, right: 10};
  var width = 960 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;

  // data

  var data = {
    domain: [[-10, 10], [-10, 10]],
    values: [ [] ]
  };

  data.values = d3.range(10).map(function() {
    var range = [data.domain[0][1] - data.domain[0][0],
                   data.domain[1][1] - data.domain[1][0]];
    return [Math.random() * range[0] + data.domain[0][0],
            Math.random() * range[1] + data.domain[1][0]];
  });

  var quadtree = d3.geom.quadtree()
        .extent([[data.domain[0][0] - 1, data.domain[1][0] - 1],
                 [data.domain[0][1] + 1, data.domain[1][1] + 1]])
        (data.values);

  var x = d3.scale.linear()
        .domain(data.domain[0])
        .range([0, width]);

  var y = d3.scale.linear()
        .domain(data.domain[1])
        .range([0, height]);


  // controls
  var control = {
    clickMode: 'select'
  };

  var label = d3.select('body')
        .append('p').attr('id', 'clickModeP')
        .append('label')
        .text('Click to select');

  label.append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .on('click', function (d,i) {
      debug('check clicked: %s; %s', d, i);
    });



  var svg = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
       .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var brush = d3.svg.brush()
        .x(x)
        .y(y)
        // .extent(defaultExtent)
        .on("brush", brushed)
        .on("brushend", brushended);

  svg.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.event);

  var point = svg.selectAll(".point")
        .data(data.values)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", function(d) { return x(d[0]); })
        .attr("cy", function(d) { return y(d[1]); })
        .attr("r", 4)
        .on('click', function (d,i) {
          debug('circle clicked: %s; %s', d, i);
          switch(control.clickMode) {
          case 'select':
            // invert selection
            var s = d3.select(this);
            s.classed('selected', !s.classed('selected') );
            break;
          }
          d3.event.stopPropagation();
        });

  function brushed() {
    var point = svg.selectAll(".point");
    var extent = brush.extent();
    debug("extent = %s", extent);
    point.each(function(d) { d.selected = false; });
    if(brush.empty() ) {
      debug('brush empty');
    } else {
    search(quadtree, extent[0][0], extent[0][1], extent[1][0], extent[1][1]);
      point.classed("selected", function(d) { return d.selected; });
    }
  }

  function brushended() {
    if (!d3.event.sourceEvent) {
      // only transition after input
      return;
    }
    // d3.select(this).transition()
    //   .duration(brush.empty() ? 0 : 750)
    //   .call(brush.extent(defaultExtent))
    //   .call(brush.event);
  }

  // Find the nodes within the specified rectangle.
  function search(quadtree, x0, y0, x3, y3) {
    quadtree.visit(function(node, x1, y1, x2, y2) {
      var p = node.point;
      if (p) {
        p.selected = (p[0] >= x0) && (p[0] < x3) && (p[1] >= y0) && (p[1] < y3);
      }
      return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
    });
  }


};

jip.renderSketch = function() {

};

window.jip = jip;
