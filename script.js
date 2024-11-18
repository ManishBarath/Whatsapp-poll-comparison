function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
    console.log("injected")
}

let timeout = 2000;
setTimeout(() => {
    injectScript(chrome.runtime.getURL('moduleraid.js'), 'body');
    setInterval(()=>{
        const buttonsWrapers = document.querySelectorAll(".xaw8158") 
      if (buttonsWrapers) {
          buttonsWrapers.forEach(bw => {
              if (bw.isExportVoted) return;
              const clonedclass = bw.querySelector(".x10b6aqq");
              if (!clonedclass) return; // Check if clonedclass is null
              let cloned = clonedclass.cloneNode(true);
              if (!cloned) return; // Check if cloned is null
              bw.isExportVoted = true;
              cloned.textContent = "Find culp";
              cloned.addEventListener("click", (e) => {
                  console.log("exported");
                  const messageId = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id;
                  console.log(messageId);
                  window.postMessage({ "export": messageId });
                  e.stopPropagation();
              });
              bw.appendChild(cloned);
              bw.style.justifyContent = "space-evenly";
          });
      }
      
      },1000)
}, timeout);