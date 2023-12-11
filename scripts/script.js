let sadrzaj = document.getElementById("sadrzaj");
let btnSearch = document.getElementById("Search");

/*Za prikaz podataka prilikom ucitavanja stranice*/
ucitajPodatke(podaci);

document.getElementById("logo").addEventListener("click", () => {
  window.location.href =
    "file:///C:/Users/KORISNIK/Desktop/Veb%20programiranje%20-%20PROJEKAT/index.html";
});

function ucitajPodatke(niz) {
  sadrzaj.innerHTML = "";

  for (let i = 0; i < niz.length; i++) {
    // proizvod container
    let proizvod = document.createElement("div");
    proizvod.className = "proizvod";
    proizvod.id = niz[i].id;

    // proizvod.innerHTML +='<img class="slikeProizvoda" id="' +niz[i].id +'" src ="' +niz[i].slika +'">';
    let divSlika = document.createElement("div");
    divSlika.className = "hover-element";

    let slikaProizv = document.createElement("img");
    slikaProizv.src = niz[i].slika;
    slikaProizv.className = "slikeProizvoda";
    slikaProizv.id = niz[i].id;

    let divTekst = document.createElement("div");
    divTekst.className = "tekst";
    divTekst.textContent = "Pogledaj vise informacija...";

    proizvod.appendChild(divSlika);
    divSlika.appendChild(slikaProizv);
    divSlika.appendChild(divTekst);

    PrikaziProzorIsk();
    slikaProizv.addEventListener("click", () => {
      for (i = 0; i < podaci.length; i++) {
        if (podaci[i].id.toString() === slikaProizv.id.toString()) {
          var prozor = document.getElementById("Prozor");
          prozor.innerHTML +=
            '<img class="slikeProizvoda" src ="' + podaci[i].slika + '">';
          let prozorPod = document.createElement("div");
          prozorPod.id = "ProzorPodaci";
          prozor.appendChild(prozorPod);

          let naslov = document.createElement("h3");
          naslov.textContent = podaci[i].naziv_proizvoda;
          prozorPod.appendChild(naslov);

          let opisPr = document.createElement("p");
          opisPr.textContent = podaci[i].opis;
          prozorPod.appendChild(opisPr);

          let cenaPr = document.createElement("p");
          cenaPr.textContent = podaci[i].cena + " RSD";
          cenaPr.className = "cenaIsk";
          prozorPod.appendChild(cenaPr);
        }
      }
    });

    let nazivProizvoda = document.createElement("h2");
    nazivProizvoda.textContent = niz[i].naziv_proizvoda;
    nazivProizvoda.className = "nazivProizvoda";

    let cena = document.createElement("span");
    cena.textContent = niz[i].cena + " RSD";
    cena.className = "cena";

    let slikaSrce = document.createElement("img");
    slikaSrce.src = "images/srce2.png";
    slikaSrce.className = "dodajOmiljeno";
    slikaSrce.id = niz[i].id;

    //LOCAL STORAGE
    slikaSrce.addEventListener("click", () => {
      let listaOmiljenihProizvoda = [];
      if (localStorage.getItem("omiljeniProizvodi")) {
        let postojeciProizvodi = localStorage.getItem("omiljeniProizvodi");
        let nizProizvoda = postojeciProizvodi.split(",");
        console.log(slikaSrce);
        if (!nizProizvoda.includes(slikaSrce.id)) {
          listaOmiljenihProizvoda.push(
            localStorage.getItem("omiljeniProizvodi")
          );
          listaOmiljenihProizvoda.push(slikaSrce.id);
          localStorage.setItem("omiljeniProizvodi", listaOmiljenihProizvoda);
        }
      } else {
        localStorage.setItem("omiljeniProizvodi", slikaSrce.id);
      }
    });
    sadrzaj.appendChild(proizvod);
    proizvod.appendChild(nazivProizvoda);
    proizvod.appendChild(cena);
    proizvod.appendChild(slikaSrce);
  }
}

window.onload = function () {
  let kategorija = dobaviKategorijuIzUrl();
  let podkategorija = dobaviPodkategorijuIzUrl();

  if (!kategorija && !podkategorija) {
    ucitajPodatke(podaci);
  } else {
    var podaciNovi;
    if (kategorija && podkategorija) {
      podaciNovi = filtrirajPoPodkategoriji(podkategorija, kategorija);
    } else if (kategorija && !podkategorija) {
      podaciNovi = filtrirajPoKategoriji(kategorija);
    }
    ucitajPodatke(podaciNovi);
  }
};

/*Pretrazivanje proizvoda iz Search bara*/
let search = document.getElementById("SearchBarUnos");

search.addEventListener("keyup", (e) => {
  let searchString = e.target.value.toUpperCase();
  let filtriraniPodaci = [];
  filtriraniPodaci = podaci.filter((podatak) => {
    return podatak.naziv_proizvoda.toUpperCase().includes(searchString);
  });
  ucitajPodatke(filtriraniPodaci);

  //da prilikom pretrage mozemo da sacuvamo u omiljeno proizvode
  for (let omiljeno of btnOmiljeno) {
    omiljeno.addEventListener("click", () => {
      let listaOmiljenihProizvoda = [];
      if (localStorage.getItem("omiljeniProizvodi")) {
        let postojeciProizvodi = localStorage.getItem("omiljeniProizvodi");
        let nizProizvoda = postojeciProizvodi.split(",");
        if (!nizProizvoda.includes(omiljeno.id)) {
          listaOmiljenihProizvoda.push(
            localStorage.getItem("omiljeniProizvodi")
          );
          listaOmiljenihProizvoda.push(omiljeno.id);
          localStorage.setItem("omiljeniProizvodi", listaOmiljenihProizvoda);
        }
      } else {
        localStorage.setItem("omiljeniProizvodi", omiljeno.id);
      }
    });
  }
  let podaciOOmPr = dobaviOmiljeneProizvode();
  prikaziOmiljeneProizvode(podaciOOmPr);
});

//FILTER
let sadrzajFiltera = document.getElementById("sadrzajFilteraContainer");
let filteri = document.getElementById("Filteri");

filteri.addEventListener("click", prikaziFiltere);

function prikaziFiltere() {
  sadrzajFiltera.classList.toggle("Sakriveno");
  btnBrisi.classList.toggle("Sakriveno");
}

let ddlKategorija = document.getElementById("kategorijaPr");
let ddlPodkategorija = document.getElementById("podkategorijaPr");
let btnFiltriraj = document.getElementById("btnFiltriraj");

//Popuni ddl Kategorije
let nizKategorija = new Set();
for (let podatak of podaci) {
  nizKategorija.add(podatak.kategorija);
}
for (let kat of nizKategorija) {
  ddlKategorija.innerHTML += `<option value="${kat}">${kat}</option>`;
}

//Popuni ddlPodkategoriju na osnovu oznacene kategorije
ddlKategorija.addEventListener("change", function () {
  if (ddlKategorija.value != "izaberite") {
    popuniDDLPodkategoriju();
  }
});

function popuniDDLPodkategoriju() {
  ddlPodkategorija.innerHTML = `<option value="izaberite" selected="" disabled ="">Izaberite...</option>`;

  let podkategorije = new Set();
  let filtriranaPodkategorija = podaci.filter((element) => {
    if (element.kategorija == ddlKategorija.value) {
      return true;
    } else {
      return false;
    }
  });
  for (let jedinstven of filtriranaPodkategorija) {
    podkategorije.add(jedinstven.podkategorija);
  }
  for (let p of podkategorije) {
    let opcija = document.createElement("option");
    opcija.value = p;
    opcija.textContent = p;
    ddlPodkategorija.appendChild(opcija);
  }
}

let sortirajFilter = document.getElementById("sortiraj");

btnFiltriraj.addEventListener("click", () => {
  podaci.sort(sortiraj);
  ucitajPodatke(podaci);
  let podaciNovi;

  if (ddlKategorija.value === "izaberite" && ddlPodkategorija.value === "") {
    podaciNovi = ucitajPodatke(podaci);
  } else if (
    ddlKategorija.value !== "izaberite" &&
    ddlPodkategorija.value !== "izaberite"
  ) {
    setujUrlParametre(ddlPodkategorija.value, ddlKategorija.value);
    podaciNovi = filtrirajPoPodkategoriji(
      ddlPodkategorija.value,
      ddlKategorija.value
    );
    ucitajPodatke(podaciNovi);
  } else if (
    ddlKategorija.value !== "izaberite" &&
    ddlPodkategorija.value === "izaberite"
  ) {
    setujUrlParametre(ddlKategorija.value);
    podaciNovi = filtrirajPoKategoriji(ddlKategorija.value);
    ucitajPodatke(podaciNovi);
  } else if (sortirajFilter.value !== "izaberite") {
    podaciNovi = podaci.sort(sortiraj);
    ucitajPodatke(podaciNovi);
  }

  //za oznacavanje omiljenog
  let btnOmiljeno = document.getElementsByClassName("dodajOmiljeno");
  for (let omiljeno of btnOmiljeno) {
    omiljeno.addEventListener("click", () => {
      let listaOmiljenihProizvoda = [];
      if (localStorage.getItem("omiljeniProizvodi")) {
        let postojeciProizvodi = localStorage.getItem("omiljeniProizvodi");
        let nizProizvoda = postojeciProizvodi.split(",");
        if (!nizProizvoda.includes(omiljeno.id)) {
          listaOmiljenihProizvoda.push(
            localStorage.getItem("omiljeniProizvodi")
          );
          listaOmiljenihProizvoda.push(omiljeno.id);
          localStorage.setItem("omiljeniProizvodi", listaOmiljenihProizvoda);
        }
      } else {
        localStorage.setItem("omiljeniProizvodi", omiljeno.id);
      }
    });
    let podaciOOmPr = dobaviOmiljeneProizvode();
    prikaziOmiljeneProizvode(podaciOOmPr);
  }
});

//sortiranje
function sortiraj(x, y) {
  if (sortirajFilter.value == "cenaRastuce") {
    if (x.cena > y.cena) {
      return 1;
    } else if (x.cena < y.cena) {
      return -1;
    } else {
      return 0;
    }
  } else if (sortirajFilter.value == "cenaOpadajuce") {
    if (x.cena < y.cena) {
      return 1;
    } else if (x.cena > y.cena) {
      return -1;
    } else {
      return 0;
    }
  }
}

//brisanje filtera
let btnBrisi = document.getElementById("BirisiFilter");
btnBrisi.addEventListener("click", brisiFiltere);

function brisiFiltere() {
  ddlKategorija.value = "izaberite";
  ddlPodkategorija.value = "";
  sortirajFilter.value = "izaberite";
  ucitajPodatke(podaci);

  //za oznacavanje omiljenog
  for (let omiljeno of btnOmiljeno) {
    omiljeno.addEventListener("click", () => {
      let listaOmiljenihProizvoda = [];
      if (localStorage.getItem("omiljeniProizvodi")) {
        let postojeciProizvodi = localStorage.getItem("omiljeniProizvodi");
        let nizProizvoda = postojeciProizvodi.split(",");
        if (!nizProizvoda.includes(omiljeno.id)) {
          listaOmiljenihProizvoda.push(
            localStorage.getItem("omiljeniProizvodi")
          );
          listaOmiljenihProizvoda.push(omiljeno.id);
          localStorage.setItem("omiljeniProizvodi", listaOmiljenihProizvoda);
        }
      } else {
        localStorage.setItem("omiljeniProizvodi", omiljeno.id);
      }
    });
  }
  let podaciOOmPr = dobaviOmiljeneProizvode();
  prikaziOmiljeneProizvode(podaciOOmPr);
}

function filtrirajPoKategoriji(e) {
  let izabranaKategorija = e.toUpperCase();
  let filtriranoPoKat = [];
  filtriranoPoKat = podaci.filter((podatak) => {
    return podatak.kategorija.toUpperCase().includes(izabranaKategorija);
  });
  // ucitajPodatke(filtriranoPoKat);
  return filtriranoPoKat;
}

function filtrirajPoPodkategoriji(e, e2) {
  let izabranaPodkategorija = e.toUpperCase();
  let izabranaKategorija = e2.toUpperCase();
  let filtriranoPoPodkat = [];
  filtriranoPoPodkat = podaci.filter((podatak) => {
    return (
      podatak.kategorija.toUpperCase().includes(izabranaKategorija) &&
      podatak.podkategorija.toUpperCase().includes(izabranaPodkategorija)
    );
  });
  // ucitajPodatke(filtriranoPoPodkat);
  return filtriranoPoPodkat;
}

//DODELA PODATAKA ISKACUCEM PROZORU
function PrikaziProzorIsk() {
  let omotacProzora = document.getElementById("OmotacProzora");
  let slike = document.getElementsByClassName("slikeProizvoda");

  for (let slika of slike) {
    slika.addEventListener("click", () => {
      omotacProzora.classList.add("PrikaziProzor");
    });
  }

  omotacProzora.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      omotacProzora.classList.remove("PrikaziProzor");
      var prozor = document.getElementById("Prozor");
      prozor.innerHTML = "";
    }
  });
  let proizvodi = document.getElementsByClassName("proizvod");
  let prozor = document.getElementById("Prozor");
  let slikaPr = document.getElementsByClassName("slikeProizvoda");

  for (let slika of slikaPr) {
    slika.addEventListener("click", (event) => {});
  }
}

function dobaviOmiljeneProizvode() {
  let omiljeniProizvodi = localStorage.getItem("omiljeniProizvodi");
  let nizOmiljenihProizvoda = omiljeniProizvodi.split(",");
  let podaciOOmiljenimProizvodima = [];

  for (let i = 0; i < podaci.length; i++) {
    if (nizOmiljenihProizvoda.includes(podaci[i].id.toString())) {
      podaciOOmiljenimProizvodima.push(podaci[i]);
    }
  }
  return podaciOOmiljenimProizvodima;
}

//OMILJENO
let omiljenoBtn = document.getElementById("bag_ikonica");
let omiljenoContainer = document.getElementById("Omiljeno");
let zatvoriOmiljeno = document.getElementById("ZatvoriOmiljeno");
let sadrzajOmiljeno = document.getElementById("SadrzajOmiljeno");

omiljenoBtn.addEventListener("click", () => {
  prikaziOmiljeno();

  let podaciOOmPr = dobaviOmiljeneProizvode();
  prikaziOmiljeneProizvode(podaciOOmPr);
});
zatvoriOmiljeno.addEventListener("click", () => {
  omiljenoContainer.classList.add("Sakriveno");
});

function prikaziOmiljeno(nizOmiljeno) {
  omiljenoContainer.classList.remove("Sakriveno");
}

function prikaziOmiljeneProizvode(nizOmiljeno) {
  sadrzajOmiljeno.innerHTML = "";
  for (let i = 0; i < nizOmiljeno.length; i++) {
    let boxOmiljeno = document.createElement("div");
    boxOmiljeno.className = "BoxOmiljeno";

    boxOmiljeno.innerHTML +=
      '<img class="OmiljenoImg" src ="' + nizOmiljeno[i].slika + '">';

    let omiljenoDetaljnije = document.createElement("div");
    omiljenoDetaljnije.className = "OmiljenoDetaljnije";

    let omiljenoNazivPr = document.createElement("div");
    omiljenoNazivPr.className = "OmiljenoNaslov";
    omiljenoNazivPr.textContent = nizOmiljeno[i].naziv_proizvoda;

    let omiljenoCena = document.createElement("div");
    omiljenoCena.className = "OmiljenoCena";
    omiljenoCena.textContent = nizOmiljeno[i].cena + " RSD";

    sadrzajOmiljeno.appendChild(boxOmiljeno);
    boxOmiljeno.appendChild(omiljenoDetaljnije);
    omiljenoDetaljnije.appendChild(omiljenoNazivPr);
    omiljenoDetaljnije.appendChild(omiljenoCena);

    boxOmiljeno.innerHTML +=
      '<img class="ObrisiOmiljeno" src="images/smece.png">';
  }
  let btnObrisiOmiljeno = document.getElementsByClassName("ObrisiOmiljeno");
  for (let obrisi of btnObrisiOmiljeno) {
    obrisi.addEventListener("click", () => {
      console.log("kliknuo");
    });
  }
}

//query string
function setujUrlParametre(podatakOPodkategoriji, podatakOKategoriji) {
  var params = new URLSearchParams(
    "file:///C:/Users/KORISNIK/Desktop/Veb%20programiranje%20-%20PROJEKAT/index.html"
  ); //window.location.search

  if (!podatakOPodkategoriji && !podatakOKategoriji) {
    window.location.href =
      "file:///C:/Users/KORISNIK/Desktop/Veb%20programiranje%20-%20PROJEKAT/index.html";
  } else if (podatakOPodkategoriji && podatakOKategoriji) {
    params.set("kategorija", podatakOKategoriji);
    params.set("podkategorija", podatakOPodkategoriji);
  } else if (podatakOPodkategoriji) {
    params.set("kategorija", podatakOPodkategoriji); //
  }
  window.location.search = params.toString();
}

// Dobijanje kategorija i podkategorija iz URL-a
function dobaviKategorijuIzUrl() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var kategorija = url.searchParams.get("kategorija");
  return kategorija;
}

function dobaviPodkategorijuIzUrl() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var podkategorija = url.searchParams.get("podkategorija");
  return podkategorija;
}
