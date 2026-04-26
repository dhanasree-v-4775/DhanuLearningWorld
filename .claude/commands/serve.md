Start the local development server for DhanuLearningWorld.

Run:
```
python3 -m http.server 8080
```

from the project root `/Users/dhana-4775/DhanuSamples/`.

Then open http://localhost:8080 in the browser.

The server must be started from the project root so that `/tts.js` resolves correctly (it is referenced as an absolute path in all HTML files).

If port 8080 is already in use, find and kill the existing process:
```
lsof -i :8080 | grep LISTEN
kill <PID>
```
