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
    console.log(i,j);

    show(i, j, "player1", Math.floor(Math.random() * 57) + 1);

    // get response and show 
}

function show(i, j, player, type) {
    var delay = 400;
    $('.'+i+j).addClass('show').addClass('player2').addClass('location').html('<img src="PNG/32/' + ICONTYPES[type] + '.png" />');
    
    if ($('.show').length >= 2) {
        var items = $('.show');
        setTimeout(function () {
            items[0].innerHTML = items[0].className.split(" ")[0];
            items[1].innerHTML = items[1].className.split(" ")[0];
            
            items[0].className = items[0].className.split(" ")[0];
            items[1].className = items[1].className.split(" ")[0];
        }, delay);
    }
}


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