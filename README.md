# Phonics Practice

Simple tool for my daughter's phonics homeworks using Google Cloud TTS engine for voice generation, Reveal.js for visualization.

Barebone php/jquery/filesystem backend.

Writes everything to `data` directory, make sure it exists and writable, create new practice session at /admin.

## Disclaimer

Absolutely messy hacked up project, use at your own risk.

## What's going on with the audio?

I've tried all the tricks to get it play correctly at first. But the first slide audio sometimes quiet (especially on mobile) sometimes cut in half, sometimes okay. The second workds, except on mobile, where only the third works, but after that, all good.

This is craziness.