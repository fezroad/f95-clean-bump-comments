// ==UserScript==
// @name         F95 clean bump comments
// @namespace    https://github.com/fezroad
// @version      0.2.0
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
    const thread = document.querySelector(".block-body.js-replyNewMessageContainer")

    if (thread != undefined) {
        const messages = Array.from(thread.querySelectorAll(".message.message--post"))

        if (messages.length > 1) {
            const lastMessage = messages.pop()

            for (const message of messages) {
                let messageContent = message.querySelector(".message-body .bbWrapper")
                if (messageContent != undefined) {
                    let innerText
                    if (messageContent.childNodes.length > 1) {
                        for (let i = messageContent.childNodes.length - 1; i > 0; i--) {
                            const childNode = messageContent.childNodes[i]
                            if (childNode.nodeType === 3) {
                                innerText = childNode.textContent
                                break
                            }
                        }

                        if (innerText == undefined) continue
                    } else {
                        innerText = messageContent.innerText
                    }

                    innerText = innerText.toLowerCase()
                    innerText = innerText.replaceAll(" ", "")
                    innerText = innerText.replace(/[0-9]/g, "")
                    innerText = innerText.replaceAll("bump", "")
                    innerText = innerText.replaceAll("up", "")
                    innerText = innerText.replaceAll("+", "")
                    innerText = innerText.replaceAll("!", "")

                    if (innerText === "") {
                        message.remove()
                    }
                }
            }

            if (lastMessage != undefined) {
                setTimeout(() => {
                    lastMessage.setAttribute('tabindex', '-1')
                    lastMessage.focus()
                    lastMessage.removeAttribute('tabindex')
                }, 500)
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

(new MutationObserver(observerCallback)).observe(document, { childList: true, subtree: true })
