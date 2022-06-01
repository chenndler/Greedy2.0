// const {generateRandomNode, generateRandomGraph} = require('./utils/utils')
const express = require("express");
var path = require('path');
const bodyParser = require("body-parser");
const { calculateGreedy } = require('./greedy')
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
// app.use(express.static(path.join(__dirname, 'client/js')));

// let i = 0
// app.post("/add_node", function (req, res) {
// 	console.log(`Hey ${i}`)
// 	const node = generateRandomNode(i)
// 	console.log(node)
// 	res.json(node);
//     i += 1
// });


// app.post("/random", function (req, res) {
// 	const { numberOfNodes } = req.body
// 	console.log(numberOfNodes)
// 	const elements = generateRandomGraph(numberOfNodes);
//     console.log(`Hey ${i}`)
// 	res.json(elements);
//     i = parseInt(numberOfNodes)
// });

app.post("/greedy", function (req, res) {
	const { nodes } = req.body;
	console.log(req.body);
	res.json({
		elements: calculateGreedy(nodes)
	});
});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});



