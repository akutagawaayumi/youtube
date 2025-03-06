'use strict'

let params = new URLSearchParams(location.search),
    playlistId,
    playlistTitle,
    joinus = null,
    gradient = null;

youtubeJson("./index.json");
async function youtubeJson(requestURL) {
    const request = new Request(requestURL);
    const response = await fetch(request);
    const jsonIndex = await response.text();
    const index = JSON.parse(jsonIndex);
    indexAll(index);
};

function indexAll(obj) {
    const playlist = document.querySelector('#playlist');

    obj.lists.forEach(function (list) {
        if (list.link == true) {
            const option = document.createElement('option');
            option.textContent = list.title;
            option.value = list.value;
            playlist.appendChild(option);
        };

        if (location.search && params.get("list")) {
            // ?list=value
            if (params.get("list") == list.value) {
                playlistTitle = list.title;
                playlistId = list.id;
                if (list.gradient) {
                    gradient = list.gradient;
                };
                if (params.get("join") && list.join[0]) {
                    collaboration(list.join[1]);
                };
            };
        } else {
            playlistTitle = obj.title;
            playlistId = obj.id;
            if (obj.gradient) {
                gradient = obj.gradient;
            };
            if (params.get("join") && obj.join[0]) {
                collaboration(obj.join[1]);
            };
        };
    }, false);

    const title = document.querySelector('#title');
    let thisSIze = `clamp(2.5rem, ${200 / playlistTitle.length}vw, 3.21rem)`;
    title.style.fontSize = thisSIze;

    const thisTitleAll = document.querySelectorAll('#nowplaying strong, #title');
    thisTitleAll.forEach(function (thisTitle) {
        thisTitle.textContent = playlistTitle;
    }, false);

    const link = document.querySelector('#link');
    link.href = `https://youtube.com/playlist?list=${playlistId}`;

    if (gradient) {
        const gradientAll = document.querySelectorAll('#collaboration, #join, #nowplaying strong');
        gradientAll.forEach(function (eachTitle) {
            eachTitle.classList.add(gradient);
        }, false);
    };

    playlist.addEventListener('change', (e) => {
        location.replace(`?list=${e.currentTarget.value}`);
    }, false);
};

function collaboration(url) {
    const joinUs = document.querySelector('#join');
    joinUs.href = url;

    const title = document.querySelector('header button');
    title.style.borderBottom = 'solid 0.2rem';
    title.addEventListener('click', () => {
        const dialogModal = document.querySelector('#dialog');
        if (typeof dialogModal.showModal === "function") {
            dialogModal.showModal();
        } else {
            alert("The <dialog> API is not supported by this browser");
        };
    }, false);

    const collaboration = document.querySelector('#collaboration');
    collaboration.textContent = "Add Your Favorite Music/Video to This Playlist via YouTube";
    fetch("README.md")
        .then(response => response.text())
        .then(text => {
            document.querySelector('#dialog section').innerText = text;
        })
};

function closeModal() {
    const dialogModal = document.querySelector('#dialog');
    dialogModal.close();
};