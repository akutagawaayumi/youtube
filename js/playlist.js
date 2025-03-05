'use strict'

var ii = 0,
    player,
    videoId,
    totalResults;

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        playerVars: {
            'playsinline': 1,
            'autoplay': 0,
            'controls': 0,
            'rel': 0
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerStateChange(event) {
    const allVIdeo = document.getElementsByName('youtube'),
        playBtn = document.querySelector('#result div'),
        nowPlaying = document.querySelector('#nowplaying strong'),
        playingTrack = document.querySelector('#nowplaying small'),
        playingStates = document.querySelector('#result div button');

    // 現在のステータス取得
    var ytStatus = event.target.getPlayerState();

    switch (ytStatus) { // ステータスの判別

        case -1: // 未開始
            nowPlaying.textContent = allVIdeo[ii].dataset.title;
            playingTrack.textContent = Number(ii) + 1 + "/" + totalResults;
            playingStates.textContent = "Play";
            playBtn.addEventListener('click', function () {
                player.playVideo();
            }, false);
            break;

        case 0: // 終了
            if (Number(ii) + 1 === totalResults) {
                ii = 0;
            } else if (Number(ii) + 1 < totalResults) {
                ii++;
            };
            allVIdeo[ii].checked = true;
            videoId = allVIdeo[ii].value;
            player.loadVideoById({ videoId: videoId });
            player.playVideo();
            nowPlaying.textContent = allVIdeo[ii].dataset.title;
            playingTrack.textContent = Number(ii) + 1 + "/" + totalResults;
            playingStates.textContent = "Now Playing";
            break;

        case 1: // 再生中
            nowPlaying.textContent = allVIdeo[ii].dataset.title;
            playingTrack.textContent = Number(ii) + 1 + "/" + totalResults;
            playingStates.textContent = "Now Playing";
            playBtn.addEventListener('click', function () {
                player.pauseVideo();
            }, false);
            break;

        case 2: // 一時停止
            playingStates.textContent = 'Pause';
            playBtn.addEventListener('click', function () {
                player.playVideo();
            }, false);
            break;

        case 3: // バッファリング中
            break;

        case 5: // 頭出し済み
            break;

        default:
            break;
    };
};

function onGoogleLoad() {
    gapi.client.setApiKey('AIzaSyDBqB4snFnzISLwq_SVvIrNXzsXrZ0m6qY');
    gapi.client.load('youtube', 'v3', function () {
        const result = document.getElementById('result');
        var request = gapi.client.youtube.playlistItems.list({
            playlistId: playlistId,
            part: 'snippet,contentDetails',
            maxResults: 50,
        });

        function shuffle(arrays) {
            const array = arrays.slice();
            for (let i = array.length - 1; i >= 0; i--) {
                const shuffleArr = Math.floor(Math.random() * (i + 1));
                [array[i], array[shuffleArr]] = [array[shuffleArr], array[i]];
            } return array;
        };

        request.execute(function (response) {
            const items = shuffle(response.items);
            for (var i = 0; i < items.length; i++) {
                var snippet = items[i].snippet;
                var thisTitle = snippet.title;
                var thisID = snippet.resourceId.videoId;

                const li = document.createElement('li');
                result.appendChild(li);

                const input = document.createElement('input');
                input.setAttribute('type', 'radio');
                input.setAttribute('name', 'youtube');
                input.id = thisID;
                input.value = thisID;
                input.dataset.title = thisTitle;
                input.dataset.no = i;
                li.appendChild(input);

                const label = document.createElement('label');
                label.setAttribute('for', thisID);
                label.innerText = thisTitle;
                li.appendChild(label);

                if (i === 0) {
                    input.checked = true;
                    ii = input.dataset.no;
                    videoId = input.value;
                } else if (i === items.length - 1) {
                    totalResults = items.length;
                };

                input.addEventListener('click', () => {
                    videoId = input.value;
                    ii = input.dataset.no;
                    player.loadVideoById({ videoId: videoId });
                });
            };
            player.loadVideoById({ videoId: videoId });
        });
    });
};

function full() {
    document.body.classList.toggle('full');
    const button = document.querySelector('footer button');
    if (button.innerHTML === "Fullscreen View") {
        button.innerHTML = playlistTitle;
    } else {
        button.innerHTML = "Fullscreen View";
    };
};