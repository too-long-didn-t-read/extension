var browser = chrome || browser;


// return the current tab url to the browser action popup
function getCurrentUrl(message, sender, sendRequest) {
    if (message.content !== 'get_current_tab_url') {
        return
    }
    browser.tabs.query(
        {
            active: true,
            windowId: browser.windows.WINDOW_ID_CURRENT
        },
        (tabs) => {
            console.log(tabs)
            browser.tabs.get(tabs[0].id , 
                tab => {
                    let domain;
                    try {
                      domain = extractDomain(new URL(tab.url))
                    } catch (e) {
                      domain = null;
                    }
                    sendRequest(domain)
                });
            }
    );
    return true;
}

browser.runtime.onMessage.addListener(getCurrentUrl)


// change browser action icon on tab change
browser.tabs.onActivated.addListener((activeTab) => {
    browser.tabs.get(activeTab.tabId,
        (res) => {
            var domain = extractDomain(new URL(res.url))
            getDomainInfo(domain)
        }
    )
})

extractDomain = (url) => {
    return (!!url.origin && url.hostname) || new Error(`${url.href} is not a valid domain`)
}

getDomainInfo = (domain) => {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onreadystatechange = () => {
        if(xhr.status === 200) {
            console.log(xhr.responseText);
            setBrowserActionIcon('green')
        } else {
            setBrowserActionIcon('grey')
        }
    }
    xhr.open("GET", `https://tldr-sails.herokuapp.com/tldr?uniqueName=privacy://${domain}`);
    xhr.send();
}

setBrowserActionIcon = (color) => {
    browser.browserAction.setIcon(
        {
            path: `./icons/${color}.png`
        }
    )
}