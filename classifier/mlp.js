//*******************************************************
//** Multi Layer Perceptron                            **
//*******************************************************

//*****************************************
//*             C L A S S: Layer          *
//*****************************************
// constructor 
function Layer() {
    this.units=0;
    this.output;
    this.err;
    this.weight;
    this.dweight;
}

// init 
Layer.prototype.init = function (units) {
    this.units = units;
    this.output = Vector.Zero(units);
    this.err = Vector.Zero(units);
    this.weight = Matrix.Zero(units,units);
    this.dweight = Matrix.Zero(units,units);
    
   // init weights with random values between 0.5 and -0.5
    var w = this.weight;
    for (k=0; k<this.weight.rows(); k++) {
        var weights = w.row(k+1); 
        
        weights.each(function(x,i) {
            
           var z =  (Math.random()) - 0.5;
           weights.elements[i-1] = z;
          
        });  
        this.weight.elements[k] = weights.elements;

    }

}

Layer.prototype.propagate = function(outputLayer) {
 var sum=0.0;
 
 
    
}

//*****************************************
//*             C L A S S: MLP            *
//*****************************************
//          C O N S T R U C T O R
function MLP() {
    
    this.Layers = new Array();
    this.inputLayer = new Layer;
    this.hiddenLayer = new Layer;
    this.outputLayer = new Layer;
    this.eta=0.02;
    this.alpha=1;
    this.learningRate=0.02;
    this.gain=1;
    this.error=0;
}

//          I N I T
MLP.prototype.init = function(INPUT,HIDDEN,OUTPUT) {
    this.INPUT = INPUT;
    this.HIDDEN = HIDDEN;
    this.OUTPUT = OUTPUT;
    
    this.inputLayer.init(INPUT);
    this.hiddenLayer.init(HIDDEN);
    this.outputLayer.init(OUTPUT);
    
}

//          I N P U T
MLP.prototype.setInput = function(input) {
    this.inputLayer.output = input;
}

//          O U T P U T
MLP.prototype.getOutput = function() {
    return this.outputLayer.output;
}

//      P R O P A G A T E   S I G N A L S 
MLP.prototype.propagate = function() {
    this.propagateLayer(this.inputLayer,this.hiddenLayer);
    this.propagateLayer(this.hiddenLayer,this.outputLayer);

}

MLP.prototype.propagateLayer = function(lower,upper) {
    var sum=0.0;

    upper.output.each(function(x,i) {
       sum = 0.0;
       lower.output.each(function(y,k) {
          sum = sum+ upper.weight.elements[i-1][k-1] * y;
       });
       upper.output.elements[i-1] = 1.0 / (1.0 + Math.exp(-sum));
     
    });
    
}


MLP.prototype.backpropagate = function() {
    this.backpropagateLayer(this.outputLayer,this.hiddenLayer);
    this.backpropagateLayer(this.hiddenLayer,this.inputLayer);
}

MLP.prototype.backpropagateLayer = function(upper,lower) {
    var out = 0.0;
    var err = 0.0;
    
    lower.output.each(function(x,i) {
       out = x;
       err = 0.0;
       upper.output.each(function(y,k) {
          err = err + upper.weight.elements[k-1][i-1] * upper.err.e(k); 
       }); 
       lower.err.elements[i-1] = this.gain * out * (1-out) * err;
    });
    
}

//          C O M P U T E   E R R O R 
MLP.prototype.computeError = function(output,target) {
    var out = 0.0;
    var err = 0.0;
    
    output.output.each(function(x,i) {
       out = x;
       err = target.e(i)-out;
       
       output.err.elements[i-1] = this.gain * out * (1-out) * err; 
    });
}

//          W E I G H T S
MLP.prototype.adjustWeights = function() {
    this.adjustLayerWeights(this.hiddenLayer,this.inputLayer);
    this.adjustLayerWeights(this.outputLayer,this.hiddenLayer);
}
 
MLP.prototype.adjustLayerWeights = function(current, last) {
   var out=0;
   var err=0;
   var weightDelta=0.0;
   
   current.err.each(function(x,i) {
      last.output.each(function(y,k) {
          out = y;
          err= x;
          weightDelta = current.dweight.elements[i-1][k-1];
          console.log( err * out * weightDelta)
          current.weight.elements[i-1][k-1] =  current.weight.elements[i-1][k-1] + this.eta * err * out * this.alhpa * weightDelta;
          current.dweight.elements[i-1][k-1] = this.eta * err * out;
      }); 
   });
   
}

//          T R A I N
MLP.prototype.simulate = function(input, target) {
    this.setInput(input);
    this.propagate();
   // this.computeError(this.outputLayer,target);
     this.backpropagate();
     this.adjustWeights(); 
}

MLP.prototype.train = function() {
    
}


MLP.prototype.trainBatch = function(inputMatrix) {
    
    var mse =999;
    var lmse = 0.001;
    
    while (Math.abs(mse-lmse)>0.0001) {   
        mse =0;
        var error = 0;
        var i=0;
        for (i=0; i<=inputMatrix.rows()-1; i++) {

            var input = Vector.create([inputMatrix.row(i+1).e(1),
            inputMatrix.row(i+1).e(2),
            inputMatrix.row(i+1).e(3)
            ]);

            var target = inputMatrix.row(i+1).e(4);
            var output = this.train(normalize(input),target);
         
            error = error + Math.abs(target-output);
           
        }
        mse = error / inputMatrix.rows();
    }
}

//          C L A S S I F Y
MLP.prototype.classify = function(input) {
    this.setInput(input);
    var output = this.calculate();
    return output;
}



//*******************************************************
//** Classifier Test                                   **
//*******************************************************

function test() {
var CLASS_BLUE =1;
var CLASS_RED = 0;
var CLASS_CLOSE = 1;
var CLASS_KEEP = 0;

var test0 =Matrix.create([
    //RED           GREEN       BLUE            CLASS
[    0,              0,           255,           CLASS_BLUE],
[    0,              0,           192,           CLASS_BLUE],
[    243,            80,          59,            CLASS_RED],
[    255,            0,           77,            CLASS_RED],
[    77,             93,         190,            CLASS_BLUE],
[    255,            98,         89,             CLASS_RED],
[    208,            0,          49,             CLASS_RED],
[    67,             15,         210,            CLASS_BLUE],
[    82,             117,        174,            CLASS_BLUE],
[    168,            42,         89,             CLASS_RED],
[    248,            80,         68,             CLASS_RED],
[    128,            80,         255,            CLASS_BLUE],
[    228,            105,        116,            CLASS_RED]
    ]);

var test1 = Matrix.create([
 //   views,    updates,    lifetime (hours),   Collect 
[    5,             2,          3,       CLASS_CLOSE],
[    4,             12,         3,       CLASS_KEEP],
[    6,             10,         2,      CLASS_CLOSE],
[    2,             1,          3,      CLASS_CLOSE],
[    1,             1,          5,      CLASS_KEEP],
[    11,            7,          2,      CLASS_KEEP],
[    1,             8,          1,      CLASS_KEEP],
[    3,             2,          2,      CLASS_CLOSE],
[    2,             6,          2,      CLASS_CLOSE],
[    1,             2,          1,      CLASS_CLOSE],
[    2,             6,          1,      CLASS_KEEP],
 ]);

 
 // create new classifier
 classifier = new MLP;
 // create a MLP with 3 input neurons
 classifier.init(4,4,4);
 
 console.log(classifier.outputLayer.weight.inspect());
 var target = Vector.Random(4);
 classifier.simulate(test0.row(1),target);
  console.log(classifier.outputLayer.weight.inspect());
 // train MLP with matrix test0
 //classifier.classifier.trainBatch(test0);
 
// create a test vector
//var testVector = Vector.create([128, 250, 0]);
// input testVector to classifier
//var class_found = classifier.classify(normalize(testVector));  
// alert output
//alert ("Class:" + class_found);
}

//*******************************************************
//** Helper Functions                                  **
//*******************************************************

function normalize(val) {
 return val.x(0.00392);    
 // return val.x(0.05);    
}
