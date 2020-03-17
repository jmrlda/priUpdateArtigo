var sql = require("mssql");


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

async function actualizar_basedados() {
  var artigos = null;
  try {
    let pool = await sql.connect(config)
    let result = await pool.request()
      // .input('input_parameter', sql.Int, value)
      .query("update artigoMoeda set pvp4 = '655'  where Artigo = 'ROB7093' and Moeda='MT' ");

    artigos = result.recordset;
	console.log(artigos)

  } catch (err) {
    console.log("ocorreu um erro", err);
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

actualizar_basedados();