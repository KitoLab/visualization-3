/*
	transitionNetworkGraph.js

	【準備】
	
	1.グラフを配置したい場所に《id="chart"》をもつdiv要素を用意する
	<div id="chart"></div>

	2.「d3.js」を呼び出す
	<script src="https://d3js.org/d3.v3.js" charset="utf-8"></script>

	3.これを呼び出す
	<script src="transitionNetworkGraph.js" charset="utf-8"></script>

	4.おしまい


	【要素の追加】

	データの追加 -> 描画 とすることでグラフにノードやリンクなどの要素が追加される。

	1. データの追加
	nodes.push({"id": ___ , "r": ___ , "x": ___ , "y": ___ });
	links.push({"source": ___ , "target": ___ , "weight": ___ , "direction": ___ });
	(基本、リンクのidは source < target となるように記述する。効果の方向をつけるためにdirectionがある。)

	2. 描画	
	draw();

	これでよい


	【今後の課題】
	1.グラフを同時にいくつも表示できるように、こういう処理をまとめてクラスとかにしたい
	　やろうと思ったけどなんかエラーが出てよくわからんのでやめました

	2.d3のversion4てのがあるらしい（今使っているのはv3）
	　それも使えるようにする

	3. nodeを際限なく大きくしていくのをやめる
		相対的な発言回数の比較でサイズを決めるのが望ましいのでは？

	4. mouseonしたらそのノードと接続されているものだけちゃんと表示する

	【使えるオプション（現状）】
	・ node
 	  - x … 初期位置のx座標
 	  - y … 初期位置のy座標
 	  - r … ノードの半径

	・ link
	  - source … リンクの接続元
	  - target … リンクの接続先
	  - thickness … リンクの太さ
	  - length … リンクの長さ



*/


var width = 800,
	height = 600;

var outer = d3.select("#chart")
				.append("svg:svg")
				.attr({
					"width": width,
					"height": height
				})

var vis = outer.append("svg:g");

vis.append("svg.rect")
	.attr({
		"width": width,
		"height": height,
		"fill": "white"
	})


// forceの初期設定、グラフの描画を変えたいならここをいじる
var force = d3.layout.force()
				.size([width, height])
				.nodes([])
				.linkDistance(function (d){ return d.length + d.source.r + d.target.r }) 
				.chargeDistance(350)
				.linkStrength(0.2)
				.charge(-500)
				.alpha(0.1)
				.gravity(0.3)
				.friction(0.8)
				.on("tick", tick);

/*
	これもfunctionによって個別に与えられる！
	（参考）データビジュアライゼーション・ラボ：https://wizardace.com/d3-forcesimulation-link-detail/
*/

var nodes = force.nodes(),
	links = force.links(),
	node = vis.selectAll(".node"),
	link = vis.selectAll(".link");

var labels = [],
	label = vis.selectAll(".label");

draw();


function tick() {
	link.attr({
		x1: function(d) { return d.source.x; },
		y1: function(d) { return d.source.y; },
		x2: function(d) { return d.target.x; },
		y2: function(d) { return d.target.y; }
	});
	node.attr({
		cx: function(d) { return d.x; },
		cy: function(d) { return d.y; }
	})
}

function draw() {

	link = link.data(links);

	link.enter().insert("line", ".node")
				.attr("class", "link");

	link.style({
		"stroke-width": function(d) { return d.thickness }
	});

	node = node.data(nodes);

	node.enter().insert("circle")
				.on("click", nodeClickEvent)
				.on("mouseon", nodeClickEvent)
				.attr({
					class: "node"
				});

	node.attr({
		r: function(d) { return d.r }
	});

/*
	label = label.data(labels);

	label.enter().insert("text")
				.attr("class", ".label")
				.text(function(d) {

					return d.
				})
				*/

	force.start();

}
