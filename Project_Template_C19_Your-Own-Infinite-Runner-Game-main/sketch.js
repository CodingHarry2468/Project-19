// Boy running from dog
// Coded by: Harkirat
//Purpose: Project 19

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy_Img, boy;
var dog_Img, dog;
var ground_Img;
var ground;
var invisibleGround;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score;
var gameOverImg,restartImg
var jumpSound, dieSound

function preload()
{
    boy_Img = loadAnimation('boy_running1-removebg-preview.png', 'boy_running2-removebg-preview.png', 'boy_running3-removebg-preview.png', 'boy_running4-removebg-preview.png', 'boy_running5-removebg-preview.png');
    dog_Img = loadAnimation('Dog_running_1-removebg-preview.png', 'Dog_running_2-removebg-preview.png', 'Dog_running_3-removebg-preview.png', 'Dog_running_4-removebg-preview.png', 'Dog_running_5-removebg-preview.png', 'Dog_running_6-removebg-preview.png', 'Dog_running_7-removebg-preview.png');
    ground_Img = loadImage('sidewalk.png');  
    cloudImage = loadImage("cloud.png");
    restartImg = loadImage("restart.png")
    gameOverImg = loadImage("gameOver.png")
  
    obstacle1 = loadImage("Scooter.png");
    obstacle2 = loadImage("Flowers.png");
    obstacle3 = loadImage("bicycle-orange.png");

    jumpSound = loadSound("jump.mp3")
    dieSound = loadSound("die.mp3")
}

function setup() 
{
    createCanvas(600,380);

    ground = createSprite(700,300);
    ground.addImage('ground', ground_Img);
    ground.x = ground.width/3;

    invisibleGround = createSprite(200,340,400,10);
    invisibleGround.visible = false;

    boy = createSprite(300,334);
    boy.scale = 0.4;
    boy.addAnimation('runningBoy',boy_Img);

    dog = createSprite(70,320);
    dog.addAnimation('runningDog', dog_Img);
    dog.scale = 0.27;

    gameOver = createSprite(300,100);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(300,140);
    restart.addImage(restartImg);

    gameOver.scale = 0.6;
    restart.scale = 0.6;

    obstaclesGroup = createGroup();
    cloudsGroup = createGroup();

    boy.setCollider("rectangle",0,0,boy.width,boy.height);
    
    score = 0;
  
}

function draw() 
{
    


    if(gameState === PLAY){

        gameOver.visible = false;
        restart.visible = false;
        
        ground.velocityX = -(4 + 3* score/100)
        //scoring
        score = score + Math.round(getFrameRate()/60);
       //score = score + Math.round(frameCount/60);
    
        
        if(score>0 && score%1000 === 0){
           checkPointSound.play() 
        }
        
        if (ground.x < 0){
          ground.x = ground.width/2;
        }
        
        //jump when the space key is pressed
        if(keyDown("space")&& boy.y >= 100) {
            boy.velocityY = -15;
            jumpSound.play();
        }
        
        //add gravity
        boy.velocityY = boy.velocityY + 0.7
      
        //spawn the clouds
        spawnClouds();
      
        //spawn obstacles on the ground
        spawnObstacles();
        
        if(obstaclesGroup.isTouching(boy)){
            jumpSound.play();
            gameState = END;
            dieSound.play()
          
        }
      }
    else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      
      ground.velocityX = 0;
      boy.velocityY = 0

      //set lifetime of the objects
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
     
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);    
    }
 
  //stop boy from falling down
  boy.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }

    if (ground.x < 0){
        ground.x = ground.width/2;
    }

   background("lightblue") 

   text("Score: "+ score, 50,200,);

   drawSprites()

  
}

function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();

  score = 0;
  
}

function spawnObstacles(){
    if (frameCount % 60 === 0){
      var obstacle = createSprite(800,335,5,10);
      obstacle.velocityX = -(6 + score/100);
      
       //generate random obstacles
       var rand = Math.round(random(1,3));
       switch(rand) {
         case 1: obstacle.addImage(obstacle1);
                 break;
         case 2: obstacle.addImage(obstacle2);
                 break;
         case 3: obstacle.addImage(obstacle3);
                 break;
         default: break;
       }
          
       obstacle.scale = 0.3;
       obstacle.lifetime = 300;
       obstaclesGroup.add(obstacle);
    }
   }
   
   function spawnClouds() {
     if (frameCount % 60 === 0) {
       var cloud = createSprite(600,120,40,10);
       cloud.y = Math.round(random(50,120));
       cloud.addImage(cloudImage);
       cloud.scale = 0.5;
       cloud.velocityX = -3;

       cloud.lifetime = 200;

       cloud.depth = boy.depth;
       boy.depth = boy.depth + 1;

       cloudsGroup.add(cloud);
     }
   }