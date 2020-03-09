const audioContext = new AudioContext();
let audioBuffer = [];
let audioLoadedCount = 0;
let audioLoadingError = false;
let sessionData = {};
let lastAudioSource = null;

function nextSlide() {
    const slideNum = Reveal.getIndices()['h'] + 1;
    playSound(slideNum);
    setTimeout(function() {
        Reveal.slide(slideNum);
    }, 1);
}

function prevSlide() {
    const slideNum = Reveal.getIndices()['h']-1;
    playSound(slideNum);
    setTimeout(function() {
        Reveal.slide(slideNum);
    }, 1);
}

function listenAgain() {
    const slideNum = Reveal.getIndices()['h'];
    playSound(slideNum);
}

function loadLastSession() {
    $.ajax({
        url: "data/lastSession.json",
        dataType: "json"
    })
        .done(function(data) {
            sessionData = data;
            preloadAudio();
        })
        .fail(function() {
            // redirect to admin interface if nothing here yet
            window.location.href = "admin/index.html";
        });
}

// start up everything, first click was done, all audio is loaded
function start() {
    $('#waitPanel').remove();

    // build slides dynamically
    const slides = $('div.slides');
    const areyoureadyTemplate = $('#areyouready-template').html();
    slides.append(areyoureadyTemplate
        .replace(/VOICE_ID/g, sessionData['voice']['id'])
    );
    const wordTemplate = $('#word-template').html();
    $.each(sessionData['wordList'], function(idx, data) {
        slides.append(wordTemplate
            .replace(/ID/g, idx+1)
        );
    });
    const goodjobTemplate = $('#goodjob-template').html();
    slides.append(goodjobTemplate
        .replace(/VOICE_ID/g, sessionData['voice']['id'])
    );

    Reveal.initialize({
        controlsLayout: "edges",
        overview: false,
        autoPlayMedia: true,
        hash: false,
        viewDistance: Number.MAX_VALUE,
        keyboard: {
            13: listenAgain,
            65: listenAgain, // A - again
            82: listenAgain, // R - repeat
        }
    });

    Reveal.addEventListener('slidechanged', function(p) {
        const slideNum = p['indexh'];
        playSound(slideNum);
    });

    // change to first (later changes will be captured above
    playSound(0);
}

function playSilence() {
    const waitButton = $('#waitButton');
    waitButton.html('...');
    waitButton.unbind();
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer[0];
    source.connect(audioContext.destination);
    source.onended = function() {
        start();
    };
    source.start();
}

function playSound(idx) {
    if (lastAudioSource !== null) {
        lastAudioSource.stop();
    }
    lastAudioSource = audioContext.createBufferSource();
    lastAudioSource.buffer = audioBuffer[idx+1];
    lastAudioSource.connect(audioContext.destination);
    lastAudioSource.start();
}

function preloadAudio() {
    const waitButton = $('#waitButton');

    let urlList = ['1-second-of-silence.mp3'];

    urlList.push('data/generated/' + sessionData['voice']['id'] + '-areyouready.mp3');
    $.each(sessionData['wordList'], function(idx, data) {
        urlList.push(data['filename']);
    });
    urlList.push('data/generated/' + sessionData['voice']['id'] + '-goodjob.mp3');
    $.each(urlList, function(idx, url) {
        $.ajax({
            url: url,
            xhr: function() {
                const xhrOverride = new XMLHttpRequest();
                xhrOverride.responseType = "arraybuffer";
                return xhrOverride;
            }
        })
            .done(function(data) {
                audioContext.decodeAudioData(data).then(audioData => {
                    audioBuffer[idx] = audioData;
                    audioLoadedCount++;
                    if (audioLoadedCount === urlList.length) {
                        waitButton.html("START");
                        waitButton.css('background-color', '#4f4');
                        waitButton.click(function (evt) {
                            evt.preventDefault();
                            playSilence();
                        })
                    }
                });
            })
            .fail(function() {
                audioLoadingError = true;
                waitButton.html("ERROR :(");
                waitButton.css('background-color', '#f44');
            });

    });
}

$(document).ready(loadLastSession);
