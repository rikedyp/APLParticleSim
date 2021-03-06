var posQueue = [];

var Rrunning=0;
var requesting=0;
var Rtimer;

function StartStop(){
    if (posQueue==[]){
        new jBox("Modal", {"content":"<span>Run the script before starting the simulation<\/span>","onInit":function() { this.open(); }});
    }
    if (!Rrunning){
        Rnext();
        //top.frames[0].Trun();
    }
    else {
        clearTimeout(Ttimer);
        //top.frames[0].Tstop();
    }
    Rrunning = !Rrunning;
}

function Rnext() {
    RenderCanvas();
    if (!requesting && posQueue.length < 150) {
        requesting=1;
        var data = new FormData();
        data.append("_callback", "Tick");
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "/LJmelt.mipage", true);
        xhr.setRequestHeader("isAPLJax", true);
        xhr.onreadystatechange = function() {                                   
            if (this.readyState == 4 && this.status == 200) {                                       
                APLJaxReturn(eval(this.responseText));
                requesting=0;                                  
             }};                               
        xhr.send(data);

    }
    
    Ttimer = setTimeout("Rnext()", 17);
}


function RenderCanvas() {
    if (posQueue.length === 0) {return;}

    var pos = posQueue.shift() 
    var c = document.getElementById("viewport");
    var ctx = c.getContext("2d");
    ctx.width = 300
    ctx.height = 300
    var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");

    ctx.clearRect(0, 0, c.width, c.height);
    pos.forEach(function(pos){
        ctx.beginPath();
        ctx.arc(pos[0]*c.width,pos[1]*c.height,1,0,2*Math.PI);
        ctx.closePath()
        
        ctx.fillStyle='white';
        //ctx.fillStyle = grd;
        ctx.fill();})
}