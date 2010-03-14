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
  //  this.computeError(this.outputLayer,target);
     this.backpropagate();
  //   this.adjustWeights(); 
}

MLP.prototype.train = function(tabData) {
    var input = Vector.create([tabData.viewCount, tabData.updateCount, tabData.moveCount, tabData.score]);
    this.simulate(input,1);

}

MLP.prototype.store = function() {
    return {
        "input": this.inputLayer.weight.elements,
        "hidden": this.hiddenLayer.weight.elements,
        "output": this.outputLayer.weight.elements
    };
}

MLP.prototype.load = function(data) {
    var input = Matrix.Zero(4,4);
    var hidden = Matrix.Zero(4,4);
    var output = Matrix.Zero(4,4);
    input.elements = data.input;
    hidden.elements = data.hidden;
    output.elements = data.output;
    this.inputLayer.weight = input;
    this.hiddenLayer.weight = hidden;
    this.outputLayer.weight = output;
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
 
 // create new classifier
 classifier = new MLP;
 // create a MLP with 3 input neurons
 classifier.init(4,4,4);
 
 console.log(classifier.outputLayer.weight.inspect());
 var target = Vector.Random(4);
 classifier.simulate(test0.row(1),target);
  console.log(classifier.outputLayer.weight.inspect());

}

//*******************************************************
//** Helper Functions                                  **
//*******************************************************

function normalize(val) {
 return val.x(0.00392);    
 // return val.x(0.05);    
}
