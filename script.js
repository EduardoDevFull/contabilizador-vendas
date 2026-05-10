// script.js


let historicos =
  JSON.parse(localStorage.getItem("historicos")) || []

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

  localStorage.setItem(
  "historicos",
  JSON.stringify(historicos)
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
  let quantidade = vendas.length

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

      document.getElementById("quantidadeVendas")
  .textContent = quantidade

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
  const quantidadeVendas = vendas.length
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

  y += 10

doc.text(
  `Quantidade de Vendas: ${quantidadeVendas}`,
  14,
  y
)

  const relatorioFuncionarios = {}

vendas.forEach(venda=>{

  const nome = venda.funcionario

  if(!relatorioFuncionarios[nome]){
    relatorioFuncionarios[nome] = 0
  }

  relatorioFuncionarios[nome] +=
    Number(venda.valor)

})

y += 15

doc.setFontSize(16)

doc.text(
  "Totais por Funcionário",
  14,
  y
)

y += 10

Object.entries(relatorioFuncionarios)
.forEach(([nome,totalFuncionario])=>{

  doc.text(
    `${nome}: R$ ${totalFuncionario.toFixed(2)}`,
    14,
    y
  )

  y += 10

})

  y += 15

  doc.setFontSize(18)

  doc.text(
    `TOTAL GERAL: R$ ${totalGeral.toFixed(2)}`,
    14,
    y
  )

  const agora = new Date()

const data =
  agora.toLocaleDateString("pt-BR")
    .replace(/\//g,"-")

const hora =
  agora.toLocaleTimeString("pt-BR")
    .replace(/:/g,"-")

doc.save(
  `fechamento-${data}-${hora}.pdf`
)

}

function fecharCaixa(){

  if(vendas.length === 0){

    alert("Nenhuma venda cadastrada")

    return

  }

  const senha = prompt(
    "Digite a senha do gerente"
  )

  if(senha !== "d1421"){

    alert("Senha incorreta")

    return

  }

  const confirmar = confirm(
    "Deseja realmente fechar o caixa?"
  )

  if(!confirmar){
    return
  }

  // GERA PDF
  gerarPDF()

  // ESPERA O PDF TERMINAR
  setTimeout(()=>{

    // TOTAL
    const total = vendas.reduce(
      (acc,venda)=>
        acc + Number(venda.valor),
      0
    )

    // HISTÓRICO
    historicos.push({

      

      data:new Date()
        .toLocaleString("pt-BR"),

      quantidade:vendas.length,

      total:total,

      vendas:[...vendas]

    })

    // MANTÉM APENAS 30 FECHAMENTOS
if(historicos.length > 30){

  historicos =
    historicos.slice(-30)

}

    // LIMPA
    vendas = []

    salvarLocalStorage()

    atualizarTabela()

    atualizarDashboard()

    atualizarHistorico()

    alert(
      "Caixa fechado com sucesso!"
    )

  },500)

}

function atualizarHistorico(){

  const lista =
    document.getElementById("listaHistorico")

  lista.innerHTML = ""

  historicos
    .slice()
    .reverse()
    .forEach((historico)=>{

      const div =
        document.createElement("div")

      div.classList.add("historico-card")

      div.innerHTML = `

        <h3>
          ${historico.data}
        </h3>

        <p>
          Total: R$ ${Number(historico.total).toFixed(2)}
        </p>

        <p>
          Vendas: ${historico.quantidade}
        </p>

      `

      lista.appendChild(div)

    })

}


atualizarHistorico()

carregarFuncionarios()

atualizarTabela()

atualizarDashboard()