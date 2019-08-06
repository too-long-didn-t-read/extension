var browser = chrome || browser;

var currentDomain = null;
var currentDomainInfo = {};

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
            browser.tabs.get(tabs[0].id , 
                tab => {
                    sendRequest({
                        domainInfo: currentDomainInfo[0],
                        domain: currentDomain
                    })
                });
            }
    );
    return true;
}

browser.runtime.onMessage.addListener(getCurrentUrl)


// change browser action icon on tab change
browser.tabs.onUpdated.addListener((activeTab) => {
    browser.tabs.get(activeTab,
        (res) => {
            var domain = extractDomain(new URL(res.url))
            if (currentDomain !== domain) {
                currentDomain = domain
                getDomainInfo(domain)
            }
        }
    )
})

extractDomain = (url) => {
    return (!!url.origin && url.hostname) || new Error(`${url.href} is not a valid domain`)
}

getDomainInfo = (domain) => {
    console.log('getting domain info for : ', domain)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if(xhr.status === 200) {
            currentDomainInfo = xhr.response;
            console.log(currentDomainInfo)
            if (currentDomainInfo && currentDomainInfo.length === 1) {
                setBrowserActionIcon('green')
            } else {
                setBrowserActionIcon('grey')    
            }
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