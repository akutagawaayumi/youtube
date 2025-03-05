'use strict'

let params = new URLSearchParams(location.search),
    playlistId,
    playlistTitle,
    joinus = null,
    gradient = null;

async function youtubeJson(requestURL) {
    const request = new Request(requestURL);
    const response = await fetch(request);
    const jsonIndex = await response.text();
    const index = JSON.parse(jsonIndex);
    thisTitle(index);
    listAll(index);
};

function thisTitle(obj) {
    // ?list=value
    if (location.search && params.get("list")) {
        obj.lists.forEach(function (list) {
            if (list.value == params.get("list")) {
                playlistTitle = list.title;
                playlistId = list.id;
                if (list.gradient) {
                    gradient = list.gradient;
                };
                if (list.join) {
                    collaboration(list.join);
                };
            };
        }, false);
    } else {
        playlistTitle = obj.title;
        playlistId = obj.id;
        if (obj.gradient) {
            gradient = obj.gradient;
        };
        if (obj.join && localStorage.getItem('yourName') && localStorage.getItem('yourEmail')) {
            collaboration(obj.join);
        };
    };

    const thisTitleAll = document.querySelectorAll('#nowplaying strong, #title');
    thisTitleAll.forEach(function (thisTitle) {
        thisTitle.textContent = playlistTitle;
    }, false);

    const title = document.querySelector('#title');
    let thisSIze = `clamp(2.5rem, ${200 / playlistTitle.length}vw, 3.21rem)`;
    title.style.fontSize = thisSIze;

    const link = document.querySelector('#link');
    link.href = `https://youtube.com/playlist?list=${playlistId}`;

    if (gradient) {
        const gradientAll = document.querySelectorAll('#collaboration, #join, #nowplaying strong');
        gradientAll.forEach(function (eachTitle) {
            eachTitle.classList.add(gradient);
        }, false);
    };
};

function listAll(obj) {
    const playlist = document.querySelector('#playlist');
    obj.lists.forEach(function (list) {
        if (list.link == true) {
            const option = document.createElement('option');
            option.textContent = list.title;
            option.value = list.value;
            playlist.appendChild(option);
        };

        if (localStorage.getItem('yourName') && localStorage.getItem('yourEmail')) {
            if (list.link == "members") {
                const option = document.createElement('option');
                option.textContent = list.title;
                option.value = list.value;
                playlist.appendChild(option);
            };
        };
    }, false);

    playlist.addEventListener('change', (e) => {
        location.replace(`?list=${e.currentTarget.value}`);
    }, false);
}

function collaboration(url) {
    const joinUs = document.querySelector('#join');
    joinUs.href = url;

    const title = document.querySelector('header button');
    title.style.borderBottom = 'solid 0.2rem';
    title.addEventListener('click', () => {
        openModal();
    }, false);

    const collaboration = document.querySelector('#collaboration');
    collaboration.textContent = "Add Your Favorite Music/Video to This Playlist via YouTube";

    fetch("README.md")
        .then(response => response.text())
        .then(text => {
            document.querySelector('#dialog section').innerText = text;
        })
};

function openModal() {
    const dialogModal = document.querySelector('#dialog');
    if (typeof dialogModal.showModal === "function") {
        dialogModal.showModal();
    } else {
        alert("The <dialog> API is not supported by this browser");
    };
};

function closeModal() {
    const dialogModal = document.querySelector('#dialog');
    dialogModal.close();
};

youtubeJson("./index.json");