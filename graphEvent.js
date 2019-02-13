// クリックしているやつとそれに接続されているやつ以外にhiddenクラスを付ける
function nodeClickEvent(d){
	information.text(get_label_from_id(d.id));

	// 相手表示

	conneted_nodes = links.filter(value => value.source.id == d.id || value.target.id == d.id);
	console.log(conneted_nodes);

	output_text = "";

	conneted_nodes.sort(function(a, b) {
		if (a.count > b.count) return 1;
		if (b.count > a.count) return -1;
		return 0;
	})
};