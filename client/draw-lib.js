//
// Canvas for drawing the PMT arrays
//
PMT_Canvas = function () {
  var self = this;
  var svg;

  // canvas size
  var xcanvas = 300;
  var ycanvas = 300;
  // maximum TPC coordinate. we will assume xcanvas=100 -> xpmt = 0
  rtpc = 110;
    
  // Creates the SVG canvas.
  var createSvg = function() {
    svg = d3.select('#pmt_canvas').append('svg')
      .attr('width', xcanvas.toString())
      .attr('height', ycanvas.toString());
  };
  createSvg();

  // Clears the SVG canvas.
  self.clear = function() {
    d3.select('svg').remove();
    createSvg();
  };

  // conversion of PMT coordinates to svg coordinates
  var xg = function(d){
      return (d.x/rtpc + 0.5)*xcanvas ;
  };
    
  var yg = function(d){
      return (d.y/rtpc + 0.5)*ycanvas ;
  };
    
  // Draw array of PMTs
  self.draw = function(data,type) {
    if (data.length < 1) {
      self.clear();
      return;
    }
    if (svg) {
      // This is what actually does the drawing. 
        
      svg.selectAll('circle').data(data, function(d) { if(d.Top_Bottom == type ) return d._id; })
        .enter().append('circle')
        .attr('r', 3.75/rtpc*xcanvas)
        .attr('cx', function (d) { return xg(d); })
        .attr('cy', function (d) { return yg(d); })
        .attr('fill', function (d){
              if (Session.get("selectPMT").indexOf(d.PMT_Location) >=0){
                 return 'green';
              } else {
                 return 'orange';
              }})
        
        
      svg.selectAll('text').data(data, function(d) { if(d.Top_Bottom == type ) return d._id; })
        .enter().append('text')
        .text(function(d) {return d.PMT_Location.toString();})
        .attr('x', function (d) { return xg(d); })
        .attr('y', function (d) { return yg(d); })
        .attr('font-size','10px')
        .attr('text-anchor','middle')
        .attr('alignment-baseline','central')

    }
  };
}

//
// Canvas for drawing the crates
//
Crate_Canvas = function () {
    var self = this;
    var svg;
    
    // canvas size
    var xcanvas = 400;
    var ycanvas = 400;
    
    // Creates the SVG canvas.
    var createSvg = function() {
        svg = d3.select('#canvas').append('svg')
        .attr('width', xcanvas.toString())
        .attr('height', ycanvas.toString());
    };
    createSvg();
    
    // Clears the SVG canvas.
    self.clear = function() {
        d3.select('svg').remove();
        createSvg();
    };
    
    // conversion of PMT coordinates to svg coordinates
    var xg = function(d){
        return (d.x/rtpc + 0.5)*ycanvas ;
    };
    
    var yg = function(d){
        return (d.y/rtpc + 0.5)*ycanvas ;
    };
    
    // Naively draws an array of simple point objects.
    self.draw = function(data,type) {
        if (data.length < 1) {
            self.clear();
            return;
        }
        if (svg) {
            // This is what actually does the drawing.

            
        }
    };
}



