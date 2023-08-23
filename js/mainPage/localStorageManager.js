function saveSrajContainerState() {
    const mainContainerHTML = document.querySelector('.sraj-modules-container').innerHTML;
    localStorage.setItem('srajContainerState', mainContainerHTML);
    console.log(mainContainerHTML);
}

function restoreSrajContainerState() {
    const srajModuleContainer = document.querySelector(".sraj-modules-container")
    const mainContainerHTML = localStorage.getItem('srajContainerState');
    if (mainContainerHTML) {
        srajModuleContainer.innerHTML = mainContainerHTML;
    }
}

document.addEventListener("DOMContentLoaded", restoreSrajContainerState());