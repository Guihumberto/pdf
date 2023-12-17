const express = require('express')
const app = express()

app.use( //tratar o body das requisições ex. req.body.nome, se nao fizer isso ele vem como undefined nos envios com post
  express.urlencoded(
    { 
      extended: true
    }
  )
)

const fs = require('fs'); //file sistem
const path = require('path'); //caminhos
const pdf = require('pdf-parse'); //ler e extrair pdfs


app.get('/', (req, res) => { //as rotas sempre utilizar (req, res)
  res.send(`
    <form method="POST" action="/">
      Busca: <input type="text" name="nome" />
      <button>Enviar</button>
    </form>
  `)
})
app.post('/', (req, res) => {
  const searchTerm = req.body.nome;
  searchInPDFsInDirectory(folderPath, searchTerm);
  res.send(`
    <h2>Recebido</h2> Termo buscado: ${searchTerm} </br>

    <div>${listRefs[0].textSearch}</div>


    <a href="/">Voltar</a>
  `)
})

app.get('/testes/:id?', (req, res) => {
  console.log(req.params)
  res.send(req.query)
})

const folderPath = 'C:/curso'; 
let listRefs = []


function searchInPDF(filePath, searchTerm) {
    const dataBuffer = fs.readFileSync(filePath);
  
    pdf(dataBuffer)
    .then(data => {
      const text = data.text.toLowerCase();

      let textSeparado = text.split('\n')

      textSeparado.forEach(item => {
        if(item.includes(searchTerm.toLowerCase())) {
          let doc = {
            numpage: data.numpages,
            info: data.info,
            metadata: data.metadata,
            version: data.version,
            path: filePath,
            textSearch: item
          }
          listRefs.push(doc)
        }
      })
    })
    .catch(error => {
      console.error(`Erro ao processar o arquivo ${filePath}:`, error);
    });
}

function searchInPDFsInDirectory(directoryPath, searchTerm) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.error('Erro ao ler o diretório:', err);
        }

        files.forEach(file => {
            //lista todos os arquivos nesta pasta
            const filePath = path.join(directoryPath, file);
           
            // Verifica se o arquivo é um arquivo PDF
            if (path.extname(filePath).toLowerCase() === '.pdf') {
                searchInPDF(filePath, searchTerm);
            }
        });
    });
}

// searchInPDFsInDirectory(folderPath, searchTerm);

app.listen(3000, ()=>{
  console.log("servidor na porta 3000")
  console.log("http://localhost:3000")
})

