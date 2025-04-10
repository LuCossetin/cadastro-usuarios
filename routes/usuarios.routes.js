import express from 'express'; // Importa o express
import { v4 as uuidv4 } from 'uuid'; // Importa a dependencia que gera IDs únicos
import validarCadastro from '../middlewares/validarCadastro.js';

// Cria módulos de rota que serão conectadas ao 'app' (server) no nível principal.
const router = express.Router();

export let usuarios = [];

// Método GET: Retorna todos os usuários cadastrados
router.get('/', (req, res) => {
    res.json(usuarios);
});

// Método POST: Cadastra um novo usuário
router.post('/', validarCadastro,  (req, res) => {
    
    // Desestruturação: Crie as variaveis e atribua o valor das propriedade do objeto json
    const { nome, idade, dataNascimento, telefone, email, endereco } = req.body;
    
    const novoUsuario = {
        id: uuidv4(),
        nome,
        idade,
        dataNascimento,
        telefone,
        email: email || null,
        endereco: endereco || null,
        dataCadastro: new Date().toISOString(),
        statusUsuario: "Ativo"
    };

    // Adiciona o novo usuário à lista
    usuarios.push(novoUsuario);

    res.status(201).json({
        mensagem: "Usuário Cadastrado com sucesso!",
        usuario: novoUsuario
    })
});

// Método PUT: Atualiza dados de um usuário já cadastrado, com base no ID
router.put('/:id', validarCadastro, (req, res) => {
    const idUsuario = req.params.id;
    const usuarioIndex = usuarios.findIndex(user => user.id === idUsuario );

    if ( usuarioIndex === -1){
        return res.status(404).json({ mensagem: "Usuário não encontrado!"});
    }

    // Verificação se os valores do campo foram atualizados
    const usuarioAtualizado = usuarios[usuarioIndex];
    if (req.body.nome) usuarioAtualizado.nome = req.body.nome;
    if (req.body.idade) usuarioAtualizado.idade = req.body.idade;
    if (req.body.dataNascimento) usuarioAtualizado.dataNascimento = req.body.dataNascimento;
    if (req.body.telefone) usuarioAtualizado.telefone = req.body.telefone;
    if (req.body.email) usuarioAtualizado.email = req.body.email;
    if (req.body.endereco) usuarioAtualizado.endereco = req.body.endereco;
    
    
    res.json({ mensagem: "Usuário atualizado com sucesso!",
        usuario: usuarioAtualizado });
})

// Método DELETE: Remove um usuário cadastrado com base no ID
router.delete('/:id', (req, res) => {
    const idUsuario = req.params.id;
    const usuarioIndex = usuarios.findIndex(usuario => usuario.id === idUsuario );

    if (usuarioIndex === -1) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    usuarios.splice(usuarioIndex, 1);

    res.json({ mensagem: "Usuário excluído com sucesso!" });
});

// Exporta o roteador
export default router;

