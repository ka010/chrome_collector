//*******************************************************
//** Classifier                                        **
//*******************************************************

// Single Layer Perceptron (SLP)
// Multi Layer Perceptron (MLP)
function Classifier() {
    this.classifier = new MLP;
}

// init classifier
Classifier.prototype.init = function(input,hidden,out) {
    
    this.classifier.init(input,hidden,out);
}

// classify a single instance
Classifier.prototype.classify = function(input) {
    this.classifier.setInput(input);
    var output = this.classifier.calculate();
    if (output > 0.5 ) return 1
    else return 0;
}

Classifier.prototype.train = function(input) {
    
}
