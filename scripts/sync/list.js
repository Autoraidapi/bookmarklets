(function(cache){

    var io = prompt('exit to quit');

    while(io !== 'exit'){
        if(io === 'ls'){ return cache; }
        else if(io === 'add'){ add(); }
        else if(io === 'remove'){ remove(); }
        io = prompt('exit to quit');
    }

    function add(){
        var io = prompt();
        cache.push(io);
    }

    function remove(){

    }

})([]);