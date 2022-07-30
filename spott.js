function getUrl(city){
    let url = `https://spott.p.rapidapi.com/places/autocomplete?type=CITY&q=${city}&limit=5`;
    return url
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function listRender(data,list,callback){
    removeAllChildNodes(list);
    for(let item of data){
        let text = item['name'] + "," + item['country']['name'];
        let listitem = document.createElement("li");

        listitem.style.border = "1px solid #ccc";
        listitem.style.fontSize = "20px";
        listitem.style.padding = "3px"
        
        listitem.addEventListener("mouseover",(e)=>{
            e.preventDefault();
            listitem.style.cursor = "pointer";
        })

        listitem.addEventListener("click",()=>{
            callback(listitem.textContent);
            removeAllChildNodes(list);
        });


        let node = document.createTextNode(text)
        listitem.appendChild(node);
        list.appendChild(listitem);
    }
}

function autocomplete(idSearch,idspotSearchBox,callback){
    const searchDiv =  document.getElementById(idSearch);
    const spotSearchBox = document.getElementById(idspotSearchBox);

    let list = document.createElement("ul");
    list.style.listStyleType = "none";
    list.style.backgroundColor = "white";
    list.style.color = "black";
    list.style.padding = "0";
    list.style.margin = "0";
    list.style.width =  searchDiv.style.width;
    list.style.borderRadius = "10px"
    
    searchDiv.appendChild(list);

    spotSearchBox.addEventListener("input",()=>{
            removeAllChildNodes(list);
    })
    

    spotSearchBox.addEventListener("keydown",(e)=>{
        if(spotSearchBox.value.length <= 1){
            removeAllChildNodes(list);
            return;
        }
            

        fetch(getUrl(spotSearchBox.value), {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "spott.p.rapidapi.com",
                "x-rapidapi-key": SPOTT_API_KEY
            }
        })
        .then(response => response.json())
        .then(data => listRender(data,list,callback))
        .catch(err => {
            console.error(err);
        });
    })
    
}

