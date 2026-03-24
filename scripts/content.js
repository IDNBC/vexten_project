// ページからテキストと数式を抽出する関数
function extractPageData() {
  const title = document.title;
  const url = window.location.href;

  // MathJax等の数式要素を探してLaTeXを取得（簡易版）
  let mathElements = [];
  document.querySelectorAll('script[type^="math/tex"]').forEach(el => {
    mathElements.push(el.textContent);
  });

  // 本文の抽出（簡易的にinnerTextを使用。後でReadability.jsに入れ替え可能）
  const bodyText = document.body.innerText;

  return { title, url, bodyText, mathElements };
}

// Popupからのメッセージを待機
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract") {
    sendResponse(extractPageData());
  }
});