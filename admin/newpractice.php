<?php
	require '../vendor/autoload.php';

	putenv('GOOGLE_APPLICATION_CREDENTIALS=/home/robymus/.googlecloud/phonics-practice-tts.json');

	use Google\Cloud\TextToSpeech\V1\AudioConfig;
	use Google\Cloud\TextToSpeech\V1\AudioEncoding;
	use Google\Cloud\TextToSpeech\V1\SsmlVoiceGender;
	use Google\Cloud\TextToSpeech\V1\SynthesisInput;
	use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;
	use Google\Cloud\TextToSpeech\V1\VoiceSelectionParams;

	$wordlist = ["one", "two", "three", "four", "five", "six"];

	$date = date("Y-m-d");


