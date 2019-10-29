import app from './app';

/* não colocamos o listen no app.js por causa dos testes, pois quando há testes automatizados,
não vamos precisar iniciar o servidor numa porta
vai ser diretamente na classe app.js e não no servidor */
app.listen(3003);
