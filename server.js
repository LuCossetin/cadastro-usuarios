import express from 'express'; // Cria o servidor Express
import usuariosRoutes from './routes/usuarios.routes.js';

// 'app': Convenção amplamente utilizada para nomear a instância principal da aplicação
const app = express(); // Configuração global do servidor principal criando uma instância principal da aplicação Express

// Middleware que transforma os dados enviados na requisição em formato JSON
app.use(express.json());
// Conecta o reteador de usuarios, associando a rota a um prefixo especifico, no caso, /usuarios e conectando à aplicação principal
app.use('/usuarios', usuariosRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
