// ==UserScript==
// @name         F95 clean bump comments
// @namespace    https://github.com/fezroad
// @version      0.1.4
// @description  It will remove comments that is used for bumping and leave the latest comment to see how recent thread was active.
// @author       Fezroad
// @match        https://f95zone.to/threads/*
// @updateURL    https://raw.githubusercontent.com/fezroad/f95-clean-bump-comments/master/main.user.js
// @downloadURL  https://raw.githubusercontent.com/fezroad/f95-clean-bump-comments/master/main.user.js
// @icon         https://f95zone.to/assets/favicon-32x32.png
// @grant        none
// ==/UserScript==

const scriptStartTime = (new Date()).getTime()

function findAndRemoveComments() {
    const contentToDelete = {
        "+": "+",
        "+1": "+1",
        "1": "1",
        "bump": "bump",
        "up": "up"
    }
    const thread = document.querySelector(".block-body.js-replyNewMessageContainer")

    if (thread != undefined) {
        let messages = Array.from(thread.querySelectorAll(".message.message--post"))

        if (messages.length > 1) {
            messages = messages.slice(0, -1)

            for (const message of messages) {
                let messageContent = message.querySelector(".message-body .bbWrapper")
                if (messageContent != undefined) {
                    messageContent = messageContent.innerText.toLowerCase()
                    messageContent = messageContent.replaceAll(" ", "")
                    messageContent = messageContent.replaceAll("0", "")

                    if (contentToDelete[messageContent] != undefined) {
                        message.remove()
                    }
                }
            }
        }
    }
}

function observerCallback(changes, observer) {
    const nowTime = (new Date()).getTime()
    const timeDiff = (nowTime - scriptStartTime)

    if (timeDiff >= 15000) {
        observer.disconnect()
    } else if (document.querySelector(".block-body.js-replyNewMessageContainer") != undefined) {
        observer.disconnect()
        findAndRemoveComments()
    }
}

(new MutationObserver(observerCallback)).observe(document, {childList: true, subtree: true});
