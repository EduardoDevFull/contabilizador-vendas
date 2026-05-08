// script.js

let vendas =
  JSON.parse(localStorage.getItem("vendas")) || []

let funcionarios =
  JSON.parse(localStorage.getItem("funcionarios")) || [
    "Eduardo"
  ]

function salvarLocalStorage(){

  localStorage.setItem(
    "vendas",
    JSON.stringify(vendas)
  )

  localStorage.setItem(
    "funcionarios",
    JSON.stringify(funcionarios)
  )

}

function carregarFuncionarios(){

  const select =
    document.getElementById("funcionario")

  const lista =
    document.getElementById("listaFuncionarios")

  select.innerHTML = ""
  lista.innerHTML = ""

  funcionarios.forEach((nome,index)=>{

    const option =
      document.createElement("option")

    option.value = nome
    option.textContent = nome

    select.appendChild(option)

    const li =
      document.createElement("li")

    li.innerHTML = `
      ${nome}

      <button
        class="excluir"
        onclick="removerFuncionario(${index})">
        X
      </button>
    `

    lista.appendChild(li)

  })

}

function adicionarFuncionario(){

  const input =
    document.getElementById("novoFuncionario")

  const nome = input.value.trim()

  if(nome === ""){
    alert("Digite um nome")
    return
  }

  funcionarios.push(nome)

  salvarLocalStorage()

  carregarFuncionarios()

  input.value = ""

}

function removerFuncionario(index){

  funcionarios.splice(index,1)

  salvarLocalStorage()

  carregarFuncionarios()

}

function salvarVenda(){

  const valorInput =
    document.getElementById("valor")

  const valor =
    parseFloat(valorInput.value)

  const pagamento =
    document.getElementById("pagamento").value

  const funcionario =
    document.getElementById("funcionario").value

  const observacao =
    document.getElementById("observacao").value

  if(isNaN(valor) || valor <= 0){

    alert("Digite um valor válido")

    return

  }

  const venda = {

    id: Date.now(),

    valor: Number(valor),

    pagamento: pagamento,

    funcionario: funcionario,

    observacao: observacao,

    data: new Date().toLocaleString("pt-BR")

  }

  vendas.push(venda)

  salvarLocalStorage()

  atualizarTabela()

  atualizarDashboard()

  valorInput.value = ""
  document.getElementById("observacao").value = ""

}

function atualizarTabela(){

  const tabela =
    document.getElementById("listaVendas")

  tabela.innerHTML = ""

  vendas.forEach((venda)=>{

    const tr =
      document.createElement("tr")

    tr.innerHTML = `

      <td>
        R$ ${Number(venda.valor).toFixed(2)}
      </td>

      <td>
        ${venda.pagamento}
      </td>

      <td>
        ${venda.funcionario}
      </td>

      <td>
        ${venda.observacao}
      </td>

      <td>
        ${venda.data}
      </td>

      <td>
        <button
          class="excluir"
          onclick="excluirVenda(${venda.id})">
          Excluir
        </button>
      </td>

    `

    tabela.appendChild(tr)

  })

}

function excluirVenda(id){

  vendas =
    vendas.filter(venda => venda.id !== id)

  salvarLocalStorage()

  atualizarTabela()

  atualizarDashboard()

}

function atualizarDashboard(){

  let total = 0
  let pix = 0
  let dinheiro = 0
  let debito = 0
  let credito = 0

  vendas.forEach(venda=>{

    total += venda.valor

    if(venda.pagamento === "PIX"){
      pix += venda.valor
    }

    if(venda.pagamento === "Dinheiro"){
      dinheiro += venda.valor
    }

    if(venda.pagamento === "Débito"){
      debito += venda.valor
    }

    if(venda.pagamento === "Crédito"){
      credito += venda.valor
    }

  })

  document.getElementById("totalGeral")
    .textContent =
      `R$ ${total.toFixed(2)}`

  document.getElementById("totalPix")
    .textContent =
      `R$ ${pix.toFixed(2)}`

  document.getElementById("totalDinheiro")
    .textContent =
      `R$ ${dinheiro.toFixed(2)}`

  document.getElementById("totalDebito")
    .textContent =
      `R$ ${debito.toFixed(2)}`

  document.getElementById("totalCredito")
    .textContent =
      `R$ ${credito.toFixed(2)}`

}

function gerarPDF(){

  if(vendas.length === 0){

    alert("Nenhuma venda cadastrada")

    return

  }

  const { jsPDF } = window.jspdf

  const doc = new jsPDF()

  // TÍTULO
  doc.setFontSize(22)

  doc.text(
    "Ipê Material de Construção",
    14,
    20
  )

  doc.setFontSize(14)

  doc.text(
    "Relatório de Vendas",
    14,
    30
  )

  // TABELA
  const tabela = vendas.map(venda => [

    `R$ ${Number(venda.valor).toFixed(2)}`,

    venda.pagamento,

    venda.funcionario,

    venda.observacao,

    venda.data

  ])

  doc.autoTable({

    startY: 40,

    head: [[
      "Valor",
      "Pagamento",
      "Funcionário",
      "Obs",
      "Data"
    ]],

    body: tabela

  })

  // TOTAIS
  let totalGeral = 0
  let totalPix = 0
  let totalDinheiro = 0
  let totalDebito = 0
  let totalCredito = 0

  vendas.forEach(venda=>{

    const valor = Number(venda.valor)

    totalGeral += valor

    if(venda.pagamento === "PIX"){
      totalPix += valor
    }

    if(venda.pagamento === "Dinheiro"){
      totalDinheiro += valor
    }

    if(venda.pagamento === "Débito"){
      totalDebito += valor
    }

    if(venda.pagamento === "Crédito"){
      totalCredito += valor
    }

  })

  // POSIÇÃO FINAL
  let y =
    doc.lastAutoTable.finalY + 20

  doc.setFontSize(14)

  doc.text(
    `Total PIX: R$ ${totalPix.toFixed(2)}`,
    14,
    y
  )

  y += 10

  doc.text(
    `Total Dinheiro: R$ ${totalDinheiro.toFixed(2)}`,
    14,
    y
  )

  y += 10

  doc.text(
    `Total Débito: R$ ${totalDebito.toFixed(2)}`,
    14,
    y
  )

  y += 10

  doc.text(
    `Total Crédito: R$ ${totalCredito.toFixed(2)}`,
    14,
    y
  )

  y += 15

  doc.setFontSize(18)

  doc.text(
    `TOTAL GERAL: R$ ${totalGeral.toFixed(2)}`,
    14,
    y
  )

  doc.save("relatorio-vendas.pdf")

}

carregarFuncionarios()

atualizarTabela()

atualizarDashboard()