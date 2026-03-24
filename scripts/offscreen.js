// offscreen.js
let worker = null;

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "execute_vectorize") {
        if (!worker) {
            // Workerを起動
            worker = new Worker(chrome.runtime.getURL('scripts/worker.js'), { type: 'module' });
        }

        worker.onmessage = (e) => {
            if (e.data.status === 'success') {
                chrome.runtime.sendMessage({ action: "vector_result", vector: e.data.vector });
            } else {
                chrome.runtime.sendMessage({ action: "vector_error", error: "Worker Error: " + e.data.error });
            }
        };

        worker.postMessage({ text: message.text });
    }
});