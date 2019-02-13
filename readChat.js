var node_data = JSON.parse(node_data);
var chats = JSON.parse(chat);
var time = 0;

// 定数 名前はてきとう

const MIN_NODE_SIZE = 5; // ノードの最小サイズ
const SPERKER_INCREASE_SIZE = 0.1; //発言者がどのくらい大きくなるか
const TIME_DECREACE_NODE_SIZE = 0; // 発言しないものがどのくらい小さくなるか
const DEFAULT_NODE_X = 400;
const DEFAULT_NODE_Y = 150;
const DEFAULT_LINK_DISTANCE = 250;
const DEFAULT_THICKNESS = 1;
const INCREASE_THICKNESS = 0.25;

// メイン
function time_passes(){
		
	var comment = time + '/' + chats[chats.length - 1].order + ' ';
	d3.select("p.comment").text(comment);

	read_chat(time);

	time += 1;

}



// 以下グラフの更新について

// あるノードのid -> nodesのindexに変換する関数
// （linksのsource, targetにはidでなくnodesのindexを与えてやる必要があるため、）
function id_to_index(received_id){
	return nodes.findIndex(node => node.id == received_id);
}

// 地点timeのchat内容を読み込んでlinks, nodesにpushする関数
function read_chat(time){

	var append_node = [],
		append_link = [];

	// 現timeの発言を取り出す
	var now_comment = chats.filter(value => value.order == time);

	// まずnodeの更新
	now_comment.forEach( function (com, key){
		if(key == 0){
			append_node.push({"id": com['from_id']});
		}
		if(com['to_id'] != -1){
			append_node.push({"id": com['to_id']});
		}
	});

	nodes.forEach( function(nod, key) {
		check = append_node.findIndex(i => i.id == nod.id);
		if(check == -1){
			// 発言していないノードは縮小していく
			nodes[key].r = Math.max( MIN_NODE_SIZE, (nod.r - TIME_DECREACE_NODE_SIZE));
		}else{
			nodes[key].r += SPERKER_INCREASE_SIZE;
			append_node.splice(check, 1);
		}
	});

	append_node.forEach( function(nod, key) {
		nodes.push({"id": nod.id, "r": MIN_NODE_SIZE});
	});

	// labelの更新


	// linkの更新
	now_comment.forEach( function (com, key){
		if(com['to_id'] != -1){
			append_link.push({"source": id_to_index(com['from_id']), "target": id_to_index(com['to_id'])});
		}
	});

	links.forEach( function(lnk, key) {
		check = append_link.findIndex( value => value['source'] == lnk['source'].index && value['target'] == lnk['target'].index);
		if(check == -1){
			// 追加のないリンクには特に何もしない
		}else{
			links[key].thickness += INCREASE_THICKNESS;
			console.log(links[key].length);
			links[key].length = Math.floor(links[key].length * 0.5);
			console.log(links[key].length);
			append_link.splice(check, 1);
		}
	});

	append_link.forEach( function(lnk, key) {
		if(lnk['source'] > lnk['target']){
			links.push({"source": lnk['target'], "target": lnk['source'], "length": DEFAULT_LINK_DISTANCE, "thickness": DEFAULT_THICKNESS});
		} else {
			links.push({"source": lnk['source'], "target": lnk['target'], "length": DEFAULT_LINK_DISTANCE, "thickness": DEFAULT_THICKNESS});
		}
	});


	// 時間を進める
	time += 1;

	// 画面の更新
	draw();

}

draw();


/* メモ
	
	・バグみっけたときのメモ
	 idとindexがずれていると問題が起こる
	 ↑data bindingではindexを用いてnode等とlinkを紐づけているから、そこがずれているとエラーが起こる？たぶん
	 （参考）https://stackoverflow.com/questions/30492593/when-binding-data-in-d3-what-does-the-index-represent
	 ->（このプログラム）append_linkの部分で、idとindexが等しくないことによりエラーが起きた
	（chatデータで扱っているのはfrom_idとto_idというidだが、forceがlinks内のsource, targetで読みに行くのはindexだから）


	・weightはnodeに接続されているlinkの数
	 linkが追加されるたびに内的に更新されている

*/