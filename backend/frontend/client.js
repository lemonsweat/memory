// Generate grid of size k
function generateGrid(k) {
    var myTable = '<table><tbody>';
    for (i = 0; i < k; i++) {
        myTable += '  <tr>\n';
        for (j = 0; j < k; j++) {
            myTable += '    <td class="' + i + j + '" onclick="reveal('+i+','+j+')">' + i + j + '</td>\n';
        }
        myTable += '  </tr>\n';
    }
    myTable += ' </tbody></table>';
    document.getElementById('grid').innerHTML = myTable;
}

// Reveal element
function reveal(i, j) {
    // send coordinates to server
    // console.log(i,j);

    show(i, j, "player1", Math.floor(Math.random() * 57) + 1);

    // get response and show 
}

function show(i, j, player, type) {
    var delay = 400;
    var i, j;

    if ((selected.length == 1) && (selected[0] == (''+i+j))) {
        return;
    }

    selected.push(''+i+j);
    // console.log(selected);

    // hard coded logic to 
    $('.'+i+j).addClass('show').addClass('player2').html('<img src="PNG/32/' + ICONTYPES[type] + '.png" />');

    // show only two at a time
    if (selected.length >= 2) {
        first = selected.pop();
        second = selected.pop();
        
        // check if match
        if ($('.'+first).html() == $('.'+second).html()) {
            $('.'+first).addClass('match').attr('onclick','').unbind('click');;
            $('.'+second).addClass('match').attr('onclick','').unbind('click');;
        } else {
            setTimeout(function () {
                $('.' + first).html(first).removeClass('player2').removeClass('player1').removeClass('show');
                $('.' + second).html(second).removeClass('player2').removeClass('player1').removeClass('show');
            }, delay);
        }
    }
}

function setPlayerName() {
    if (typeof(Storage) !== "undefined") {
        return $('#playername').val(localStorage.playername || 'Player' + (Math.floor(Math.random()*9000) + 1000));
    }

    $('#playername').val('Player' + (Math.floor(Math.random()*9000) + 1000));
}

function findRoom() {
    var playerName = $('#playername').val();
}

function prefetch() {
    for (var icon in ICONTYPES) {
        $('head').append('<link rel="prefetch" href="PNG/32/' + ICONTYPES[icon] + '.png">');
    }
}

var selected = [];


var ICONTYPES = [
    "alarm",
    "android",
    "apple",
    "arrows",
    "basket",
    "battery_full",
    "bell",
    "bin",
    "book",
    "browser",
    "calendar",
    "camera",
    "chart_3_4",
    "circle_down",
    "close",
    "cloud",
    "code",
    "cog",
    "computer_ok",
    "credit_card",
    "documents",
    "equalizer",
    "globe",
    "hashtag",
    "heart",
    "home",
    "imac",
    "iphone",
    "list_2",
    "lock",
    "macbook",
    "mail",
    "map",
    "microphone",
    "microsoft",
    "moustache",
    "music",
    "notepad",
    "pen_3",
    "picture",
    "pin_2",
    "printer",
    "progress",
    "repeat_2",
    "rss",
    "shop",
    "shopping_bag",
    "shopping_cart",
    "speech_1",
    "star",
    "tags",
    "target",
    "user_circle",
    "view",
    "volume_2",
    "warning",
    "windows",
    "youtube"
];