//Create variables here
var dog, happyDog, dogImage, dogImage1;
var database, foodS, foodStock;
var foodObj, fedTime, lastFed;
var feed, addFood;
var gameState, readState;
var garden, washRoom, bedRoom;
var currentTime;
function preload()
{
	//load images here
  dogImage=loadImage("images/dogImg.png");
  dogImage1=loadImage("images/dogImg1.png");
  garden=loadImage("images/Garden.png");
  washRoom=loadImage("images/Wash Room.png");
  bedRoom=loadImage("images/Bed Room.png");

}

function setup() {
	createCanvas(1000, 400);
  foodObj=new Food();
  database=firebase.database();
  fedTime=database.ref("feedTime")
fedTime.on("value", function(data){
  lastFed=data.val();
  console.log(lastFed);
})
  
  dog=createSprite(250,270,40,40)
  dog.addImage(dogImage);
  dog.scale=0.15;
  foodStock=database.ref("food");
  foodStock.on("value", readStock);
  readState=database.ref("gameState");
  readState.on("value", function(data){
    gameState=data.val();
  });

  textSize(20);
  feed=createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  addFood=createButton("Add Food")
  addFood.position(800,95);
  addFood.mousePressed(addFoods)
  
}

function draw() {  
background(46,139,87);
//foodObj.display();
/*fedTime=database.ref("feedTime")
fedTime.on("value", function(data){
  lastFed=data.val();
})
*/
  
  fill("white");
  textSize(15);
  if(lastFed>=11 && lastFed<12){
 text("lastFed:"+lastFed%12+"PM", 350, 30)
}
else if(lastFed===12){
  text("lastFed:"+lastFed+"PM", 350, 30)
}
else{ 
   
  text("lastFed:"+lastFed+"AM", 350, 30)
 }
 currentTime=hour();
 if(currentTime===(lastFed+1)){
    foodObj.garden();
    update("playing")
 }
 else if(currentTime===(lastFed+2)){
  foodObj.bedRoom();
  update("sleeping")
 }
 
 else if(currentTime===(lastFed+2) && currentTime<=(lastFed+4)){
  foodObj.washRoom();
  update("bathing")
 }else{
   update("hungry");
   foodObj.display();
 }
 if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
 }else{
  feed.show();
  addFood.show();
  dog.addImage(dogImage);
 }
 drawSprites();

}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}
function feedDog(){
  dog.addImage(dogImage1);
  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0)
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  }
  database.ref("/").update({
    food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}
function addFoods(){
  foodS++
  database.ref('/').update({
    food:foodS
  })
}
function update(state){
  database.ref().update({
    gameState:state
  })
}
