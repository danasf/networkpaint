;(function() {

    var curX, curY;

    // socket io
    var socket = io.connect('http://localhost:4000');
    socket.on('message', function(data) {
        console.log(data);
        socket.emit('event', {
            my: 'data'
        });
    });
    socket.on('newLine', function(d) {
        console.log(d);
        board.drawLine(d.x1, d.y1, d.x2, d.y2, d.color, d.size);
    });

    socket.on('erase', function() {
        board.clear();
    });

    socket.on('chat', function(d) {
        chat.messages.innerHTML.appendChild("<p>")
    });

    var board = new WhiteBoard(800, 1000);
    var chat = new Chat();

    // add some listeners
    board.canvas.addEventListener("mousedown", function(mouse) {
        board.isDrawing = true;
        board.context.beginPath();
        startX = mouse.pageX - board.canvas.offsetLeft;
        startY = mouse.pageY - board.canvas.offsetTop;
        board.context.moveTo(startX, startY);
    });

    board.canvas.addEventListener("mouseup", function(mouse) {
        board.isDrawing = false;
        //board.context.closePath();
        board.context.stroke();

    });

    board.canvas.addEventListener("mousemove", function(mouse) {
        if (board.isDrawing) {

            curX = mouse.pageX - board.canvas.offsetLeft;
            curY = mouse.pageY - board.canvas.offsetTop;
            board.context.lineTo(curX, curY);
            board.context.moveTo(curX, curY);

            //board.context.stroke();
            socket.emit("newLine", {
                x1: startX,
                y1: startY,
                x2: curX,
                y2: curY,
                color: board.context.strokeStyle,
                size: board.context.lineWidth
            });
            startX = curX;
            startY = curY;
        }

    });



    // controls

    document.getElementById("eraser").addEventListener("click", function() {
        board.clear();
    }, false);

    document.getElementById("color").addEventListener("change", function(e) {
        if (e.target.value.match(/([0-9A-F]){6}/i) != null) {
            console.log("New Color:", e.target.value);
            board.context.strokeStyle = e.target.value;
        }
    }, false);

    document.getElementById("stroke").addEventListener("change", function(e) {
        console.log("New Width:", e.target.value);
        board.context.lineWidth = e.target.value;
    }, false);

    // white board

    function WhiteBoard(h, w) {

        // init the canvas and basic settings
        this.canvas = document.getElementById("canvas");
        this.canvas.height = h;
        this.canvas.width = w;
        this.context = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.context.fillStyle = "solid";
        this.context.strokeStyle = "#ff0000";
        this.context.lineWidth = 5;
        this.context.lineCap = 'round';
    }

    WhiteBoard.prototype.clear = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    WhiteBoard.prototype.drawLine = function(x1, y1, x2, y2, color, size) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.strokeStyle = color;
        this.context.lineWidth = size;
        this.context.lineTo(x2, y2);
        this.context.stroke();

    }

    // chat

    function Chat() {
        this.message = document.getElementById("chatbox");
        this.mytext = document.getElementById("chattext");
        this.button = document.getElementById("sendMessage");
    }

})();