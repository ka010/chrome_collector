//*******************************************************
//** Single Layer Perceptron                           **
//*******************************************************

function Perceptron() {
    this.inputVector;
    this.weightsVector;
    this.learningRate=0.05;
}

Perceptron.prototype.init = function(inputs) {
    this.inputVector = Vector.Random(inputs) ;
    
    this.weightsVector = Vector.Zero(inputs);
    var w = this.weightsVector;
    this.weightsVector.each(function(x,i) {
       x =  (Math.random()) - 0.5;
       w.elements[i-1] = x;
    });

}

Perceptron.prototype.setInput = function(input) {
    this.inputVector = input;
}

Perceptron.prototype.calculate = function() {
    var current=0;
    var sum=0.0;
    
    var w = this.weightsVector;
    
    // calculate sum
    this.inputVector.each(function(x,i) {
        sum = sum + x* w.e(i);
    });
    
    // activation
    if (sum >= 0) {
//        sum =1;
    } else {
  //      sum =0;
    }
    sum = 1.0 / (1.0+Math.exp(-sum));
    // return class - 0/1
    return sum;
}

Perceptron.prototype.adjustWeights = function(learningRate, output, target) {
    var w = this.weightsVector;
    this.inputVector.each(function(x,i) {
        w.elements[i-1] = w.e(i) + learningRate * (target-output) * x;
    });
}

Perceptron.prototype.train = function(input, target) {
 
    this.setInput(input);
    var output = this.calculate();
    this.adjustWeights(this.learningRate,output,target); 
    return output;
}

Perceptron.prototype.trainBatch = function(inputMatrix) {
    
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
        log(mse);
    }
}

Perceptron.prototype.classify = function(input) {
    this.setInput(input);
    var output = this.calculate();
    return output;
}

//*******************************************************
//** Classifier                                        **
//*******************************************************

function Classifier() {
    this.classifier = new Perceptron;
}

Classifier.prototype.init = function(inputs) {
    this.classifier.init(inputs);
}

Classifier.prototype.classify = function(input) {
  
    this.classifier.setInput(input);
    var output = this.classifier.calculate();
    if (output > 0.5 ) return 1
    else return 0;
}

Classifier.prototype.train = function(input) {
    
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
[    15,             20,          3,       CLASS_CLOSE],
[    4,             12,         13,       CLASS_KEEP],
[    6,             10,         2,      CLASS_CLOSE],
[    2,             1,          13,      CLASS_CLOSE],
[    11,             11,          15,      CLASS_KEEP],
[    11,            17,          20,      CLASS_KEEP],
[    11,             8,          15,      CLASS_KEEP],
[    3,             2,          2,      CLASS_CLOSE],
[    2,             6,          2,      CLASS_CLOSE],
[    1,             2,          1,      CLASS_CLOSE],
[    20,             6,          11,      CLASS_KEEP],
 ]);

 
 // create new classifier
 classifier = new Classifier;
 // create a perceptron with 3 input neurons
 classifier.init(3);
 // train perceptron with matrix test0
 classifier.classifier.trainBatch(test1);
 
// create a test vector
var testVector = Vector.create([11, 17, 20]);
// input testVector to classifier
var class_found = classifier.classify(normalize(testVector));  
// alert output
alert ("Class:" + class_found);
}

//*******************************************************
//** Helper Functions                                  **
//*******************************************************

function normalize(val) {
// return val.x(0.00392);    
  return val.x(0.05);    
}

function normalizeMatrix(matrix) {
    for (i=0; i<matrix.rows();i++) {
        var row = matrix.row(i+1);
        row.x(0.05);
    }
}

function log(txt) {
      console.log(txt);

}
