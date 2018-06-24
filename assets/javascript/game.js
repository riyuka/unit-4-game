var characters = { 
    'Ootengu': {
    name: 'Ootengu',
    hp: 150,
    att: 8,
    attBack: 20,
    imgUrl: './assets/images/charA.jpeg'
    },

    'Yuki Onna': {
    name: 'Yuki Onna',
    hp: 120,
    att: 6,
    attBack: 20,
    imgUrl: './assets/images/charB.jpeg'
    },

    'Momiji': {
    name: 'Momiji',
    hp: 140,
    att: 5,
    attBack: 12,
    imgUrl: './assets/images/charC.jpeg'
    },

    'Kyonshi Ani': {
    name: 'Kyonshi Ani',
    hp: 160,
    att: 6,
    attBack: 15,
    imgUrl: './assets/images/charD.jpeg'
    }
};

var renderCharacter = function(character, renderArea) {
  var charDiv = $("<div class='character' data-name='" + character.name + "'>");
  var charName = $("<div class='character-name'>").text(character.name);
  var charImg = $("<img alt='image' class='character-img'>").attr("src", character.imgUrl);
  var charHp = $("<div class='character-hp'>").text(character.hp);
  charDiv.append(charName).append(charImg).append(charHp);
  $(renderArea).append(charDiv);
};

var prepareGame = function() {
  for (var key in characters) {
    renderCharacter(characters[key], '#all-character');
  }
};
prepareGame();

var attacker;

var enemies = [];

var defender;

var attCount = 1;

var killCount = 0;

var updateCharacter = function(char, areaRender) {
  $(areaRender).empty();
  renderCharacter(char, areaRender);
};

var renderEnemies = function(enemy) {
  for (var i = 0; i < enemy.length; i++) {
    renderCharacter(enemy[i], '#enemies');
  }
};

var renderMessage = function(message) {
  var gameMessageSet = $('#game-message');
  var newMessage = $("<div id='msg'>").text(message);
  gameMessageSet.append(newMessage);
};

var restartGame = function(resultMessage) {
  var newB =  $('<button>Restart</button>');
  var restart =newB.click(function() {
    location.reload();
  });
   var gameState = $("<div id='restart'>").text(resultMessage);
   $('body').append(gameState);
   $('#new-button').append(restart);
};

var clearMessage = function() {
  var gameMessage = $('#game-message');
  gameMessage.text("");
};

$('#all-character').on('click', '.character', function() {
  var name = $(this).attr('data-name');

  if (!attacker) {
    attacker = characters[name];
    for (var key in characters) {
      if (key !== name) {
        enemies.push(characters[key]);
      }
    }
    $('#all-character').hide();

    updateCharacter(attacker, '#selected-character');
    renderEnemies(enemies);
  }
  $('.container').addClass('fight');
});

$('.section3').on('click', '.character', function() {
  var name = $(this).attr("data-name");

  if ($('#defender').children().length === 0) {
    defender = characters[name];
    updateCharacter(defender, '#defender');
    $(this).remove();
    clearMessage();
  }
});

$('#start').on('click', function() {
  if ($('#defender').children().length !== 0) {
    var attackMessage = 'You attacked ' + defender.name + ' for ' + attacker.att * attCount + ' damage.';
    var counterAttackMessage = defender.name + ' attacked you back for '+ defender.attBack + 'damage.';
    clearMessage();

    defender.hp -= attacker.att * attCount;

    if (defender.hp > 0) {
      updateCharacter(defender, '#defender');
      renderMessage(attackMessage);
      renderMessage(counterAttackMessage);

      attacker.hp -= defender.attBack;

      updateCharacter(attacker, '#selected-character');

      if (attacker.hp <= 0) {
        clearMessage();
        restartGame('You have been defeated...GAME OVER!!!');
        $('#start').off('click');
        
      }
    } else {
      $('#defender').empty();

      var gameStateMessage = 'You have defeated ' + defender.name + ', you can choose to fight another enemy.';
      renderMessage(gameStateMessage);
      killCount++;

      
        if (killCount >= enemies.length) {
          clearMessage();
          $('#start').off('click');
          restartGame('You Won~!Goodbye!!!');
        }
      }  attCount++;
  } else {
    clearMessage();
    renderMessage('No enemy here.');
    }
});