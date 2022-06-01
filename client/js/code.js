const Queue = require('../../utils/queue');

const cy = cytoscape({
    container: document.getElementById('cy-div'),

    boxSelectionEnabled: false,
    autounselectify: true,

    style: cytoscape.stylesheet()
        .selector('node')
        .selector('edge')
        .style({
            'curve-style': 'bezier',
            'width': 4,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd'
        })
        .selector('.highlighted')
        .style({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
        }),
    elements: {nodes: [], edges: []},
    // elements: {
    //     nodes: [
    //         { data: { id: 'a' } },
    //     ],
    //
    //     edges: [
    //         { data: { id: 'a"e', weight: 1, source: 'a', target: 'e' } },
    //     ]
    // },

    layout: {
        name: 'breadthfirst',
        directed: true,
        roots: '#a',
        padding: 10
    }
});

const queue = new Queue();
let num = 0;

document.getElementById('btn-greedy').addEventListener("click", () => calculateGreedy(false));
document.getElementById('btn-mst').addEventListener("click", () => calculateGreedy(true));
document.getElementById('btn-add-node').addEventListener("click", addNode);
const btnRandom = document.getElementById('btn-random');
btnRandom.addEventListener("click",  makeRandomGraph);

document.getElementById("input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    btnRandom.click();
  }
});

// let random_btn = document.getElementById('btn-random');

function generateRandomGraph(numberOfNodes) {
    nodes = [];
    for (let i = 0; i < numberOfNodes; i++) {
        nodes.push(generateRandomNode(i));
    }
    return nodes
}

function generateRandomNode(index) {
    return {group: "nodes", data: { id: `${index}` }, position: generateRandomPosition() };
}

function generateRandomPosition() {
    const x = Math.random() * 900 + 100;
    const y = Math.random() * 400 + 100;
    
    return {x, y};
}

function addNode() {
    // const data = {}
    // const url = "/add_node"
    // const func = (node) => {
    //     console.log(node)
    //     cy.add([node]);
    // };

    // sendJSON(data, url, func)
    node = generateRandomNode(num);
    cy.add([node]);
    num += 1;
}

function makeRandomGraph() {
    numberOfNodes = document.getElementById('input').value;
    console.log(numberOfNodes);
    cy.elements().remove();
    num = 0;
    if (numberOfNodes > 0 && numberOfNodes < 1000) {
        // const data = {numberOfNodes}
        // const url = "/random"
        // const func = (elements) =>  {
        //     const {nodes} = elements;
        //     console.log(nodes)
        //     cy.add(nodes); 
        // };
        // sendJSON(data, url, func)

        num = numberOfNodes;
        nodes = generateRandomGraph(num);
        console.log(nodes);
        cy.add(nodes); 
    }
}

function addEdge() {
    edge = queue.dequeue();
    cy.add([edge]);
    if(!queue.isEmpty()) {
        setTimeout(addEdge, 1000);
    }
}


function addEdges(edges) {
    animate = document.getElementById("customSwitch").checked ;
    console.log(animate);
    if (animate == true) {
        queue.enqueue(edges);
        addEdge();
    } else {
        cy.add(edges);
    }
}

function calculateGreedy(returnMST) {
    cy.remove('edge[true]');

    const nodes = cy.nodes().map(elem => {
        p = elem._private;
        return {
            id: p.data.id,
            position: p.position
        };
    });
    console.log(nodes);
    const data = {nodes};
    const url = "/greedy";
    const func = (res) =>  {
        const {elements} = res;
        const {greedy, mst} = elements;
        let edges = greedy;
        if (returnMST) {
            console.log("should work")
            edges = mst;
        }

        console.log(edges);
        addEdges(edges); 
    };

    sendJSON(data, url, func);
}

function sendJSON(data, url, func) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader(
        "Content-Type", "application/json"
    );
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 &&
            xhr.status === 200) {
            console.log('hey')
            console.log(xhr.responseText);
            func(JSON.parse(xhr.responseText));
        }
    }
}

cy.on('free', 'node', (e) => {
    let item = e.target;
    if (item.isNode()) {
        console.log(item._private.position)
    }
})


cy.on('tap', function (e) {
    console.log(e)
    if (e.target === cy) {            
        // const offset = $("cy").offset();
        // console.log(offset);
        const position = {
            x: e.position.x,
            y: e.position.y
        };
        
        console.log(position);
        cy.add([{
            group: "nodes",
            data: {
                id: num.toString()
            },
            position
        }]);    
        
        num += 1
    } 
    else {
        e.target.remove()
    }
});



// var bfs = cy.elements().bfs('#a', function(){}, true);

// var i = 0;
// var highlightNextEle = function(){
//     if( i < bfs.path.length ){
//         bfs.path[i].addClass('highlighted');

//         i++;
//         setTimeout(highlightNextEle, 1000);
//     }
// };

// // kick off first highlight
// highlightNextEle();
