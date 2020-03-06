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

            // and initialize reveal
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
        })
        .fail(function() {
            // redirect to admin interface if nothing here yet
            window.location.href = "admin/index.html";
        });
}

$(document).ready(loadLastSession);