


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

	delete: function(socket_id){
        var index = -1;
		for(var i=0; i < this.list.length; i++){
		    if(socket_id == this.list[i].socket_id) index = this.list[i].id;
		};

		if(index>-1) this.list.splice(index, 1);
	},

	get: function(key) {
		var index = -1
		for(var i=0; i < this.list.length; i++){
		    if( key == this.list[i].ip || key == this.list[i].socket_id) index = this.list[i].id;
		};

		return index;
	}

};


exports.program = {

	decode: function(obj) {

	    return JSON.parse(obj, function (key, value) {
	      var prefix;

	      if (typeof value != 'string') {
	        return value;
	      }
	      if (value.length < 8) {
	        return value;
	      }

	      prefix = value.substring(0, 8);

	      if (prefix === 'function') {
	        return eval('(' + value + ')');
	      }
	      if (prefix === '_PxEgEr_') {
	        return eval(value.slice(8));
	      }

	      return value;
	    });

	}
}


