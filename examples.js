
/*==============================================================
Sum Array Example (with precompute)
----------------------------------------------------------------
data: [1,2,3,4,5,6,7,8,9,10,11,12],
  
precompute: function(data){
  var d = [];
  var size = data.length
  for(var i=0; i<size; i++) {
    var begin =  i*size / NUM_NODE;
    var end = begin + size / NUM_NODE;
    d.push(data.slice(begin, end));
  }
  return d;
},

compute: function(data){
  var sum = 0, size = data.length;
  for(var i=0; i<size; i++) {
    sum += data[i];
  }
  return sum; 
},

postcompute: function(result) {
  var sum = 0;
  for(var i=0; i<NUM_NODE; i++) {
    sum += result[i];
  }
  return sum;
}
          
=================================================================*/




/*==============================================================
Matrix Mulitply Example
----------------------------------------------------------------


data: {
  'a': [ [1,2,3,4], [2,3,4,5], [3,2,1,0], [4,3,2,1] ],
  'b': [ [1,2,3,4], [2,3,4,5], [3,4,5,6], [4,5,6,7] ]
},

compute: function(m) {
    var n = m.a.length;
    var c=[];
    var p=n/NUM_NODE; // size of chunk
    for (var i = 0; i<p; i++) {
      var tc = [];
      for (var j = 0; j<n; j++) {
        var ts = 0;
        for (var k = 0; k<n; k++) {
          ts += m.a[i+NODE_ID*p][k]*m.b[k][j];
        }
        tc.push(ts);
      }
      c.push(tc);
    }
    return c;
},

postcompute: function(result) {
  var r = result[0];
  for(var i=0; i<NUM_NODE; i++) {
    r = r.concat(result[i+1]);
  }
  return r;
}

=================================================================*/