document.addEventListener('DOMContentLoaded', async () => {
    const status = document.getElementById('status');
    const titleEl = document.getElementById('page-title');
    const urlEl = document.getElementById('page-url');
    const saveBtn = document.getElementById('save-btn');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { action: "extract" }, (response) => {
        if (response) {
            titleEl.textContent = response.title;
            urlEl.textContent = response.url;
            status.textContent = "保存の準備ができました";

            saveBtn.onclick = () => {
                saveBtn.disabled = true;
                status.textContent = "AIが計算中 (初回は1分ほどかかります)...";
                chrome.runtime.sendMessage({
                    action: "vectorize",
                    text: response.bodyText.substring(0, 1000)
                });
            };
        } else {
            status.textContent = "このページでは実行できません";
            saveBtn.disabled = true;
        }
    });
});

// 結果受信
chrome.runtime.onMessage.addListener((message) => {
    const status = document.getElementById('status');
    const saveBtn = document.getElementById('save-btn');

    if (message.action === "vector_result") {
        console.log("生成されたベクトル:", message.vector);
        status.textContent = "ベクトル化成功！";
        saveBtn.disabled = false;
    }
    if (message.action === "vector_error") {
        status.textContent = "エラー: " + message.error;
        saveBtn.disabled = false;
    }
});