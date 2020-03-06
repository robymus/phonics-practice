<?php
    // retrieves current and last sessions

    header('Content-type: application/json');

    $lastSession = false;
    $lastSessionDate = false;

    if (file_exists('../data/lastSession.json')) {
        $lastSession = json_decode(file_get_contents('../data/lastSession.json'), true);
        $lastSessionDate = $lastSession['date'];
    }

    $oldSessions = [];

    foreach (glob('../data/session/*.json') as $fn) {
        $session = json_decode(file_get_contents($fn), true);
        if ($session['date'] !== $lastSessionDate) {
            $oldSessions[] = $session;
        }
    }

    $res = [
        "currentSession" => $lastSession,
        "oldSessions" => $oldSessions
    ];

    echo json_encode($res);

