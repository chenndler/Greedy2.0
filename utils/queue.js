module.exports = class Queue {
    constructor() {
      this.elements = [];
    }
    enqueue(elements)
    {
      this.elements = [...elements];
    }
    dequeue()
    {
      if(this.isEmpty())
        return "Underflow";
      return this.elements.shift();
    }
    peek() {
      if(this.isEmpty())
        return "No elements in Queue";
      return this.elements[0];    
    }
    isEmpty() {
      return this.elements.length == 0;
    }
  }