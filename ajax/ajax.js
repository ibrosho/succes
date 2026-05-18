// https://restcountries.com/v3.1/all?fields=name,flag
// https://restcountries.com/v3.1/name/{name}?fullText=true

window.addEventListener('load', function () {
    // Move selectors inside the load event to ensure elements exist
    const appid = document.getElementById("app-id");
    const flag = document.getElementById("flag"); 
    const loading = document.getElementById("loading");
    const other = document.getElementById("other");

    const xhr = new XMLHttpRequest(); 
    xhr.open("GET", "https://restcountries.com/v3.1/all?fields=name,flag");
    xhr.send();

    xhr.onload = function () {
        let data = xhr.responseText;
        data = JSON.parse(data);

        let opt = "";
        for (let c of data) {
            opt += `<option value="${c.name.common}">${c.name.common}</option>`;
        }
        const selectc = document.createElement("select");
        selectc.innerHTML = opt; 
        appid.appendChild(selectc);

        selectc.addEventListener("change", function (e) {
            loading.style.display = "inline";

            let country = e.target.value;  

            const xhr2 = new XMLHttpRequest();
            xhr2.open("GET", "https://restcountries.com/v3.1/name/" + country + "?fullText=true");
            xhr2.send();

            xhr2.onload = function () {
                let data2 = JSON.parse(xhr2.responseText);
                const coa = document.createElement("img");
                const pop = document.createElement("div");
                const currency = document.createElement("div");
                const languages = document.createElement("div");

                pop.innerHTML =  data2[0].population;
                currency.innerHTML =  data2[0].currencies[Object.keys(data2[0].currencies)[0]].name;
                languages.innerHTML =  Object.values(data2[0].languages).join(", ");

              
                flag.src = data2[0].flags.svg;
                coa.style.width = "80px";
                coa.style.height = "80px";
                coa.src = data2[0].coatOfArms.svg;


                other.innerHTML = "";
                other.appendChild(coa);
                other.appendChild(pop);
                other.appendChild(currency);
                other.appendChild(languages);



                
            };

            xhr2.onreadystatechange = function () {
                if (xhr2.readyState === 4 && xhr2.status === 200) {
                    loading.style.display = "none";
                }
            };
        });
    };
});