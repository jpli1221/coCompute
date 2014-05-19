


exports.nodes = {

	list: [], 

	isAdded: function(node) {
    
        var exist = false;
        for(var i=0; i < this.list.length; i++){
           if(node.ip == this.list[i].ip) exist = true;
        };

        return exist;

	},

	add: function(node){
        //var index = this.list.indexOf(node);
		//if(index<0) this.list.push(node);

        if(this.isAdded(node) == false) this.list.push(node);

	},

	delete: function(node){
        var index = -1;
		for(var i=0; i < this.list.length; i++){
		    if(node.ip == this.list[i].ip) index = this.list[i].id;
		};

		if(index>-1) this.list.splice(index, 1);
	}

};


