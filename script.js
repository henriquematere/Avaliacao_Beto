const despesaForm = document.getElementById("despesa-form");
const nomeDespesaInput = document.getElementById("nome-despesa");
const valorDespesaInput = document.getElementById("valor-despesa");
const dataDespesaInput = document.getElementById("data-despesa");
const despesaList = document.getElementById("despesa-list");
const totalDespesa = document.getElementById("total-despesas");
const searchInput = document.getElementById("search-input");
const eraseButton = document.getElementById("erase-button");

let despesas = JSON.parse(localStorage.getItem("despesas")) || [];

function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;   // Tive que pesquisar, fiquei com agonia da data invertida.
}

function exibirDespesas() {
    despesaList.innerHTML = "";
    let total = 0;

    despesas.forEach((despesa, index) => {
        const dataFormatada = formatarData(despesa.data);
        const divDespesa = document.createElement("div");
        divDespesa.classList.add("expense-item");

        divDespesa.innerHTML = `
            <div>${despesa.nome}</div>
            <div>R$ ${parseFloat(despesa.valor).toFixed(2)}</div>
            <div>${dataFormatada}</div>
            <button class="btn btn-danger" onclick="removerDespesa(${index})">Remover</button>
        `;

        despesaList.appendChild(divDespesa);

        total += parseFloat(despesa.valor);
    });

    totalDespesa.textContent = total.toFixed(2);

    localStorage.setItem("despesas", JSON.stringify(despesas));
}

despesaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = nomeDespesaInput.value.trim();
    const valor = valorDespesaInput.value.trim();
    const data = dataDespesaInput.value;

    if (nome && valor && data) {
        const novaDespesa = {
            nome: nome,
            valor: valor,
            data: data,
            feita: false
        };

        despesas.push(novaDespesa);

        despesaForm.reset();

        exibirDespesas();
    }
});

function removerDespesa(index) {
    despesas.splice(index, 1);
    exibirDespesas();
}

searchInput.addEventListener("keyup", (e) => {
    const termoDeBusca = e.target.value.toLowerCase();

    document.querySelectorAll(".expense-item").forEach((item) => {
        const nomeDespesa = item.children[0].textContent.toLowerCase();
        if (nomeDespesa.includes(termoDeBusca)) {
            item.style.display = "grid";
        } else {
            item.style.display = "none";
        }
    });
});

eraseButton.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
});

document.addEventListener("DOMContentLoaded", exibirDespesas);
