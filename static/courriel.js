var message_recu = document.querySelector("#liste_mr");
var liste_contact = document.querySelector("#liste_contact");
var div_list_message = document.querySelector(".Message");
var div_form_newMessage = document.querySelector(".Ecrire_un_Message");
var div_form_newContact = document.querySelector(".creer_contact");

var role;

var contacts = null;
var messages = null;

function chercher(element, messages){
    for(var i = 0; i < messages.length; i++){
        if(element.nom === messages[i].nom && element.PublicKey ===messages[i].PublicKey && element.PrivateKey ===messages[i].PrivateKey){
            return true;
        }
    }
    return false
}

function updateMessage(messages, messagesOtherServer){
    for(var i = 0; i < messagesOtherServer.length; i++){
        if(!chercher(messagesOtherServer[i], messages)){
            messages.push(messagesOtherServer[i]);
        }
}
}

fetch('http://localhost:8991/messages')
.then(res => res.json())
.then(data => {
    localStorage.setItem("messages", JSON.stringify(data));
})
.catch(error => console.error(error))


fetch('http://localhost:8991/recepteurs')
  .then(response => response.json())
  .then(data => {
    localStorage.setItem("contacts", JSON.stringify(data));
  })
  .catch(error => console.error(error))

contacts = JSON.parse(localStorage.getItem("contacts"))
messages = JSON.parse(localStorage.getItem("messages"))


role = JSON.parse(localStorage.getItem('role'))
if(role === null){
    var p = Math.floor(Math.random() * contacts.length)
    role = contacts[p]
    localStorage.setItem('role', JSON.stringify(role))
}

function chargement(){
    setManyDisplayNOne([liste_contact, div_form_newMessage, div_form_newContact]);
    setManyDisplayBlock([message_recu, div_list_message])
    setManyDisplayBlock(message_recu.children)
    select = document.getElementById("contact-select");

    // Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
  socket.send("contacts")
});



// Listen for messages
socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data.text);
    updateMessage(contacts, event.data);
  });
    role = JSON.parse(localStorage.getItem('role'))
    // chargement des contacts
    for(var i = 0; i < contacts.length; i++){

        //Creation de la div pour contact
        div_contact = document.createElement("div");
        div_contact.setAttribute("class", "contact");
        div_contact.setAttribute("id", "contact_" + i);
        lien = document.createElement("a");
        lien.setAttribute("href", "#");
        lien.setAttribute("class", "lien");
        lien.setAttribute("id", "contact" + i);
        lien.setAttribute("onclick", "clickDivC(id)");
        div_contact.appendChild(lien);
        icone = document.createElement("i");
        icone.setAttribute("class", "fa fa-user");
        icone.setAttribute("aria-hidden", "true");
        lien.appendChild(icone);
        icone1 = document.createElement("i");
        icone1.setAttribute("class", "fa fa-trash-o");
        icone1.setAttribute("aria-hidden", "true");
        icone1.setAttribute("id","trash" + i);
        icone1.setAttribute("onclick", "deleteC(id)");
        icone2 = document.createElement("i");
        icone2.setAttribute("class", "fa fa-pencil");
        icone2.setAttribute("aria-hidden", "true");
        icone2.setAttribute("id","modifier" + i);
        icone2.setAttribute("onclick", "modifier(id)");
        paragraphe = document.createElement("p");
        paragraphe.innerHTML = contacts[i].nom;
        lien.appendChild(paragraphe);
        div_contact.appendChild(icone1);
        div_contact.appendChild(icone2);
        document.getElementById("liste_contact").appendChild(div_contact);

        //creation pour l'option

        option = document.createElement("option")
        option.setAttribute("value", contacts[i].nom)
        option.textContent = contacts[i].nom;
        select.appendChild(option);
    }

    socket.addEventListener("open", (event) => {
        socket.send("Hello Server!");
        socket.send("message")
      });


    // Listen for messages
socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
    updateMessage(messages, event.data); //synchronisation des messages
  });
    // chargement des messages


    for(var i = 0; i < messages.length; i++){
        
        const publicKey = forge.pki.publicKeyFromPem(role.PublicKey);
        const privateKey = forge.pki.privateKeyFromPem(role.PrivateKey);
        var keyPair = { privateKey, publicKey };
        var mesg;
        var emet;
        try {
            mesg = forge.util.decodeUtf8(keyPair.privateKey.decrypt(forge.util.decode64(messages[i].message)));
            emet = messages[i].emetteur;
            console.log(mesg, emet)
        } catch (error) {
            
        }
        if(mesg !== undefined){
            div_contact = document.createElement("div");
        div_contact.setAttribute("class", "contact");
        lien = document.createElement("a");
        lien.setAttribute("href", "#");
        lien.setAttribute("class", "lien");
        lien.setAttribute("id", "message" + i);
        lien.setAttribute("onclick", "clickDiv(id)");
        icone = document.createElement("i");
        icone.setAttribute("class", "fa fa-user");
        icone.setAttribute("aria-hidden", "true");
        lien.appendChild(icone);
        sous_div = document.createElement("div");
        titre = document.createElement("h4");
        titre.innerHTML = emet;
        sous_div.appendChild(titre);
        lien.appendChild(sous_div);
        div_contact.appendChild(lien);
        paragraphe = document.createElement("p");
        paragraphe.innerHTML = mesg;
        lien.appendChild(paragraphe);
        document.getElementById("liste_mr").appendChild(div_contact);
        }
        
    }
    
}

function appearNewMessage(){
    setManyDisplayNOne([div_list_message, div_form_newContact]);
    setDisplayblock(div_form_newMessage);
}

function setDisplaynone(element){
    element.setAttribute("style", "display: none;");
}

function setDisplayblock(element){
    element.setAttribute("style", "display: block;");
}

function setManyDisplayBlock(tabOfElement){
    for(var i = 0; i < tabOfElement.length; i++){
        setDisplayblock(tabOfElement[i]);
    }
}

function setManyDisplayNOne(tabOfElement){
    for(var i = 0; i < tabOfElement.length; i++){
        setDisplaynone(tabOfElement[i]);
    }
}



function click_Lc(){
    setManyDisplayNOne([message_recu, div_form_newMessage, div_list_message]);
    setManyDisplayBlock([liste_contact, div_form_newContact]);
    setManyDisplayBlock(liste_contact.children)
}

function rechercher(){
    var recherche = document.getElementById("recherche").value; //valeur à rechercher
    var grande_div = document.getElementsByClassName("liste_contact")[0].children; 
    for(var i = 0; i < grande_div.length; i++){
        if (grande_div[i].getAttribute("style").search("block") != -1){
            var idName = grande_div[i].id;
            var paragraphes = document.querySelectorAll("#" + idName + " p");
            console.log(paragraphes)
            for(var i = 0; i < paragraphes.length; i++){
                if(paragraphes[i].innerHTML.search(recherche) == -1){
                    var parentN = paragraphes[i].parentNode.parentNode;
                    parentN.setAttribute("style", "display: none;")
                }
        
            }
        }
    }
    document.getElementById("recherche").value = "";
    /*var paragraphes = document.querySelectorAll("#liste_mr p");
    for(var i = 0; i < paragraphes.length; i++){
        if(paragraphes[i].innerHTML.search(recherche) == -1){
            var parentN = paragraphes[i].parentNode.parentNode;
            parentN.setAttribute("style", "display: none;")
        }

    }*/
}

function newContact(){
    nomContact = document.getElementById("name_contact").value;
    if (notExist(nomContact, contacts)){
        var keypair = forge.pki.rsa.generateKeyPair({ bits: 1024 });;
        console.log(forge.pki.privateKeyToPem(keypair.privateKey))
        var contact = {"nom": nomContact, "PublicKey": forge.pki.publicKeyToPem(keypair.publicKey), "PrivateKey": forge.pki.privateKeyToPem(keypair.privateKey)};
        contacts.push(contact);
        localStorage.setItem("contacts", JSON.stringify(contacts));
        fetch('http://localhost:8991/recepteurs/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })
        .then(res => {
            return res.json()
        })
        .then(data => console.log(data))
    }else{
        alert("Vous n'avez pas entrer le nom du contact / Ou ce contact existe déjà ");
    }
 
    div_contact = document.createElement("div");
    div_contact.setAttribute("class", "contact");
    div_contact.setAttribute("id", "contact_" + contacts.length);
    lien = document.createElement("a");
    lien.setAttribute("href", "#");
    lien.setAttribute("class", "lien");
    lien.setAttribute("id", "contact" + contacts.length);
    lien.setAttribute("onclick", "clickDivC(id)");
    div_contact.appendChild(lien);
    icone = document.createElement("i");
    icone.setAttribute("class", "fa fa-user");
    icone.setAttribute("aria-hidden", "true");
    lien.appendChild(icone);
    paragraphe = document.createElement("p");
    paragraphe.innerHTML = nomContact;
    lien.appendChild(paragraphe);
    icone1 = document.createElement("i");
    icone1.setAttribute("class", "fa fa-trash-o");
    icone1.setAttribute("aria-hidden", "true");
    icone1.setAttribute("id","trash" + contacts.length);
    icone1.setAttribute("onclick", "deleteC(id)");
    icone2 = document.createElement("i");
    icone2.setAttribute("class", "fa fa-pencil");
    icone2.setAttribute("aria-hidden", "true");
    icone2.setAttribute("id","modifier" + contacts.length);
    icone2.setAttribute("onclick", "modifier(id)");
    div_contact.appendChild(icone1);
    div_contact.appendChild(icone2);
    document.getElementById("liste_contact").appendChild(div_contact);
    document.getElementById("name_contact").value = "";

    return false;
}
function notExist(element, liste){
    if(element.localeCompare("") === 0){
        return false
    }
    for(var i = 0; i < liste.length; i++){
        if(liste[0].nom.localeCompare(element) === 0){
            return false;
        }
    }
    return true
}
async function newMessage(){
    nom_dest = document.getElementById("contact-select").value;
    var contact;
    for(var i=0; i < contacts.length; i++){
        if(contacts[i].nom.localeCompare(nom_dest) === 0){
            contact = contacts[i];
            break;
        }
    }
    const publicKey = forge.pki.publicKeyFromPem(contact.PublicKey);
    const privateKey = forge.pki.privateKeyFromPem(contact.PrivateKey);
    var keyPair = { privateKey, publicKey };
    var story = document.getElementById("story").value;
    story = forge.util.encode64(keyPair.publicKey.encrypt(forge.util.encodeUtf8(story)));
    messages.push({"emetteur": role.nom, "message": story});

    localStorage.setItem("messages", JSON.stringify(messages));
    await fetch('http://localhost:8991/messages/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"emetteur": role.nom, "message": story})
        })
        .then(res => {
            return res.json()
        })
        .then(data => console.log(data))
    console.log(messages);
    exemple = JSON.parse(localStorage.getItem("messages"));
    console.log(exemple)


    return false;

}

function clickDiv(id_DIv){
    document.querySelector(".Message h1").innerHTML = document.querySelector("#" + id_DIv + " h4").innerHTML;
    document.querySelector(".Message p").innerHTML = document.querySelector("#" + id_DIv + " p").innerHTML;
}

function clickDivC(id_DIv){
    setDisplayblock(div_list_message)
    setManyDisplayNOne([div_form_newMessage, div_form_newContact])
    document.querySelector(".Message h1").innerHTML = document.querySelector("#" + id_DIv + " p").innerHTML;
    document.querySelector(".Message p").innerHTML = "";
}

function arrayBufferToBase64(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    console.log(byteArray);
    var byteString = '';
    for(var i=0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    var b64 = window.btoa(byteString);

    return b64;
}



function deleteC(id){
    var nomC = document.getElementById(id).parentElement.querySelector("p").textContent;

    var index = contacts.findIndex(element => element.nom.localeCompare(nomC) === 0);
    contacts.splice(index, 1);
    localStorage.setItem("contacts", JSON.stringify(contacts));
    setDisplaynone(document.getElementById(id).parentElement);
}

function modifier(id){
    var nomC = document.getElementById(id).parentElement.querySelector("p").textContent;
    reponse = prompt("Voulez vous changer le nom? oui/non")
    if(reponse.localeCompare("oui") === 0){
        nouveauN = prompt("Entrer le nouveau nom", nomC);
        if(confirm("Voulez-vous aussi changer sa clé publique?")){
            crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 2048, // can be 1024, 2048 or 4096
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: {name: "SHA-256"} // or SHA-512
                },
                true,
                ["encrypt", "decrypt"]
            ).then( function(keyPair) {
                /* now when the key pair is generated we are going
                   to export it from the keypair object in pkcs8
                */
                window.crypto.subtle.exportKey(
                    "spki",
                    keyPair.publicKey
                ).then(function(exportedPublicKey) {
                    // converting exported private key to PEM format
                    var pem = addNewLines(arrayBufferToBase64(exportedPublicKey));
                    console.log(contacts);
                    var index = contacts.findIndex(element => element.nom.localeCompare(nomC) === 0);
                    contacts[index].nom = nouveauN;
                    contacts[index].publicKey = pem;
                    document.getElementById(id).parentElement.querySelector("p").textContent = nouveauN;
                    localStorage.setItem("contacts", JSON.stringify(contacts));
                }).catch(function(err) {
                    console.log(err);
                }); 
            });
        }else{
            var index = contacts.findIndex(element => element.nom.localeCompare(nomC) === 0);
            contacts[index].nom = nouveauN;
            document.getElementById(id).parentElement.querySelector("p").textContent = nouveauN;
            localStorage.setItem("contacts", JSON.stringify(contacts));
        }
    }
}

