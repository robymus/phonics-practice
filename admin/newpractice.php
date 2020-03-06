<?php
	require '../vendor/autoload.php';

	putenv('GOOGLE_APPLICATION_CREDENTIALS=/home/robymus/.googlecloud/phonics-practice-tts.json');

	use Google\Cloud\TextToSpeech\V1\AudioConfig;
	use Google\Cloud\TextToSpeech\V1\AudioEncoding;
	use Google\Cloud\TextToSpeech\V1\SynthesisInput;
	use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;
	use Google\Cloud\TextToSpeech\V1\VoiceSelectionParams;

    /**
     * Generate a new speech file (also uses cached version if available)
     * @param $client TextToSpeechClient to use
     * @param $text String the text itself
     * @param $voiceID String voice id for generation
     * @return array [true, filename] or [false, errorMessage]
     */
    function generateSpeech($client, $text, $voiceID, $fn = null) {
        if ($fn === null) {
            $fn = "data/generated/${voiceID}-${text}.mp3";
        }
        $fullfn = "../".$fn;
        // do not generate again, if it exists
        if (file_exists($fullfn) && filesize($fullfn) > 0) {
            return [true, $fn];
        }

        try {
            $voice = (new VoiceSelectionParams())
                ->setLanguageCode(substr($voiceID, 0, 5))
                ->setName($voiceID);
            $audioConfig = (new AudioConfig())->setAudioEncoding(AudioEncoding::MP3);
            $input_text = (new SynthesisInput())->setText($text);

            $response = $client->synthesizeSpeech($input_text, $voice, $audioConfig);
            $mp3 = $response->getAudioContent();

            file_put_contents($fullfn, $mp3);

            return [true, $fn];
        }
        catch (Exception $e) {
            return [false, $e->getMessage()];
        }
    }

    /**
     * Reports error to client
     * @param $reason String error message
     */
    function reportError($reason) {
        die( json_encode(["success" => false, "reason" => $reason]) );
    }

    $formData = json_decode(file_get_contents("php://input"), true);

    header('Content-type: application/json');

    $password = require('password.php');
    if ($formData['password'] !== $password) {
        reportError("Password invalid");
    }

    // generate audio files
    if (!is_dir('../data/generated')) {
        mkdir('../data/generated');
    }

    $wordList = [];

    $client = new TextToSpeechClient();
    try {
        $voiceID = $formData['voice']['id'];

        foreach ($formData['wordList'] as $word) {
            list($success, $fn) = generateSpeech($client, $word, $voiceID);
            if (!$success) {
                reportError($fn);
            }
            $wordList[] = [
                "word" => $word,
                "filename" => $fn
            ];
        }

        // also generate good job, well done UX message
        list($success, $fn) = generateSpeech($client, "Good job! Well done!", $voiceID, "data/generated/${voiceID}-goodjob.mp3");
        if (!$success) {
            reportError($fn);
        }
    } finally {
        $client->close();
    }

    // generate session files
    if (!is_dir('../data/session')) {
        mkdir('../data/session');
    }

    $date = date('Y-m-d');

    $session = [
        "wordList" => $wordList,
        "voice" => $formData['voice'],
        "date" => $date,
        "path" => "data/session/${date}.json"
    ];

    $jsonstr = json_encode($session);

    file_put_contents("../".$session['path'], $jsonstr);
    file_put_contents("../data/lastSession.json", $jsonstr);

    echo json_encode(["success" => true]);
