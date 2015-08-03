/* Processing.JS sketch */
/* @pjs preload="heart.png","mask.png","down.png","left.png","right.png","up.png","block.png","maze-instructions.jpg", "maze-preface.jpg", "maze-preface2.jpg", "maze-start.jpg", "maze-end.jpg"; */

void setup()
{
   size(600,600);
   background(125);
   fill(255);
   noLoop();
   textFont(loadFont("monospace"), 14);
};

var scrollX = 0, scrollY = 0;

var TILE_WIDTH = 60, TILE_HEIGHT = 60;

frameRate(60);

var gameMap = [
// map 1 (58 x 24)
"+++++++++++++++++++++++++++++++++++++++++++++++++++++",
"+.....+++++.....T++++...T...+++++++.....T.....+++..T+",
"+.+++.+++++.+++++++++.+++++.+++++++.+++++++++.+++.+++",
"+...+.+++++T........+.+..T+......T....+.......+.T.+++",
"+++.+.+++++.+++++++.+.+.+++.+++++++++.+.+++++++.+++++",
"+++.+..T........+++.+.+.+++.+.........+.........+++++",
"+++.+++++++++++.+++.+.+.+++T+.+++++++++.+.+++.+++++++",
"+++.+++.T.+++++.T.....+.+++.+.......+++...+T+......T+",
"+++.+++.+.+++++.+++.+++.+++.+++++++.+++++.+.+.+++++.+",
"+++T+++.+.......+++.+++T...........T......+.+.+++++.+",
"+++.+++.+++.+++++++T+++++++++++.+.+++++++++.+.+++++.+",
"+++.+++...+.+T..........+++.....+...........+T+.....+",
"+++.+++.+.+.+++++++.+++.+++T+.+++.+++++++++.+.+.+++++",
"+++.....+.+.+...T...+++.....+.+++.+..T........+T+++++",
"+++++++++.+.+.+++++++++.+++++.+++.+.+++.+++++++.+++++",
"+........T+.+.......T...+++++....T+.+++.........+++++",
"+.+++++++++.+.+++++++++++++++.+++++.+++++++++++++++++",
"+.+....T....+..........T......+++++.......T.........+",
"+.+.++++++++++++.++++++++++++++++++++++++++++++++++.+",
"+T+........T.....+++++++++++++++++++++++++++++++++E.+",
"+++++++++++++++++++++++++++++++++++++++++++++++++++++"
];

var Walls = [];
var imgs = ["heart.png","mask.png"];
var tokens = [];
var counterMask = 0;
var counterHeart = 0;
var tokensName = ["Family","Love", "Support", "Friends", "Purpose", "Hope", "Exercise", "Music", "Relax"];
var masksName = ["Stress", "Trauma", "Social Expectations", "Chemical Imbalance", "Drugs","Unknown", "Negativity"];
var tokensDes = ["Turn to family who make you feel loved because they want to help.",
                 "Remember to love yourself before anything and continue to enjoy your hobbies.",
                 "Reaching out is not a sign of weakness, and it won’t mean you’re a burden to others.",
                 "Share your feelings with your friend because they care.",
                 "Allow yourself to be less than perfect.",
                 "Support groups can go a long way in reducing your sense of isolation.",
                 "It’s okay to feel sad. It may not even be in your control.",
                 "You can minimize this depression trigger if you know your limits and place boundaries on what you can and cannot do.",
                 "Cope with transitions in a healthy manner by acknowledging that what you are feeling is expected and normal. Don't isolate yourself.",
                 "'The reason we struggle with insecurity is because we compare our behind-the-scenes with everyone else's highlight reel.' - Steve Furtick",
                 "Talk with your health care professional to find ways to address drug abuse or dependency directly.",
                 "Sometimes you may be sad and you do not even know why." ,
                 "Exercise is considered one the best anti-depressants." ,
                 "Listen to music, for it provides opportunity for relaxation and appreciation." ,
                 "Relaxation, such as enough hours of sleep or yoga and meditation, reduces stress." ,
                 "Surround yourself with positivity."
];
var ttokens = [];

var Block = function(x,y,kind, red, green, blue){
    this.x = x;
    this.y = y;
    this.kind = kind;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.draw = function() {
      if (this.kind == "black") {
         PImage block = loadImage("block.png");
         image(block,this.x + scrollX, this.y + scrollY, 60, 60);
        }
      else{ 
         noStroke();
        fill(color(this.red, this.green, this.blue));
        rect(this.x + scrollX,this.y + scrollY,60,60);
      }
    };
    
}; 

var Player = function(x,y,color,width,height,i) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.i = i;
    this.changeChar = function(fileName) {
      this.i = fileName;
    };  
   this.draw = function() {
       PImage b = loadImage(this.i);
       image(b,this.x + scrollX, this.y + scrollY, this.width, this.height);
    };
};

var EndTile = function(x,y,color,width,height,kind) {
   this.x = x;
   this.y = y;
   this.kind = kind;
   this.color = color;
   this.width = width;
   this.height = height;
   this.draw = function() {
      noStroke();
      fill(this.color);
      rect(this.x + scrollX, this.y + scrollY, this.width, this.height);
   };
   
};

var Token = function(x,y,i,width,height,kind) {
   this.x=x;
   this.y=y;
   this.i=i;
   this.width=width;
   this.height=height;
   this.kind = kind;
   this.name = "";
   this.draw=function() {
      PImage b = loadImage(i);
      image(b,this.x + scrollX, this.y + scrollY, this.width, this.height);
   };
   this.changeName = function(s) {
      this.name = s;
   };
};

var textToken = function(name,x,y) {
   this.name = name;
   this.x = x;
   this.y = y;
   this.draw = function() {
      fill(0);
      text(this.name,this.x + scrollX, this.y + scrollY, 100, 200);
   };
   
   this.dialogue = function() {
      fill(70,130,180);
      rect(100,500,400,75);
      var txt = "";
      if (this.name == "Family") {
         txt = tokensDes[0];
      }
      else if (this.name == "Love") {
         txt = tokensDes[1];
        
      }
      else if (this.name == "Support") {
         txt = tokensDes[2];
      
      }
      else if (this.name == "Friends") {
         txt = tokensDes[3];
        
      }
      else if (this.name == "Purpose") {
         txt = tokensDes[4];
       
      }
      else if (this.name == "Hope") {
        txt = tokensDes[5];
       
      }
      else if (this.name == "Drugs") {
         txt = tokensDes[10];
         
      }
      else if (this.name == "Stress") {
         txt = tokensDes[7];
        
      }
      else if (this.name == "Trauma") {
        txt = tokensDes[8];
        
      }
      else if (this.name == "Social Expectations") {
        txt = tokensDes[9];
        
      }
      else if (this.name == "Chemical Imbalance") {
         txt = tokensDes[6];
         
      }
      else if (this.name == "Unknown") {
         txt = tokensDes[11];
        
      }
      
      else if (this.name == "Exercise") {
         txt = tokensDes[12];
      }
      
      else if (this.name == "Music") {
         txt = tokensDes[13];
      }

      else if (this.name == "Relax") {
         txt = tokensDes[14];
   
      }
      
      else if (this.name == "Negativity") {
         txt = tokensDes[15];
      }
      fill(255);
      text(txt ,110, 510, 400, 200);
   };

};

var end;

var createMap = function() {
    for (var row in gameMap) {
        for (var character in gameMap[row]){
            var xPos = character * TILE_WIDTH;
            var yPos = row * TILE_HEIGHT;
            if (gameMap[row][character] == "+"){
                //println("this is a block");
                var blockObj = new Block(xPos, yPos,"black", 0, 0, 0);
                Walls.push(blockObj);
            }
            else if (gameMap[row][character] == "."){
                var spaceObj = new Block(xPos, yPos, "white", 248,245,245);
                Walls.push(spaceObj);
            }
            else if (gameMap[row][character] == "E"){
               var e = new EndTile(xPos,yPos, color(204,102,255), 60, 60, "end");
               end = e;
               Walls.push(e);
            }
            
            else if (gameMap[row][character] == "T") {
                var spaceObj = new Block(xPos, yPos,"white",248,245,245);
                Walls.push(spaceObj);
                var randToken = imgs[round(random(imgs.length-1))];
               if (randToken == "mask.png") {
                     var tok = new Token(xPos, yPos, randToken, 60, 50, "mask");
                     tokens.push(tok);
                  }
               else {
                     var tok = new Token(xPos, yPos, randToken, 50, 50, "heart");
                     tokens.push(tok);   
               }
            }
          }
            
        }
};
var intensityLight = 35;
var changeBrighter = function() {
   for (i in Walls) {
      if (Walls[i].kind == "white" && Walls[i].red <= 255 - intensityLight) {
         Walls[i].red += intensityLight;
         Walls[i].green += intensityLight;
         Walls[i].blue += intensityLight;
      }
   }
};

var changeDarker() {
   for (i in Walls) {
      if (Walls[i].kind == "white" && Walls[i].red >= 0) {
         Walls[i].red -= intensityLight;
         Walls[i].green -= intensityLight;
         Walls[i].blue -= intensityLight;
      }
   }
};

var ended = false;
var checkEnd() {
   if (player1.x <= end.x + 30 && player1.x >= end.x && player1.y >= end.y && player1.y <= end.y + 30) {
      ended = true;
   }
   
}

var drawTokens = function() {
   time = millis();
   for (i in tokens) {
      if (tokens[i].name == "" && tokens[i] != 0) {
         tokens[i].draw();
      }else if (tokens[i].kind =="heart" && tokens[i] != 0) {
         var x = new textToken(tokens[i].name, tokens[i].x, tokens[i].y);
         ttokens.push(x);
         tokens[i] = 0;
      }
      else if ((tokens[i].kind =="mask" && tokens[i] != 0)) {
         var x = new textToken(tokens[i].name, tokens[i].x, tokens[i].y);
         ttokens.push(x);
         tokens[i] = 0;
      }
   }
};


var drawText = function() {
   for (i in ttokens) {
      ttokens[i].draw();
      ttokens[i].dialogue();
   }
}
var drawMap = function() {
    for (var elem in Walls){  
        var curr = Walls[elem];
        curr.draw();
    }
};


var upCollision = false;
var rightCollision = false;
var leftCollision = false;
var downCollision = false;
var pos = 0;

var tokenCollision = function(){
   for(elem in tokens){
      if (player1.y + player1.height/2 <= tokens[elem].y + 50 && player1.y + player1.height/2 >= tokens[elem].y && player1.x + player1.width/2 <= tokens[elem].x + 50 && player1.x + player1.width/2 >= tokens[elem].x) {
        if (tokens[elem].kind == "heart") {
            counterHeart++;
            changeBrighter();
            var randomName = round(random(tokensName.length-1));
            tokens[elem].changeName(tokensName[randomName]);
            return;
        }
        else {
         counterMask++;
         changeDarker();
         var randomMask = round(random(masksName.length-1));
         tokens[elem].changeName(masksName[randomMask]);
         return;
         
        }
      }
   }
};

var checkCollision = function(direction) {
   check = true;
   for(elem in Walls) {
      if (Walls[elem].kind == "black") {
         if (direction == "up" && player1.y <= Walls[elem].y + 76 && player1.y >= Walls[elem].y && player1.x + 30 >= Walls[elem].x && player1.x - 30 <= Walls[elem].x) {
         //if (direction == "up" && player1.y >= Walls[elem].y + 60 && player1.x + 30 >= Walls[elem].x && player1.x - 30 <= Walls[elem].x) {   
            //UP
            //orig: 70
            //if (player1.y <= Walls[elem].y + 60) {
                  upCollision = true;
                  pos = Walls[elem].y + 63;
                  break;
            //}
         //RIGHT
         }else if (direction == "right"  && player1.x + 30 >= Walls[elem].x-16 && player1.x + 30 <= Walls[elem].x + 60 && player1.y + 15 >= Walls[elem].y && player1.y + 15 <= Walls[elem].y+76) {
         //}else if (direction == "right"  && player1.x >= Walls[elem].x - 40 && player1.x + 30<= Walls[elem].x && player1.y + 30 >= Walls[elem].y && player1.y - 30 <= Walls[elem].y) {
            //if (player1.x >= Walls[elem].x - 40) {
               console.log("block's x pos: " + Walls[elem].x);
               console.log("player's x pos: " + player1.x);
               rightCollision = true;
               pos = Walls[elem].x - 33;
               break;
            //}
         //LEFT
         }else if (direction == "left" && player1.x>= Walls[elem].x && player1.x <= Walls[elem].x+76 && player1.y + 15 >= Walls[elem].y && player1.y + 15 <= Walls[elem].y + 76) {
         //}else if (direction == "left" && player1.x >= Walls[elem].x && player1.y + 30 >= Walls[elem].y && player1.y - 30 <= Walls[elem].y) {
            //if (player1.x <= Walls[elem].x + 70) {
               leftCollision = true;
               pos = Walls[elem].x + 63;
               break;
         //DOWN
         }else if (direction == "down" && player1.y + 30 <= Walls[elem].y + 60 && player1.y+30 >= Walls[elem].y - 16) {
            if (player1.x + 20 >= Walls[elem].x && player1.x + 20 <= Walls[elem].x + 60) {
               //}else if (direction == "down" && player1.y + 30 <= Walls[elem].y && player1.x + 30 >= Walls[elem].x && player1.x-30 <= Walls[elem].x) { 
                  //if (player1.y >= Walls[elem].y - 60) {
               downCollision = true;
               pos = Walls[elem].y - 33;
               break;
            }
         }
         
      }
   }
   
};

var player1= new Player(70, 70, color(0,0,255),30,30, "left.png");
var start = true;
var preface = false;
var preface2 = false;
var instruct = false;
var startGame = false;
PImage b;
void keyPressed()
{
   if (keyCode== 32 && instruct) {
      instruct = false;
      startGame = true;
   }
   if (startGame) {
      if (!ended) {
         if (keyCode == LEFT) {
            checkCollision("left");
            if (leftCollision) {
               player1.x = pos;
               leftCollision = false;
            }else {
               player1.x = player1.x - 16;
            }
            player1.changeChar("left.png");
          
         }
         else if (keyCode == RIGHT) {
            checkCollision("right");
            if (rightCollision) {
               player1.x = pos;
               rightCollision = false;
            }else {
               player1.x = player1.x + 16;
            }
            player1.changeChar("right.png");
         }else if (keyCode == UP) {
            checkCollision("up");
            if (upCollision) {
               player1.y = pos;
               upCollision = false;
            }else {
               player1.y = player1.y - 16;
            }
            player1.changeChar("up.png");
         }
          else if (keyCode == DOWN) {
            checkCollision("down"); 
            if (downCollision) {
               player1.y = pos;
               downCollision = false;
            }else {
               player1.y = player1.y + 16;
            }
            player1.changeChar("down.png");
         }
        
         background(0);  
         drawMap();
         drawTokens();
         drawText();
         player1.draw();
         scrollX = -player1.x + (width/2 - player1.width/2);
         scrollY = -player1.y + (height/2 - player1.height/2);
         tokenCollision();
         checkEnd();
      }else {
         PImage b = loadImage("maze-end.jpg");
         image(b,0,0,600,600);
      }
   }
   
   
   if (keyCode == 32 && preface2){
      preface2 = false;
      instruct = true;
      if (instruct) {
         b = loadImage("maze-instructions.jpg");
      }
   }
   
   if (keyCode == 32 && preface) {
      preface = false;
      preface2 = true;
      if (preface2) {
         b = loadImage("maze-preface2.jpg");
      }
   }
   
   if (keyCode == 32 && start) {
         preface = true;
         start = false;
         if (preface) {
           b = loadImage("maze-preface.jpg");
         }
   }
   if (!startGame) {
      image(b,0,0,600,600);
   }
};

//sets up game
void draw()
{
   noLoop();
   noCursor();
   if (start) {
      PImage b = loadImage("maze-start.jpg");
      image(b,0,0,600,600);
   }
   createMap();

};
