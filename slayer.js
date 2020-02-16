
var app = {};
app.data = {}
app.data.bosses = [];
app.data.magicFind = 0;
app.data.killsPerClick = 1;
app.data.lootItem = function(name, chance, value, dropType){
  this.name = name;
  this.chance = chance;
  this.value = value;
  this.dropType = dropType;
}
app.data.zombieLoot = [
  new app.data.lootItem("Scythe Blade",.000538,35000000,"secondaryDrop"),
  new app.data.lootItem("Beheaded Horror",.001615,400000,"secondaryDrop"),
  new app.data.lootItem("Snake Rune",.00323,500000,"runeDrop"),
  new app.data.lootItem("Smite VI Book",.01,50000,"secondaryDrop"),
  new app.data.lootItem("Revenant Catalyst",.01,100000,"secondaryDrop"),
  new app.data.lootItem("Undead Catalyst",.01,10000,"secondaryDrop"),
  new app.data.lootItem("Pestilence Rune",.05,5000,"runeDrop"),
  new app.data.lootItem("Foul Flesh",.2,25000,"secondaryDrop"),
  new app.data.lootItem("Revenant Flesh",1,234,"mainDrop")];

app.data.spiderLoot = [
  new app.data.lootItem("Digested Mosquito",.000538,30000000,"secondaryDrop"),
  new app.data.lootItem("Tarantula Talisman",.001615,8000000,"secondaryDrop"),
  new app.data.lootItem("Fly Swatter",.00323,200000,"secondaryDrop"),
  new app.data.lootItem("Bane of Arthropods VI Book",.01,5000,"secondaryDrop"),
  new app.data.lootItem("Spider Catalyst",.01,300000,"secondaryDrop"),
  new app.data.lootItem("Bite Rune",.05,10000,"runeDrop"),
  new app.data.lootItem("Toxic Arrow Poison",.2,2000,"secondaryDrop"),
  new app.data.lootItem("Tarantula Web",1,468,"mainDrop")];

app.data.wolfLoot = [
  new app.data.lootItem("Overflux Capacitor",.000385,70000000,"secondaryDrop"),
  new app.data.lootItem("Grizzly Bait",.00538,2500000,"secondaryDrop"),
  new app.data.lootItem("Couture Rune",.00323,500000,"runeDrop"),
  new app.data.lootItem("Red Claw Egg",.001154,1500000,"secondaryDrop"),
  new app.data.lootItem("Critical VI Book",.01,400000,"secondaryDrop"),
  new app.data.lootItem("Spirit Rune",.05,25000,"runeDrop"),
  new app.data.lootItem("Hamster Wheel",.2,20000,"secondaryDrop"),
  new app.data.lootItem("Wolf Tooth",1,625,"mainDrop")];

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
  this.runeDrop = "";
}

app.data.getDrop = function(table, dropType, rng){
  var candidates = [];
  for (var i = 0; i < table.length; i++) {
    if(table[i].chance*(100.0+app.data.magicFind)/100.0>rng){
      if(table[i].dropType == dropType){
        candidates.push(table[i]);
      }
    }
  }
  if(candidates.length>=1){
    return(candidates[Math.floor(Math.random() * candidates.length)]);
  }
}

app.ui.slayBoss = function(name){
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

  boss.secondaryDrop = app.data.getDrop(lootTable,"secondaryDrop",Math.random());
  if(typeof(boss.secondaryDrop)!="undefined"){
  if(boss.secondaryDrop.name=="Hamster Wheel"){
    boss.secondaryAmount = 4;
  }else if(boss.secondaryDrop.name=="Foul Flesh"){
    boss.secondaryAmount = 2;
  }else if(boss.secondaryDrop.name=="Toxic Arrow Poison"){
    boss.secondaryAmount = 60 + Math.round(Math.random()*4);
  }
  }

  boss.runeDrop = app.data.getDrop(lootTable,"runeDrop",Math.random());

  app.data.bosses.push(boss);
  app.ui.displayRecents();
}

app.ui.displayRecents = function(){
  $("#recentDrops").html('');
  for (var i = app.data.bosses.length-1; i > 0; i--) {
    var boss = app.data.bosses[i];
    var bossLoot = $("<p>")
          .append(boss.mainDrop.name + " x"+boss.mainAmount);
    $("#recentDrops").append(bossLoot);
  }
}
