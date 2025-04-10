import { usuarios } from '../routes/usuarios.routes.js'

// Middleware de validação
export default function validarCadastro (req, res, next){
    // Desestruturação: Crie as variaveis e atribua o valor das propriedade do objeto json
    let { nome, idade, dataNascimento, telefone } = req.body; 
    // Captura o ID do usuário na URL (Será usado para o PUT)
    const idUsuario = req.params.id;
    
    // Limpa o campo nome retirando os espaços com trim e transformando tudo em minúsculas com toLowerCase
    if(nome){
        nome = nome.trim().toLowerCase();
    }


    // Checagem método POST
    if(req.method === "POST"){
        if (!nome || nome.length < 3) {
            return res.status(400).json({mensagem: "Erro: O campo 'nome' não atende ao requisito mínimo de 3 caracteres. Por favor, revise e envie novamente."});
        }

        if(!idade || typeof idade !== "number" || idade <= 0) {
        return res.status(400).json({mensagem: "Erro no campo 'idade': Certifique-se de inserir um valor válido."});
        }

    }

    // Checagem método PUT
    if(req.method === "PUT"){
        if (nome && nome.length < 3) {
            return res.status(400).json({mensagem: "Erro no campo 'nome': O nome deve ter pelo menos 3 caracteres. Por favor, revise e envie novamente."});
        }
    
        if(idade && (typeof idade !== "number" || idade <= 0)) {
            return res.status(400).json({mensagem: "Erro no campo 'idade': Certifique-se de inserir um valor válido."});
        }
    }


    // Verifica se há nomes duplicados (Sempre no POST ou quando necessário no PUT)
    if(nome){
        const nomeDuplicado = usuarios.some(user => user.nome === nome && user.id !== idUsuario);
        
        if (nomeDuplicado){
            return res.status(400).json({mensagem: `Erro: O nome já está cadastrado no sistema. Tente usar outro nome!`})
        }
    }

    // Validação para a data de nascimento
    if(dataNascimento){
        
        // Objetos Date são mais seguros do que manipular datas como strings
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        
        if (isNaN(nascimento.getTime())) {
            return res.status(400).json({mensagem: "A data de nascimento é inválida. Tente inserir no formato 00/00/0000"});
        }
        
        if ( nascimento > hoje ) {
            return res.status(400).json({mensagem: "A data de nascimento deve ser inferior à data presente"});
        }
        
        
        const idadeAno = hoje.getFullYear() - nascimento.getFullYear();
        if(idadeAno < 0 || idadeAno > 100) {
            return res.status(400).json({mensagem: "A idade calculada, baseada na data de nascimento informada, é inválida."});
        }
        
    }

    // Validação telefone seguindo padrão
    if (telefone) {
        
        // Regex: Regular Expression
        const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
        if(!regex.test(telefone)){
            return res.status(400).json({mensagem: "O telefone informado não está no formato (XX) XXXXX-XXXX. Insira um telefone válido."})
        }

    }

    // Atualiza o nome no req.body
    req.body.nome = nome;

    // Método Express para prosseguir a execução
    next();
}