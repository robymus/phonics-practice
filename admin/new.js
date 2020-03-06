window.lastID = 0;

window.voices = [];

function addNew()
{
	const nextID = lastID + 1;
	const template = $('#row-template').html().replace(/ID/g, nextID);
	$('#wordlist').append(template);
	// remove old plus
	$('#plus_'+lastID).remove();
	// remove old enter handler
	$(document.body).off('keyup');
	// add new enter handler
	const nextInput = $('#input_'+nextID);
	$(document.body).on('keyup', nextInput, function(evt) {
		if (nextInput.val() !== '' && evt.code === "Enter") {
			window.setTimeout(addNew, 100);
		}
	});
	// focus new input
	nextInput.focus();
	// set id
	window.lastID = nextID;
}

function error(err) {
	$('#spinner').hide();
	$('#errortext').html(err);
	$('#error').show();
}

function save() {
	const o = $('#wordlist input')
		.map(function() {
			return $(this).val();
		})
		.get()
		.filter(function(v) {
			return v !== '';
		});
	if (o.length === 0) {
		error('Empty word list');
		return;
	}
	$('#spinner').show();
	$('#error').hide();

	// gather form data
	const formData = {
		"wordList": o,
		"voice": {
			'id': $('#voice_id').val(),
			'gender': $('#voice_gender').val(),
			'region': $('#voice_region').val(),
		},
		"password": $('#password').val()
	};

	$.ajax({
		url: "newpractice.php",
		method: "POST",
		processData: false,
		contentType: "application/json",
		data: JSON.stringify(formData),
		dataType: "json"
	})
		.done(function(data) {
			if (data['success']) {
				window.location.href = "index.html";
			}
			else {
				error(data['reason']);
			}
		})
		.fail(function() {
			error('Saving new practice session failed');
		});
}

// filter voice_id list based on gender/region, select something
function filterVoices(selectedId = false) {
	const select = $('#voice_id');
	if (selectedId === false) {
		selectedId = select.val();
	}
	const gender = $('#voice_gender').val();
	const region = $('#voice_region').val();
	select.empty();
	$.each(window.voices, function(id, voice) {
		if (voice['gender'] === gender && voice['region'] === region) {
			console.log(voice);
			select.append($('<option></option>')
				.attr('value', id)
				.text(id));
			if (id === selectedId) {
				select.val(selectedId);
			}
		}
	});
}

function loadVoices() {
	$.ajax({
		url: "tts-voices.php",
		dataType: "json"
	})
		.done(function(data) {
			window.voices = data.voices;
			$('#voice_gender').val(data.last['gender']);
			$('#voice_region').val(data.last['region']);
			filterVoices(data.last['id']);
		})
		.fail(function() {
			error('Error loading voice list');
			$('#saveButton').hide();
		})
}

$('#spinner').hide();
$('#error').hide();

addNew();

$(document).ready(loadVoices)