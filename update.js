const fs = require('fs')
const neatCsv = require('neat-csv');
const sql = require('mssql');




const config = {
  user: "sa",
  password: "jmr2013!",
  server: '192.168.10.1\\PRIMAVERA9',
  database: 'PRITERRAMARBG',
  port: 1433,
  options: {
    encript: true
  }
}



async function getCategoria() {
  var categoria = null;
  try {

    let pool = await sql.connect(config)
    let result = await pool.request()
      // .input('input_parameter', sql.Int, value)
      .query("select familia,descricao from familias");

    categoria = result.recordset;
    // mongo.insertMany(result.recordset, "categoria", "webshop");
  } catch (err) {
    console.log("ocorreu um erro ", err);
    sql.close();

  }
  sql.close();

  return categoria;
}



async function getSubCategoria(categoria) {
  var subcategoria = null;
  try {
    sql.close();
    let pool = await sql.connect(config);
    let result = await pool.request()
      // .input('input_parameter', sql.Int, value)
      .query("select Descricao from subFamilias where Familia = '" + categoria + "'");

    subcategoria = result.recordset;
    // mongo.insert(artigos, "artigos", "webshop");
    console.log(subcategoria)

  } catch (err) {
    console.log("ocorreu um erro", err);
    sql.close();
  
  }
  
  sql.close();

  return subcategoria
}


async function getMarcas(artigo_marca) {
  var marcas = null;
  try {
    sql.close();
    let pool = await sql.connect(config);
    let result = await pool.request()
      // .input('input_parameter', sql.Int, value)
      .query("select Marca, Descricao from Marcas where Marca = '" + artigo_marca + "'");

      marcas = result.recordset;
    // mongo.insert(artigos, "artigos", "webshop");
    console.log("artigo marca ",marcas)

  } catch (err) {
    console.log("ocorreu um erro", err);
    sql.close();
  
  }
  
  sql.close();

  return marcas
}



async function getClienteAllInfo() {
  var clientes = null;
  try {
    sql.close();
    let pool = await sql.connect(config);
    let result = await pool.request()
      // .input('input_parameter', sql.Int, value)
      .query("select Nome, NomeFiscal, NumContrib, Fac_Mor, Fac_local, Fac_tel, TotalDeb, enderecoWeb, EncomendasPendentes as pendentes from clientes");

      clientes = result.recordset;
    // mongo.insert(artigos, "artigos", "webshop");
    console.log("Clientes",clientes)

  } catch (err) {
    console.log("[getClientAllInfo] Ocorreu um erro", err);
    sql.close();
  
  }
  
  sql.close();

  return clientes
}


// actualizar_basedados();
// getCategoria();
sql.on("error", err => {
  console.log("ocorreu um erro");
});



var mssql = {
  actualizar_basedados: actualizar_basedados,
  getCategoria:  getCategoria,
  getSubCategoria : getSubCategoria,
  getMarcas : getMarcas,
  getClienteAllInfo : getClienteAllInfo,
  sql: sql
}


var li = []

async function select () {
 
   try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('mssql://sa:jmr2013!@localhost/PRITERRAMARBG')
        const result = await sql.query`select * from artigo`
        console.dir(result)
    } catch (err) {
          console.dir(err)
    }
}
async function actualizar_basedados(artigo, valor, unidade) {
  var artigos = null;
  try {
    let pool = await sql.connect(config)
    let result = await pool.request()
      // .input('input_parameter', sql.Int, value)
      .query("update artigoMoeda set pvp4 = '" + valor.replace(".","") +  "'  where Artigo = '"+ artigo +"' and Moeda='MT' and Unidade='"+ unidade +"' ");

    artigos = result.recordset;
	console.log(artigos)
	console.log('artigo ' + artigo + ' actualizado')

  } catch (err) {
    console.log("ocorreu um erro", err);
  }
}

fs.readFile('./teste.csv', async (err, data) => {
  if ( err) {
    console.error(err)
    return
  }

li = await neatCsv(data);
for (var i = 0; i < 1622; i++) {
var artigo = li[i]['0'].split(";")[0];
var valor = li[i]['0'].split(";")[2];
var unidade = li[i]['0'].split(";")[1];
  console.log(i);
  console.log(artigo);
  console.log(valor);
  console.log(unidade);
//console.log(li[i]['0'])

actualizar_basedados(artigo, valor, unidade);
}
})
