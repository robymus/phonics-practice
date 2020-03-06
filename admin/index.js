const currentSession = $('#currentSession');
const noCurrentSession = $('#noCurrentSession');

currentSession.hide();
noCurrentSession.show();

function loadSessions() {
    $.ajax({
        url: "sessionlist.php",
        dataType: "json"
    })
        .done(function(data) {
            if (data['currentSession']) {
                // display word list
                const wordList = $('#wordList');
                const template = $('#row-template').html();
                $.each(data['currentSession']['wordList'], function(idx, data) {
                    wordList.append(template
                        .replace(/ID/g, idx+1)
                        .replace(/WORD/, data['word'])
                        .replace(/FILENAME/, data['filename'])
                    );
                });

                // display voice data
                const voice = data['currentSession']['voice'];
                $('#voice_id').html(voice['id']);
                if (voice['gender'] === 'female') {
                    $('#voice_male').hide();
                }
                else {
                    $('#voice_female').hide();
                }
                $('#voice_region').html(voice['region'] === 'GB' ? 'British' : 'American');

                currentSession.show();
                noCurrentSession.hide();

                // display old sessions
                const oldSessions = $('#oldSessions');
                const sessionTemplate = $('#oldsession-template').html();
                $.each(data['oldSessions'], function(idx, session) {
                    const voice = session['voice']
                    oldSessions.append(sessionTemplate
                        .replace(/DATE/, session['date'])
                        .replace(/VOICE_ID/, voice['id'])
                        .replace(/VOICE_GENDER/, voice['gender'])
                        .replace(/VOICE_REGION/, voice['region'] === 'GB' ? 'British' : 'American')
                        .replace(/WORDS/, session['wordList'].map(function (ww) { return ww['word'] }).join(', ') )
                    );
                });

            }
        })
        .fail(function() {
            error('Error loading voice list');
            $('#saveButton').hide();
        })
}


$(document).ready(loadSessions);