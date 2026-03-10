let tabela = document.getElementsByTagName("tabela");

//Get element'(s) é plural, significa que eu posso ter várias tabelas. O código faz uma varredura no HTML, cria um vetor para cada elemento cujo nome seja "tabela". Vetor associativo, ou seja, referênciado|associado a um nome.

for (let i = 0; i < tabela.length //Lenght é o tamanho do vetor. se eu trocasse lenght pelo número que eu quissesse, toda vez que eu criasse uma tabela eu teria que incrementar um valor aqui, com o lenght ele automatiza o processo.
    ; i++) {

    let tab = tabela[i];
    let linhas = tab.getAttribute("linha"); //Estou querendo obter um atributo do elemento TAB. Nesse caso, o elemento é linhas, ele funciona como o lenght, ele vai coletar, literalente as linhas.

    let colunas = tab.getAttribute("coluna");

    let novaTabela = document.createElement("table");

    let tipo = tab.getAttribute("tipo"); //Adicionei o elemento tipo como atributo da TABELA

    //DECLARAÇÃO EXPAND

    let dadosTag = document.getElementsByTagName("dados")[0];
    let dados = [];

    let spanAttr = document.getElementsByTagName("expand");
    let matriz = [];
    for (let w = 0; w < spanAttr.length; w++) { //substituí a matriz colspanAttr por spanAttr, por que a faria valer tanto para a expansão vertical quanto para a horizontal
        matriz.push([
            spanAttr[w].getAttribute("linha"), //Matriz[indice][0] = linhas
            spanAttr[w].getAttribute("coluna"), //Matriz[indice][1] = colunas
            spanAttr[w].getAttribute("tamanho"), //Matriz[indice][2] = tamanho do span
            spanAttr[w].getAttribute("tipo"), //Matriz[indice][3] = tipo do span (vertical ou horizontal)
        ])
    }

    //ESTRUTURA DE RASTREAMENTO: Matriz que registra quais células já foram ocupadas por rowspan

    let ocupacao = []; //matriz secundária
    for (let i = 0; i < linhas; i++) {
        ocupacao[i] = []; //percorre a matriz (linha)
        for (let j = 0; j < colunas; j++) { //percorre a matriz (coluna incubida na linha)
            ocupacao[i][j] = false; //false = célula disponível, true = célula já ocupada por rowspan anterior
        }
    }

    if (dadosTag) {
        let texto = dadosTag.textContent.trim(); //conteúdo textual de um elemento qualquer.
        console.log("Texto :" + texto);
        let linhaDados = texto.split("\n"); //SINALIZA: QUEBRA NO \N
        console.table(linhaDados);
        for (let linha of linhaDados) { //Esse for é um: navegue por todos os registro e coloco na variável. OU SEJA, É UM FOREACH_V2
            let colunas = linha.split("|");
            //VETOR + VETOR = MATRIZ
            dados.push(colunas.map(c => c.trim())); //O map mapeia algo e coloca uma função nela, e pra ela, atribui variavel
            // O c=> é tipo um: grava o que vier depois nessa variável [c]
            console.log("Vetor :" + dados);
        }
    }

    //FIM DA DECLARAÇÃO DO EXPAND

    //CRIAÇÃO DA BORDA

    let bordaAttr = tab.getAttribute("borda");
    let vetBorda = bordaAttr.split(" "); //Se eu separei por espaços no html, eu explico isso pro programa aqui. [" "]
    novaTabela.style.setProperty('--cor-borda', vetBorda[2]); //ele cria a propriedade de cor, e define a posição dela de acordo com a ordem dos valores inseridos no HTML, separados pelo espaço splitado [split] na linha de cima.
    novaTabela.style.setProperty('--tipo-borda', vetBorda[1]);
    novaTabela.style.setProperty('--tamanho-borda', vetBorda[0]);

    //FIM DA CRIAÇÃO DA BORDA

    //Agora eu verifico o seguinte: A linha que estiver span, eu passo pra próximo e aplico esse preencher do quadrado. Tem aplicação de span nessa célula? Se sim, aplico... Vice-versa

    //(l => l.trim()) é a mesma coisa que:
    // function (l) {
    // return l.trim();
    //}

    console.log(matriz);//Exibe no console o valor tirado de matriz. Verifica.

    //TR = table row
    //TD = table data
    //TH = table head
    //TB = table body

    for (let x = 0; x < linhas; x++) {

        let tr = document.createElement("tr"); //Cria a primeira linha da tabela, armazenando na variável 'let tr'.

        for (let y = 0; y < colunas; y++) { //Como Y deve ser menor que colunas. Tudo dá certo!

            //O let garante que a variável é de local único.

            if (ocupacao[x][y] == false) { //se a linha está disponível, ele coloca dado ali

                let td = document.createElement("td"); //Acrescenta uma célula ou dado. NO MOMENTO, ELA AINDA NÃO TEM VÍNCULO COM A LINHA. (PRECISA DE UM APPENDCHILD)

                //COLOCANDO DADO NA LINHA DE DADO ASSIM QUE ELA É CRIADA

                if (dados[x] && dados[x][y]) { //confere se a linha e a coluna existem.
                    td.innerText = dados[x][y]; //a estrutura de dados vai receber o dado da linha em questão.
                }

                //FIM DO APLICAR DADO

                let span = 1; //Verifica se o span existe naquela célula ou não.
                let tipo = ""; //Armazena o tipo de expansão (colspan ou rowspan)

                for (let k = 0; k < matriz.length; k++) {
                    if (matriz[k][0] == x && matriz[k][1] == y) { //Se tanto a linha quanto a coluna corresponderem
                        span = parseInt(matriz[k][2]); //Pega o tamanho da expansão como NÚMERO [O parseInt transforma o "3" puxado do html em um 3 inteiro]
                        tipo = matriz[k][3]; //Pega o tipo de expansão (colspan ou rowspan)
                        break;
                    }
                }


                if (span > 1) { //Se o span é maior do que um (se tem expansão)
                    if (tipo === "linha") {
                        td.setAttribute("colspan", span); //Expansão horizontal
                        y += span - 1; //Pula as próximas colunas ocupadas
                    } else if (tipo === "coluna") {
                        td.setAttribute("rowspan", span); //Expansão vertical
                        //Marca as linhas inferiores como ocupadas por este rowspan
                        for (let linhaOcupada = x + 1; linhaOcupada < x + span && linhaOcupada < linhas; linhaOcupada++) {
                            ocupacao[linhaOcupada][y] = true;
                        }
                    }
                }

                tr.appendChild(td); //Ele puxa da variável, ligando o pai dela (tr) à célula (filha | td). É tipo dizer: TR, tu é o pai do TD.

                ocupacao[x][y] = true;

            } else { //se a linha não estiver disponivel (um expand está ocupando ela) ele ignora os dados presentes na célula
                continue;
            }

        }
        novaTabela.appendChild(tr); //Agora ele descreve TR como filha da tabela em questão.
    }
    tab.appendChild(novaTabela); //Agora ele vai colocar a tabela ELEMENTO (ou seja, presente no HTML de fato).

    console.log(ocupacao);
}
