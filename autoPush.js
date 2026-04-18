const chokidar = require('chokidar');
const { exec } = require('child_process');

// monitora a pasta inteira do projeto
const PASTA = './';

// evita commits repetidos
let timeout = null;

console.log('👀 Monitorando alterações no projeto...');

chokidar.watch(PASTA, {
  ignored: [
    /(^|[\/\\])\../,      // arquivos ocultos
    'node_modules',       // ignora dependências
    '.git'
  ],
  ignoreInitial: true,
  persistent: true,
})
.on('all', (event, path) => {
  console.log(`📁 ${event}: ${path}`);

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    exec(
      'git add . && git commit -m "Atualização automática" && git push',
      (err, stdout, stderr) => {
        if (err) {
          console.log('⚠️ Nada novo para commitar ou erro.');
          return;
        }
        console.log('✅ Projeto enviado para o GitHub');
      }
    );
  }, 3000); // espera 3s para agrupar alterações
});