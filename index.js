const lista = document.getElementById("lista");
const btBuscar = document.getElementById("btBuscar");

const inputCheck = document.getElementById("inputCheck");
const inputDescricao = document.getElementById("inputDescricao");
const btAdicionar = document.getElementById("btAdicionar");

let rota = "https://parseapi.back4app.com/classes/Task";

const adicionarLista = (atividades) => {

    lista.innerHTML = "";

    for (atividade of atividades) {

        const novaLinha = document.createElement("tr");

        const campoDescricao = document.createElement("td");
        const campoCheck = document.createElement("td");
        const inputCheck = document.createElement("input");
        const btDelete = document.createElement("button")

        inputCheck.type = "checkbox";
        inputCheck.checked = (atividade.done) ? true : false;

        campoDescricao.innerHTML = atividade.description;
        campoDescricao.className = (atividade.done) ? "atividade-concluida" : "atividade-nao-concluida"
        btDelete.innerHTML = "Remover";

        campoCheck.appendChild(inputCheck);

        novaLinha.appendChild(campoCheck);
        novaLinha.appendChild(campoDescricao);
        novaLinha.appendChild(btDelete);

        novaLinha.id = atividade.objectId;

        lista.appendChild(novaLinha);

        lista.addEventListener("change", (event) => {
            if (event.target.type === "checkbox") {
                const id = event.target.parentNode.parentNode.id;
                console.log(event.currentTarget.childNodes);
                for (atividade of atividades) {
                    if (atividade.objectId === id) {
                        atualizarAtividade(id, atividade)
                    }
                }
            }
        })

    }

}

lista.addEventListener("click", (event) => {
    if (event.target.type === "submit") {
        const id = event.target.parentNode.id;
        console.log(event.target.parentNode)
        deletarAtividade(id);
    }
})

const obterListaAtividades = () => {
    fetch(rota, {
        headers: {
            "X-Parse-Application-Id": "xDLNin6mgZDKXPT2Fx2lQ4YK9uLOrxWarbAnjsi0",
            "X-Parse-REST-API-Key": "FvwAFJ12ouDYfcpKaeJoRu1qfuh6FCDxTz4frsEc", 
        }
    })
        .then((res) => res.json())
        .then((data) => {
            adicionarLista(data.results);
        })
}

obterListaAtividades();

const atualizarAtividade = (id, atividade, event) => {

    let check = (atividade.done) ? false : true;

    const params = {
        method: 'PUT',
        headers: {
            "X-Parse-Application-Id": "xDLNin6mgZDKXPT2Fx2lQ4YK9uLOrxWarbAnjsi0",
            "X-Parse-REST-API-Key": "FvwAFJ12ouDYfcpKaeJoRu1qfuh6FCDxTz4frsEc", 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ done: check })
    };

    fetch(rota + `/${id}`, params)
        .catch((error) => {
            console.log(error);
        })

    obterListaAtividades();
}

const deletarAtividade = (id) => {
    const params = {
        method: 'DELETE',
        headers: {
            "X-Parse-Application-Id": "xDLNin6mgZDKXPT2Fx2lQ4YK9uLOrxWarbAnjsi0",
            "X-Parse-REST-API-Key": "FvwAFJ12ouDYfcpKaeJoRu1qfuh6FCDxTz4frsEc", 
        }
    };

    fetch(rota + `/${id}`, params)
        .then(() => {
            obterListaAtividades();
        })
        .catch((error) => {
            console.log(error);
    })

}

const novaAtividade = () => {

    if(!inputDescricao.value) {
        alert("É necessário digitar a descrição da atividade");
        return;
    }

    const params = {
        method: 'POST',
        headers: {
            "X-Parse-Application-Id": "xDLNin6mgZDKXPT2Fx2lQ4YK9uLOrxWarbAnjsi0",
            "X-Parse-REST-API-Key": "FvwAFJ12ouDYfcpKaeJoRu1qfuh6FCDxTz4frsEc", 
            "Content-Type": "application/json"

        },
        body: JSON.stringify({
            done: inputCheck.checked,
            description: inputDescricao.value
        })
    };
    btAdicionar.disabled = true;
    fetch(rota, params)
        .then((res) => res.json)
        .then(() => {
            btAdicionar.disabled = false;
            inputCheck.checked = (inputCheck.checked) ? false : false;
            inputDescricao.value = "";
            obterListaAtividades();
        })
        .catch((error) => {
            console.log(error);
        })

}

btBuscar.onclick = obterListaAtividades;
btAdicionar.onclick = novaAtividade;
