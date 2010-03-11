function Layer() {
    this.units=0;
    this.activation;
    this.output;
    this.error;
    this.weight;
}

Layer.prototype.init = function (units) {
    this.units = units;
    this.activation = Vector.Zero(units);
    this.output = Vector.Zero(units);
    this.error = Vector.Zero(units);
    this.weight = Matrix.Zero(units,units);
}




function Net() {
    
    this.INPUT = 0;
    this.HIDDEN = 0;
    this.OUTPUT = 0;
    
    this.inputs ;
    this.hiddens ;
    this.outputs;
    this.weightsIH;
    this.weightsHO;
}

Net.prototype.init = function(INPUT,HIDDEN,OUTPUT) {
    this.INPUT = INPUT;
    this.HIDDEN = HIDDEN;
    this.OUTPUT = OUTPUT;
    
    this.inputs = Vector.Zero(INPUT);
    this.hiddens = Vector.Zero(HIDDEN);
    this.outputs = Vector.Zero(OUTPUT);
    this.weightsIH = Matrix.Zero(INPUT,HIDDEN);
    this.weightsHO = Matrix.Zero(HIDDEN,OUTPUT);
}



function test() {
 var FEATURES = 4;
 var CLASSES = 2;
 var input = Matrix.Zero(10,FEATURES);
 var output = Matrix.Zero(10,CLASSES);
 
 net = new Net;
 net.init(2,2,2);

 
 alert(net.hiddens.elements);   
}