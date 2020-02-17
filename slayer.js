
var app = {};
app.data = {}
app.data.bosses = [];
app.data.magicFind = 0;
app.data.killsPerClick = 1;
app.data.dropMessage = function(boss,lootItem){
  var content = "";
  var veryRareColor = "rgb(73,72,213)";
  var secondaryDropName = lootItem.name;
  if(lootItem.name=="Smite VI Book"||lootItem.name=="Bane of Arthropods VI Book"||lootItem.name=="Critical VI Book"){
    veryRareColor="#AA00AA";
    secondaryDropName = "Enchanted Book";
  }
  if(lootItem.rarity == "crazyRare") content = content + "<p style='color:#FF55FF' class='inline-block-child'>Crazy Rare Drop!&#10240</p>";
  if(lootItem.rarity == "veryRare") content = content + "<p style='color:"+veryRareColor+"' class='inline-block-child'>Very Rare Drop!&#10240</p>";
  if(lootItem.rarity == "rare") content = content + "<p style='color:rgb(72,212,212)' class='inline-block-child'>Rare Drop!&#10240</p>";
  content = content + "<p style='color:rgb(148,148,148)' class='inline-block-child'>(</p>"
  +"<p style='color:"+lootItem.color+"' class='inline-block-child'>"+secondaryDropName+"</p>"
  +"<p style='color:rgb(148,148,148)' class='inline-block-child'>)</p>";
  if(boss.mf!=0) content = content + "<p style='color:rgb(72,212,212)' class='inline-block-child'>&#10240(+"+boss.mf+"% Magic Find!)</p>"
  return(content);
}
app.data.lootItem = function(name, chance, value, dropType, rarity, color){
  this.name = name;
  this.chance = chance;
  this.value = value;
  this.dropType = dropType;
  this.rarity = rarity;
  this.color = color;
}
app.data.zombieLoot = [
  new app.data.lootItem("Scythe Blade",.000538,35000000,"secondaryDrop","crazyRare","#FFAA00"),
  new app.data.lootItem("Beheaded Horror",.001615,400000,"secondaryDrop","crazyRare","#AA00AA"),
  new app.data.lootItem("&#11049 Snake Rune",.00323,500000,"runeDrop","crazyRare","#55FF55"),
  new app.data.lootItem("Smite VI Book",.01,50000,"secondaryDrop","veryRare","#FFFFFF"),
  new app.data.lootItem("Revenant Catalyst",.01,100000,"secondaryDrop","veryRare","rgb(0,0,0)"),
  new app.data.lootItem("Undead Catalyst",.01,10000,"secondaryDrop","veryRare","rgb(0,0,0)"),
  new app.data.lootItem("&#11049 Pestilence Rune",.05,5000,"runeDrop","veryRare","rgb(0,0,0)"),
  new app.data.lootItem("Foul Flesh",.2,25000,"secondaryDrop","rare","##5555FF"),
  new app.data.lootItem("Revenant Flesh",1,234,"mainDrop","common","#555555")];

app.data.spiderLoot = [
  new app.data.lootItem("Digested Mosquito",.000538,30000000,"secondaryDrop","crazyRare","#FFAA00"),
  new app.data.lootItem("Tarantula Talisman",.001615,8000000,"secondaryDrop","crazyRare","#AA00AA"),
  new app.data.lootItem("Fly Swatter",.00323,200000,"secondaryDrop","crazyRare","#AA00AA"),
  new app.data.lootItem("Bane of Arthropods VI Book",.01,5000,"secondaryDrop","veryRare","#FFFFFF"),
  new app.data.lootItem("Spider Catalyst",.01,300000,"secondaryDrop","veryRare","rgb(0,0,0)"),
  new app.data.lootItem("&#11049 Bite Rune",.05,10000,"runeDrop","veryRare","rgb(0,0,0)"),
  new app.data.lootItem("Toxic Arrow Poison",.2,2000,"secondaryDrop","rare","rgb(0,0,0)"),
  new app.data.lootItem("Tarantula Web",1,468,"mainDrop","common","rgb(0,0,0)")];

app.data.wolfLoot = [
  new app.data.lootItem("Overflux Capacitor",.000385,70000000,"secondaryDrop","crazyRare","#AA00AA"),
  new app.data.lootItem("Grizzly Bait",.00538,2500000,"secondaryDrop","crazyRare","rgb(0,0,0)"),
  new app.data.lootItem("&#11049 Couture Rune",.00323,500000,"runeDrop","crazyRare","#FFAA00"),
  new app.data.lootItem("Red Claw Egg",.001154,1500000,"secondaryDrop","crazyRare","#AA00AA"),
  new app.data.lootItem("Critical VI Book",.01,400000,"secondaryDrop","veryRare","#FFFFFF"),
  new app.data.lootItem("&#11049 Spirit Rune",.05,25000,"runeDrop","veryRare","#55FFFF"),
  new app.data.lootItem("Hamster Wheel",.2,20000,"secondaryDrop","rare","#5555FF"),
  new app.data.lootItem("Wolf Tooth",1,625,"mainDrop","common","#AAAAAA")];

app.ui = {};

app.data.boss = function(name){
  this.slayer = name;
  this.lootTable="";
  if(name=="wolf"){
    this.lootTable=app.data.wolfLoot
  }else if(name=="spider"){
    this.lootTable=app.data.spiderLoot
  }else if(name=="zombie"){
    this.lootTable=app.data.zombieLoot
  }
  this.mainDrop = "";
  this.mainAmount = 0;
  this.secondaryDrop = "";
  this.secondaryAmount = 0;
  this.secondaryRNG = 0;
  this.runeDrop = "";
  this.runeRNG = 0;
  this.mf = 0;
}

app.data.getDrop = function(table, dropType, rng){
  var candidates = [];
  for (var i = 0; i < table.length; i++) {
    if(table[i].chance>((rng/(100.0+app.data.magicFind))*100.0)){
      if(table[i].dropType==dropType){
        candidates.push(table[i]);
      }
    }
  }
  if(candidates.length>=1){
    return(candidates[Math.floor(Math.random() * candidates.length)]);
  }else{
    return(undefined);
  }
}

app.ui.slayBoss = function(name){
  app.data.magicFind = $("#magicFindInput").val();
  app.data.killsPerClick = $("#KPCInput").val();
  for (var i = 0; i < app.data.killsPerClick; i++) {
  var boss = new app.data.boss(name);
  var lootTable = boss.lootTable;

  boss.mainDrop = lootTable[lootTable.length-1];
  if(name=="wolf"){
    boss.mainAmount = 50+16+Math.round(Math.random()*14);
  }else if(name=="spider"){
    boss.mainAmount = 52+16+Math.round(Math.random()*12);
  }else if(name=="zombie"){
    boss.mainAmount = 50+16+Math.round(Math.random()*14);
  }
  boss.secondaryRNG=Math.random();
  boss.secondaryDrop = app.data.getDrop(lootTable,"secondaryDrop",boss.secondaryRNG);
  if(typeof(boss.secondaryDrop)!="undefined"){
  if(boss.secondaryDrop.name=="Hamster Wheel"){
    boss.secondaryAmount = 4;
  }else if(boss.secondaryDrop.name=="Foul Flesh"){
    boss.secondaryAmount = 2;
  }else if(boss.secondaryDrop.name=="Toxic Arrow Poison"){
    boss.secondaryAmount = 60 + Math.round(Math.random()*4);
  }else{
    boss.secondaryAmount = 1;
  }
  boss.mf = app.data.magicFind;
  }

  boss.runeRNG = Math.random()
  boss.runeDrop = app.data.getDrop(lootTable,"runeDrop",boss.runeRNG);

  app.data.bosses.push(boss);
  }
  app.ui.displayRecents();
}

app.ui.displayRecents = function(){
  $("#recentDrops").html("");
  for (var i = app.data.bosses.length-1; i > 0; i--) {
    var boss = app.data.bosses[i];
    $("#recentDrops").append($("<div>")
          .html(boss.mainDrop.name + " x"+boss.mainAmount).addClass("parent"));
    if(boss.secondaryAmount>0){
      $("#recentDrops").append($("<div>")
            .html(app.data.dropMessage(boss,boss.secondaryDrop)).addClass("parent"));
    }
    if(typeof(boss.runeDrop)!="undefined"){
      $("#recentDrops").append($("<div>")
            .html(app.data.dropMessage(boss,boss.runeDrop)).addClass("parent"));
    }
    $("#recentDrops").append($("<div>")
          .html("<p style='color:#555555'>---------</p>").addClass("parent"));
  }
}
