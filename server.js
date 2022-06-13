const {generateRandomNode, generateRandomGraph} = require('./utils/utils')
const express = require("express");
const fs = require('fs');
const turf = require('turf');
const randomPointsOnPolygon = require('random-points-on-polygon');
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


app.post("/random", function (req, res) {
	let { numberOfNodes, append, num } = req.body
	numberOfNodes = parseInt(numberOfNodes);
	console.log(typeof(numberOfNodes));
	console.log(typeof(i));
	const elements = generateRandomGraph(numberOfNodes, num);
	// i = append ? i + numberOfNodes : numberOfNodes;
	res.json(elements);
});

app.post("/greedy", function (req, res) {
	const { nodes, angle } = req.body;
	res.json({
		elements: calculateGreedy(nodes, angle)
	});
});


app.post("/polygon", function (req, res) {
	const { numberOfNodes, path } = req.body;
	const { positions: polygonPositions } = JSON.parse(fs.readFileSync("data/" + path));
	polygonPositions.push(polygonPositions[0]); // need to be cyclic
	const polygonPoints = polygonPositions.map((position) => [position.x, position.y]);
	const polygon = turf.polygon([polygonPoints]);
	console.log(numberOfNodes);
	const points = randomPointsOnPolygon(numberOfNodes, polygon);
	console.log(points);
	const positions = points.map((point) =>  
		{
			return {
				x: point.geometry.coordinates[0],
				y: point.geometry.coordinates[1]
			}
		});
	i += numberOfNodes;
	res.json({ positions });
});


app.post("/load", function (req, res) {
	const { path } = req.body;
	const rawdata = fs.readFileSync("data/" + path);
	res.json(JSON.parse(rawdata));
});


app.post("/save", function (req, res) {
	console.log(req.body);
	const { positions, path } = req.body;
	fs.writeFileSync("data/" + path, JSON.stringify({positions}) , 'utf-8');
	res.json({done: true});
});


app.listen(3000, function () {
	console.log("Server started on port 3000");
});



