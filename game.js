const canvas=document.querySelector("#game");
const game=canvas.getContext("2d");
const buttonup=document.querySelector("#up");
const buttondown=document.querySelector("#down");
const buttonright=document.querySelector("#right");
const buttonleft=document.querySelector("#left");
const buttonreset=document.querySelector("#reset_game");
const spanLives=document.querySelector("#lives");
const spanTime=document.querySelector("#time")
const spanRecord=document.querySelector("#record");
const pResult=document.querySelector("#result")


let canvasSize;
let elementsize;
let level=0;
let lives=3;
let timestart;
let timeplayer;
let timeinterval;
let newrecord;

const playerposition={
    x:undefined,
    y:undefined,
};
const giftposition={
    x:undefined,
    y:undefined,
};
let enemiesposition=[];

window.addEventListener("load",SetCanvasSize);
window.addEventListener("resize",SetCanvasSize);
function SetCanvasSize(){
    if(window.innerHeight>window.innerWidth){
        canvasSize=window.innerWidth*0.7;
    }
    else{
        canvasSize=window.innerHeight*0.7;
    }

    canvasSize=Number(canvasSize.toFixed(0));


    canvas.setAttribute("width",canvasSize);
    canvas.setAttribute("height",canvasSize);

    elementsize=canvasSize/10;
    playerposition.x=undefined;
    playerposition.y=undefined;
    startgame();
}   


function startgame(){
    //game.fillRect(0,0,100,100);
    /*
    game.clearRect(0,0,50,50);
    game.fillText("Platzi",50,50);
    game.fillStyel="purple";
    game.font="25px Verdana";
    game.textAlign="start";
    */
    game.font=elementsize+"px Verdana";
    game.textAlign="end";
    const map=maps[level];
    if(!map){
        gamewin()
        return;
    }
    if(!timestart){
        timestart=Date.now();
        timeinterval=setInterval(showTime,100);
        showrecord();
    }
    const mapRows=map.trim().split("\n");
    const mapRowsCol=mapRows.map(row=>row.trim().split(""));
    console.log({map,mapRows,mapRowsCol});

   showLives();

    enemiesposition=[];
    game.clearRect(0,0,canvasSize,canvasSize);
    mapRowsCol.forEach((row,rowI) => {
        row.forEach((col,colI)=>{
            const emoji=emojis[col];
            const positionx=elementsize*(colI+1);
            const positiony=elementsize*(rowI+1);
            if (col=="O"){
                if(!playerposition.x && !playerposition.y){
                    playerposition.x=positionx;
                    playerposition.y=positiony;
                    console.log({playerposition});
                }
            }
            else if(col=="I"){
                giftposition.x=positionx;
                giftposition.y=positiony;
            }
            else if(col=="X"){
                enemiesposition.push({
                    x:positionx,
                    y:positiony,
                })
            }
            game.fillText(emoji,positionx,positiony);
        })
    });
    moveplayer();
    /*
    for(let row=1;row<=10;row++){
        for(let col=1;col<=10;col++){
            game.fillText(emojis[mapRowsCol[row-1][col-1]],col*elementsize,row*elementsize);
        }

    }
    */
}

function moveplayer(){
    const giftCollisionx=playerposition.x.toFixed(3)==giftposition.x.toFixed(3);
    const giftCollisiony=playerposition.y.toFixed(3)==giftposition.y.toFixed(3);
    const giftCollision=giftCollisionx && giftCollisiony;
    if(giftCollision){
        levelwin();
    }
    const enemycollision=enemiesposition.find(enemy=>{
        const enemycollisionx=enemy.x.toFixed(3)==playerposition.x.toFixed(3);
        const enemycollisiony=enemy.y.toFixed(3)==playerposition.y.toFixed(3);
        return enemycollisionx && enemycollisiony;
    });
    if(enemycollision){
        levelfail();
    }
    game.fillText(emojis["PLAYER"],playerposition.x,playerposition.y);
}

function levelwin(){
    console.log("subiste de nivel")
    level++;
    startgame();
}
function levelfail(){
    lives--;
    if(lives<=0){
        level=0;
        lives=3;
        timestart=undefined;
    }
    playerposition.x=undefined;
    playerposition.y=undefined;
    startgame();
}

function gamewin(){
    console.log("gamewin");
    clearInterval(timeinterval);

    const recordTime=localStorage.getItem("record_time")
    const playertime=Date.now()-timestart;

    if(recordTime){
        if(recordTime>playertime){
            localStorage.setItem("record_time",playertime);
            pResult.innerHTML="superaste el record";
        }
        else{
            pResult.innerHTML="no superaste el record";
        }
    }
    else{
        localStorage.setItem("record_time",playertime);
    }
    
}

function showLives(){
    const heartsArray=Array(lives).fill(emojis["HEART"])
    spanLives.innerHTML=" ";
    heartsArray.forEach(heart=>spanLives.append(heart));
}

function showTime(){
    spanTime.innerHTML=Date.now()-timestart;
}

window.addEventListener("keydown",movebykeys);
buttonup.addEventListener("click",apretoarriba);
buttondown.addEventListener("click",apretoabajo);
buttonright.addEventListener("click",apretoderecha);
buttonleft.addEventListener("click",apretoizquierda);
buttonreset.addEventListener("click",reseteojuego);

function reseteojuego(){
    location.reload();
}

function showrecord(){
    spanRecord.innerHTML=localStorage.getItem("record_time")
}

function movebykeys(event){
    if(event.key=="ArrowUp"){
        apretoarriba();
    }
    else if(event.key=="ArrowDown"){
        apretoabajo();
    }
    
    else if(event.key=="ArrowRight"){
        apretoderecha();
    }
    else if(event.key=="ArrowLeft"){
        apretoizquierda();
    }
}

function apretoarriba(){
    console.log("arriba");

    if((playerposition.y-elementsize)<elementsize){
        console.log("OUT")
    }
    else{
        playerposition.y-=elementsize;
        startgame();
    }
}
function apretoabajo(){
    console.log("abajo");
    if((playerposition.y+elementsize)>canvasSize){
        console.log("OUT")
    }
    else{
        playerposition.y+=elementsize;
        startgame();
    }

}
function apretoderecha(){
    console.log("derecha");
    if((playerposition.x+elementsize)>canvasSize){
        console.log("OUT")
    }
    else{
        playerposition.x+=elementsize;
        startgame();
    }

}
function apretoizquierda(){
    console.log("izquierda");

    if((playerposition.x-elementsize)<elementsize){
        console.log("OUT")
    }   	
    else{
        playerposition.x-=elementsize;
        startgame();
    }

}  









