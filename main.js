const icon = document.getElementById("GrayT")
const search = document.getElementById("search")

const parent = document.getElementById("container")
const selector = document.getElementsByClassName("selector");
const linkboxes = document.getElementsByClassName("linkbox")

let selectedBoxIndex
// selectedLinkIndex: 0 = box, 1+ = link
let selectedLinkIndex = 0
let previousSelectedLinkIndex

function countLines(target) {
    // credit: https://stackoverflow.com/a/37623987
    let style = window.getComputedStyle(target, null);
    let height = parseInt(style.getPropertyValue("height"));
    let font_size = parseInt(style.getPropertyValue("font-size"));
    let line_height = font_size * 1.2
    
    let lines = Math.floor(height / line_height);

    return lines;
}

function select(pressedBoxNum) {
    // function selects boxes & links
    if (!search.contains(document.activeElement)) {

        if (selectedBoxIndex != pressedBoxNum && selectedBoxIndex != undefined) {
            // if: when selectedBox changes to a different one
            selector[selectedBoxIndex-1].style.visibility = "hidden"
            linkboxes[selectedBoxIndex-1].style.filter = "none"

            if (previousSelectedLinkIndex != undefined) {
                const previousSelectedLink = linkboxes[selectedBoxIndex-1].getElementsByClassName("hyperlink")[previousSelectedLinkIndex-1]
                previousSelectedLink.innerHTML = previousSelectedLink.innerHTML.replace("&gt; ", "")
                previousSelectedLink.style = "font-size: 2vw;"
            }
            previousSelectedLinkIndex = undefined
            selectedLinkIndex = 0
        }
        if (selectedLinkIndex == 0) {
            // if: select box
            linkboxes[pressedBoxNum-1].style.filter = "drop-shadow(0 0 2px #FFFFFF)"
            selector[pressedBoxNum-1].style.visibility = "visible"; 

            selectedBoxIndex = pressedBoxNum
        } else {
            // else: select links
            const links = linkboxes[selectedBoxIndex-1].getElementsByClassName("hyperlink")
            
            if (selector[selectedBoxIndex-1].style.visibility != "hidden") {
                selector[selectedBoxIndex-1].style.visibility = "hidden"
            }
            
            if (linkboxes[pressedBoxNum-1].style.filter != "drop-shadow(0 0 2px #FFFFFF)") {
                linkboxes[pressedBoxNum-1].style.filter = "drop-shadow(0 0 2px #FFFFFF)"
            }

            if (selectedLinkIndex-1 == links.length) {
                selectedLinkIndex = 1
            }
            
            if (previousSelectedLinkIndex != undefined) {
                const prevLink = links[previousSelectedLinkIndex-1]
                if (prevLink.innerHTML.startsWith("&gt; ")) {
                    prevLink.innerHTML = prevLink.innerHTML.replace("&gt; ", "")
                    prevLink.style = "font-size: 2vw;"
                }
            }

            links[selectedLinkIndex-1].innerHTML = `> ${links[selectedLinkIndex - 1].innerHTML}`
            let fontSize = 2
            // add: change text size on window size change
            while (countLines(links[selectedLinkIndex-1]) > 1) {
                fontSize = fontSize - 0.1
                links[selectedLinkIndex-1].style = `font-size:${fontSize}vw;`
            }

            previousSelectedLinkIndex = selectedLinkIndex
        }

        selectedLinkIndex++
    }
}
function unselect() {
    // function resets values to og state when searchbox is selected
    if (selectedBoxIndex != undefined) {
        const selectedBox = linkboxes[selectedBoxIndex-1]
        const selectedLink = selectedBox.getElementsByClassName("hyperlink")[selectedLinkIndex-2]

        const currentSelector = selector[selectedBoxIndex-1]

        selectedBox.style.filter = "none" // clear shadow

    }
}
document.onkeydown = function(evt) {
    evt = evt || window.event
    switch (evt.key) {
        case "Escape":
            if (search === document.activeElement) {
                search.blur() 
            } else {
               search.focus()
            }
            break
        case "Tab":
            evt.preventDefault()
            if (selectedLinkIndex > 1 && search != document.activeElement) {
                location.href = linkboxes[selectedBoxIndex-1].getElementsByClassName("hyperlink")[selectedLinkIndex-2].getAttribute("href")
            }
            break
        case "Enter":
            if (search === document.activeElement && search.value.trim() != "") {
                location.href = "http://127.0.0.1:5000/search?q=" + search.value.trim()
            }
            break
        default:
            if (isNaN(parseInt(evt.key)) == false) {
                let boxtoSelect = parseInt(evt.key)

                if (boxtoSelect == 0) {
                    boxtoSelect = 10
                }

                if (linkboxes.length > boxtoSelect-1) {
                    select(boxtoSelect)
                }
            }
            break
    }
}

search.addEventListener("focus", () => {
    unselect()
    icon.style.filter = "drop-shadow(0 0 2px #FFFFFF)"
})
search.addEventListener("blur", () => {
    icon.style.filter = "none"

    if (selectedBoxIndex != undefined) {
        selectedLinkIndex = selectedLinkIndex - 1
        select(selectedBoxIndex)
    }
})

search.focus()
countLines(linkboxes[1].getElementsByClassName("hyperlink")[0])
