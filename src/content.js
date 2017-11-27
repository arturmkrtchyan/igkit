
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message == 'get_page_url_request') {
        sendResponse(window.location);
    }
});