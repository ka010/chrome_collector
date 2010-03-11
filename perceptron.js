function Perceptron() {
    this.inputVector;
    this.weightsVector;
    this.learningRate=0.02;
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
        sum =1;
    } else {
        sum =0;
    }
    
    // return class - 0/1
    return sum;
}

Perceptron.prototype.adjustWeights = function(learningRate, output, target) {
    var w = this.weightsVector;
    this.inputVector.each(function(x,i) {
        w.e(i) = w.e(i) + learningRate * (target-output) * x;
    });
}

Perceptron.prototype.train = function(input, target) {
    this.setInput(input);
    var output = this.calculate();
    this.adjustWeights(this.learningRate,output,target); 
}

function test() {

 perc = new Perceptron;
 perc.init(2);
 var x = perc.calculate();
   
}