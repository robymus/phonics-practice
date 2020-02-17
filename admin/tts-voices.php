<?php
	require '../vendor/autoload.php';

	putenv('GOOGLE_APPLICATION_CREDENTIALS=/home/robymus/.googlecloud/phonics-practice-tts.json');

	use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;

	$out = [
		"voices" => []
	];

	$client = new TextToSpeechClient();

	$response = $client->listVoices();
	$voices = $response->getVoices();


	foreach ($voices as $voice) {
		$languages = [];

	    // display the supported language codes for this voice. example: 'en-US'
	    foreach ($voice->getLanguageCodes() as $languageCode) {
	    	if ($languageCode == 'en-US' || $languageCode == 'en-GB') {
	    		$languages[] = $languageCode;
	    	}
	    }

	    if (count($languages) == 0) continue;

	    // display the SSML voice gender
	    $gender = $voice->getSsmlGender();
	    // SSML voice gender values from TextToSpeech\V1\SsmlVoiceGender
	    $ssmlVoiceGender = ['unspecified', 'male', 'female',
	    'neutral'];

	    $id = $voice->getName();

	    $out['voices'][$id] = [
	    	"id" => $id,
	    	"region" => substr($languages[0], 3),
	    	"gender" => $ssmlVoiceGender[$gender]
	    ];
	}

	$client->close();

	// get last selected voice from ../data/lastSession.json
	$lastSessionStr = @file_get_contents('../data/lastSession.json');
	if ($lastSessionStr === false) {
		$out['last'] = $out['voices']['en-GB-Wavenet-A'];
	}
	else {
		$lastSession = json_decode($lastSessionStr, true);
		$out['last'] = $lastSession['voice'];
	}


	header('Content-type: application/json');
	echo json_encode($out);
