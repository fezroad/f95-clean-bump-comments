// ==UserScript==
// @name         F95 clean bump comments
// @namespace    https://github.com/fezroad
// @version      0.2.9
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
    const threadLabels = document.querySelectorAll(".p-title-value a.labelLink")

    if (thread != undefined) {
        /*
        if (threadLabels.length > 0) {
            let isVamThread = false
            for (const label of threadLabels) {
                if (label.innerText.toLowerCase() === "vam") {
                    isVamThread = true
                    break
                }
            }
            if (!isVamThread) return undefined
        }
        */

        const messages = Array.from(thread.querySelectorAll(".message.message--post"))

        if (messages.length > 1) {
            const lastMessage = messages.pop()

            for (const message of messages) {
                const messageHeader = message.querySelector(".message-attribution-opposite.message-attribution-opposite--list")
                if (messageHeader.children.length > 2) {
                    const messageNumber = messageHeader.children[2]?.firstElementChild?.innerText?.trim()
                    if (messageNumber != undefined && messageNumber === "#1") {
                        continue
                    }
                }

                let messageContent = message.querySelector(".message-body .bbWrapper")
                if (messageContent != undefined) {
                    let innerText
                    if (messageContent.childNodes.length > 1) {
                        for (let i = messageContent.childNodes.length - 1; i >= 0; i--) {
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
                    innerText = innerText.replaceAll("again", "")
                    innerText = innerText.replaceAll("bumping", "")
                    innerText = innerText.replaceAll("bump", "")
                    innerText = innerText.replaceAll("plus", "")
                    innerText = innerText.replaceAll("one", "")
                    innerText = innerText.replaceAll("bomp", "")
                    innerText = innerText.replaceAll("boop", "")
                    innerText = innerText.replaceAll("b0mp", "")
                    innerText = innerText.replaceAll("up", "")
                    innerText = innerText.replaceAll("down", "")
                    innerText = innerText.replaceAll("damn", "")
                    innerText = innerText.replaceAll("sadge", "")
                    innerText = innerText.replaceAll("need", "")
                    innerText = innerText.replaceAll(" ", "")
                    innerText = innerText.replace(/[0-9]/g, "")
                    innerText = innerText.replace(/[a-zA-Z]/, "")
                    innerText = innerText.replace(/\?/g, "")
                    innerText = innerText.replace(/\./g, "")
                    innerText = innerText.replaceAll("-", "")
                    innerText = innerText.replaceAll("_", "")
                    innerText = innerText.replaceAll("+", "")
                    innerText = innerText.replaceAll("＋", "")
                    innerText = innerText.replaceAll("!", "")
                    innerText = innerText.replaceAll("=", "")
                    innerText = innerText.replaceAll("∞", "")
                    innerText = innerText.replaceAll(":'\)", "")
                    innerText = innerText.replaceAll("➕", "")

                    if (innerText === "" && messageContent.firstChild?.href === undefined) {
                        message.remove()
                    }
                }
            }
            /*
            if (lastMessage != undefined) {
                setTimeout(() => {
                    lastMessage.setAttribute('tabindex', '-1')
                    lastMessage.focus()
                    lastMessage.removeAttribute('tabindex')
                }, 500)
            }
            */
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
