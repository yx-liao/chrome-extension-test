console.log("content !!");

function getData() {
  var rows = document.querySelectorAll("tr.athing");

  var data = Array.from(rows).map((row) => {
    const rank = row.querySelector("td:first-child")?.textContent;

    const title = row.querySelector("td .titleline > a")?.textContent;

    return {
      rank,
      title,
    };
  });

  return data;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.getDate) {
    sendResponse({
      data: getData(),
    });
  }

  if (request.popupOpen) {
    sendResponse({
      connected: true,
    });
  }
});
