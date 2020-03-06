function nextSlide() {
    const slideNum = Reveal.getIndices()['h'];
    setTimeout(function() {
        Reveal.slide(slideNum+1);
    }, 0);
}

function prevSlide() {
    const slideNum = Reveal.getIndices()['h'];
    setTimeout(function() {
        Reveal.slide(slideNum-1);
    }, 0);
}

function repeatSlide() {
    const slideNum = Reveal.getIndices()['h'];
    setTimeout(function() {
        Reveal.slide(slideNum);
    }, 0);
}

function loadLastSession() {
    $.ajax({
        url: "data/lastSession.json",
        dataType: "json"
    })
        .done(function(data) {
            // build slides dynamically
            const slides = $('div.slides');
            const areyoureadyTemplate = $('#areyouready-template').html();
            slides.append(areyoureadyTemplate
                .replace(/VOICE_ID/g, data['voice']['id'])
            );
            const wordTemplate = $('#word-template').html();
            $.each(data['wordList'], function(idx, data) {
                slides.append(wordTemplate
                    .replace(/ID/g, idx+1)
                    .replace(/FILENAME/, data['filename'])
                );
            });
            const goodjobTemplate = $('#goodjob-template').html();
            slides.append(goodjobTemplate
                .replace(/VOICE_ID/g, data['voice']['id'])
            );

            // then just wait for all audio to load, before continuing
            checkAudioReady();

        })
        .fail(function() {
            // redirect to admin interface if nothing here yet
            window.location.href = "admin/index.html";
        });
}

function checkAudioReady() {
    let allReady = true;
    $.each($('audio'), function(idx, e) {
        allReady &= (e.readyState === 4) // HAVE_ENOUGH_DATA
    });
    if (allReady) {
        // all audio elements loaded
        // -> initialize reveal
        // also wait a little more, just for good measure
        setTimeout(function() {
            Reveal.initialize({
                controlsLayout: "edges",
                overview: false,
                autoPlayMedia: true,
                hash: false,
                keyboard: {
                    13: repeatSlide,
                    65: repeatSlide, // A - again
                    82: repeatSlide, // R - repeat
                }
            });
        }, 500);
    }
    else {
        // try again later
        setTimeout(checkAudioReady, 100);
    }
}

$(document).ready(loadLastSession);