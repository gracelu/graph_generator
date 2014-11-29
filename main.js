//depth 1 example

var force; //determines layout of graph
var forcebool=0; //equal 1 if force layout is selected
function whichlayout(i){
    if (i === "Force"){
        forcebool= 1;
        $("#elength").attr('disabled', true);
    }else if (i === "Constrained"){
        forcebool= 0;
        $("#elength").attr('disabled', false);
    }
}

//sets edges length
var celength = 300;
function cola_elength(i){
    if (i === "100"){
        celength = 100;
    }else if (i === "200"){
        celength = 200;
    }else if (i === "300"){
        celength = 300;
    }else if (i === "400"){
        celength = 400;
    }else if (i === "500"){
        celength = 500;
    }
    
}

var nodes= []; //keeps track of node objects
var edges=[]; //keeps track of edges between node objects

//hovering over nodes gives node name
var tooltip = d3.select("body")
.append("div")
.style("position", "absolute")
.style("z-index", "10")
.style("font", "serif")
.style("visibility", "hidden");

var gnodes; //variable for nodes actually drawn on svg, circles
function drawnodes(){
    gnodes = svg.selectAll("circle")
    .attr("id", "gnodes")
    .data(nodes)
    .enter()
    .append("circle")
    .attr({"r":10})
    .call(force.drag)
    //tooltips
    .on("mouseover", function(d){return tooltip.text(d.name).style("background-color", "yellow").style("visibility", "visible");})
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    
    return gnodes;
}

function drawedges(){
    var gedges = svg.selectAll("line")
    .data(edges)
    .enter()
    .append("line")
    .attr("id",function(d,i) {return 'edge'+i})
    .attr('marker-end','url(#arrowhead)')
    .style("stroke","#ccc")
    .style("pointer-events", "none");
    
    svg.append('defs').append('marker')
    .attr({'id':'arrowhead',
          'viewBox':'-0 -5 15 10',
          'refX':25,
          'refY':0,
          'orient':'auto',
          'markerWidth':10,
          'markerHeight':10,
          'xoverflow':'visible'})
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#ccc')
    .attr('stroke','#ccc');
    
    return gedges;
}

function setcola(val){
    force = cola.d3adaptor()
    .size([w, h])
    .nodes(nodes)
    .links(edges)
    //.constraints(graph.constraints)
    .symmetricDiffLinkLengths(14)
    .flowLayout("y", val)
    .avoidOverlaps(true)
    .start(10,15,20);
}

function setforce(){
    /*
    force = cola.d3adaptor()
    .size([w, h])
    .nodes(nodes)
    .links(edges)
    //.constraints(graph.constraints)
    .symmetricDiffLinkLengths(14)
    .flowLayout("y", val)
    .avoidOverlaps(true)
    .start(10,15,20);
     */
    var linkDistance=200;
    force = d3.layout.force()
    .nodes(nodes)
    .links(edges)
    .size([w,h])
    .linkDistance([linkDistance])
    .charge([-500])
    .theta(0.1)
    .gravity(0.05)
    .start();
}

function drawgraph(input){

var input_vert= input.results.vertices;
//find nodes in input
for (i=0; i < input_vert.length; i++){
    var temp= new Object();
    temp.name= input_vert[i];
    
    nodes.push(temp);
}

//finds index of node given name
function find_node(name){
    for(i=0; i< nodes.length; i++){
        if (name === nodes[i].name){
            return i;
        }
    }
    return -1;
}

//creates array of edge objects
var input_edges= input.results.Edges;
for (j=0; j < input_edges.length; j++){
    var t2= new Object();
    var s= input_edges[j].src;
    var t= input_edges[j].tgt;
    var s_num= find_node(s);
    var t_num= find_node(t);
    t2.source= s_num;
    t2.target= t_num;
    edges.push(t2);
}
    
    //setforce(300);
    if (forcebool)
        setforce();
    else
        setcola(celength);
    
    var gedges= drawedges();
    gnodes= drawnodes();

    force.on("tick", function(){
         
         gedges.attr({"x1": function(d){return d.source.x;},
                    "y1": function(d){return d.source.y;},
                    "x2": function(d){return d.target.x;},
                    "y2": function(d){return d.target.y;}
                    });
         
         gnodes.attr({"cx":function(d){return d.x;},
                    "cy":function(d){return d.y;}
                     });

         });
}

// ===========================================================================

//generating graph
var w = 1000;
var h= 1000;

var border=1;
var bordercolor='black';

var svg = d3.select("body").append("svg").attr({"width":w,"height":h}).attr("border", border);

var borderPath = svg.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("height", h)
.attr("width", w)
.style("stroke", bordercolor)
.style("fill", "none")
.style("stroke-width", border);

function change_ncolor(v){
    d3.selectAll("circle").style("fill", v);
}

function change_nsize(v){
    d3.selectAll("circle").attr({"r":v});
}

//$("#elength").attr('disabled', true);

$('#clear').on('click', function (e) {
               console.log("CLEAR");
               console.log("#thecirclesornodes");
               svg.select('#thecirclesornodes').remove();
               });

$('#execute').on('click', function (e) {
                 
                 $('#execute').attr("disabled", true);
                 
                 var source_input= $("#sourcei").val();
                 console.log(source_input);
                 
                 var query_input= $("#query").val();
                 console.log(query_input);
                 
                 var depth_input= $("#depth").val();
                 console.log(depth_input);
                 
                 var nsize= $("#node-size").val();
                 console.log(nsize);
                 
                 var ncolor= $("#node-color").val();
                 console.log(ncolor);
                 
                 var input= {"results":{"neighborhood_size":25,"vertices":["AMP - 14466","THR3-9341081:AMP - 14466","THR3-2010100:AMP - 14466","100100126101:AMP - 14466","100100126095:AMP - 14466","TLS2H-151.0940:AMP - 14466","TLS2H-150.1136:AMP - 14466","SWK-341-40084-002:AMP - 14466","SWK-341-40084-003:AMP - 14466","SWK-341-40085-003:AMP - 14466","AATHKDU137621/1R1A:AMP - 14466","SKR-PW-03320300C0001:AMP - 14466","MOT1-546813-001-00:AMP - 14466","PNW-410-000070:AMP - 14466","PNW-910-000015:AMP - 14466","PNW-420-000179:AMP - 14466","PNW-740-000036:AMP - 14466","PNW-920-000035:AMP - 14466","PNW1-410-000034:AMP - 14466","PNW1-410-000044:AMP - 14466","PNW-410-000034:AMP - 14466","PNW1-420-000179:AMP - 14466","VIO-420-0039-00:AMP - 14466","MOT1-586213-001-00:AMP - 14466","PNW-410-000071:AMP - 14466"],"Edges":[{"src":"AMP - 14466","tgt":"THR3-9341081:AMP - 14466"},{"src":"AMP - 14466","tgt":"AATHKDU137621/1R1A:AMP - 14466"},{"src":"AMP - 14466","tgt":"PNW-410-000070:AMP - 14466"},{"src":"AMP - 14466","tgt":"VIO-420-0039-00:AMP - 14466"},{"src":"AMP - 14466","tgt":"THR3-2010100:AMP - 14466"},{"src":"AMP - 14466","tgt":"MOT1-586213-001-00:AMP - 14466"},{"src":"AMP - 14466","tgt":"100100126101:AMP - 14466"},{"src":"AMP - 14466","tgt":"SWK-341-40085-003:AMP - 14466"},{"src":"AMP - 14466","tgt":"100100126095:AMP - 14466"},{"src":"AMP - 14466","tgt":"TLS2H-151.0940:AMP - 14466"},{"src":"AMP - 14466","tgt":"SKR-PW-03320300C0001:AMP - 14466"},{"src":"AMP - 14466","tgt":"TLS2H-150.1136:AMP - 14466"},{"src":"AMP - 14466","tgt":"SWK-341-40084-003:AMP - 14466"},{"src":"AMP - 14466","tgt":"SWK-341-40084-002:AMP - 14466"},{"src":"AMP - 14466","tgt":"MOT1-546813-001-00:AMP - 14466"},{"src":"AMP - 14466","tgt":"PNW1-410-000034:AMP - 14466"},{"src":"AMP - 14466","tgt":"PNW-910-000015:AMP - 14466"},{"src":"AMP - 14466","tgt":"PNW-420-000179:AMP - 14466"},{"src":"AMP - 14466","tgt":"PNW-740-000036:AMP - 14466"},{"src":"AMP - 14466","tgt":"PNW-920-000035:AMP - 14466"},{"src":"AMP - 14466","tgt":"PNW1-410-000044:AMP - 14466"},{"src":"AMP - 14466","tgt":"PNW1-420-000179:AMP - 14466"},{"src":"AMP - 14466","tgt":"PNW-410-000034:AMP - 14466"},{"src":"AMP - 14466","tgt":"PNW-410-000071:AMP - 14466"}]},"error":false,"message":"","debug":""};
                 
                 drawgraph(input);
                 
                 
                 });

