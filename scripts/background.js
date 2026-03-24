async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: 'scripts/offscreen.html',
    reasons: ['LOCAL_STORAGE'],
    justification: 'AI embedding inference using JavaScript'
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "vectorize") {
    (async () => {
      await createOffscreen();
      chrome.runtime.sendMessage({
        action: "execute_vectorize",
        text: message.text
      });
    })();
    return true; 
  }
});