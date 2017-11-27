class ChromeApiClient {

    static download(fileUrl, fileName) {
        return new Promise((resolve, reject) => {
            chrome.downloads.download({url: fileUrl, filename: fileName}, (fileId) => {
                let interval = setInterval(() => {
                    chrome.downloads.search({id: fileId}, (files) => {
                        let file = files[0];
                        if(file.state == 'complete') {
                            clearInterval(interval);
                            resolve(file.filename);
                        } else if(file.state == 'interrupted') {
                            clearInterval(interval);
                            reject(file.filename);
                        }
                    });
                }, 200);
            });
        });
    }
    
    static readCookie(url, name) {
        return new Promise((resolve, reject) => {
            chrome.cookies.get({url: url, name: name}, (cookie) => {
                resolve(cookie);
            });
        });
    }
    
    static getCurrentPageUrl() {
        // Sending message to page and geting back content
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {message: "get_page_url_request"}, (response) => {
                    resolve(response);
                });
            });
        });
    }

    static randomFileName(ext) {
        return Date.now().toString() + Math.floor(Math.random() * 10000000) + '.' + ext;
    }

}