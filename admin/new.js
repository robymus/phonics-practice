window.lastID = 0;

function addNew()
{
	var nextID = lastID + 1;
	var template = $('#row-template').html().replace(/ID/g, nextID);
	$('#wordlist').append(template);
	// remove old plus
	$('#plus_'+lastID).remove();
	// remove old enter handler
	$(document.body).off('keyup');
	// add new enter handler
	$(document.body).on('keyup',$('#input_'+nextID), function(evt) {
		if ($('#input_'+nextID).val() != '' && evt.keyCode == 13) {
			window,setTimeout(addNew, 100);
		}
	});
	// focus new input
	$('#input_'+nextID).focus();
	// set id
	window.lastID = nextID;
}

function error(err) {
	$('#spinner').hide();
	$('#errortext').html(err);
	$('#error').show();
}

function save() {
	var o = $('#wordlist input')
		.map(function() {
			return $(this).val();
		})
		.get()
		.filter(function(v) {
			return v != '';
		});
	if (o.length == 0) {
		error('Empty word list');
		return;
	}
	$('#spinner').show();
	$('#error').hide();
	// TODO: ajax

	// TODO: redirect to index.html
}

$('#spinner').hide();
$('#error').hide();

addNew();