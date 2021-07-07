const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res){
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS') // formatação da data com a lib moment
        
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao) // função do moment isSameOrAfter, retorna booleano dizendo se a data é igual ou dps do segundo paramento que é a dataCriacao
        const clienteEhValido = atendimento.cliente.length >= 3

        const validacoes = [
            {
                nome: 'data',
                valido: dataEhValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            
            {
                nome: 'cliente',
                clienteEhValido: clienteEhValido,
                mensagem: 'Nome do cliente deve conter no minimo 3 caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido ) // só retorno se nao for valido
        const existemErros = erros.length
        
        if (existemErros){
            res.status(400).json(erros)
        }else{
            const atendimentoDatado = {...atendimento, dataCriacao, data}
           
            const sql = 'INSERT INTO Atendimentos SET ?'
    
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if (erro){
                    res.status(400).json(erro)
                }else{
                    res.status(201).json(atendimento)
                }
            })   
    

        }

    }
}

module.exports = new Atendimento