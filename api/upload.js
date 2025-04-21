const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Somente POST permitido.");
  }

  const { filename = "respostas.zip", file_data } = req.body;

  if (!file_data) {
    return res.status(400).send("Campo 'file_data' ausente!");
  }

  try {
    // Converte a string (Unicode escapado) para Buffer
    const buffer = Buffer.from(file_data, "latin1"); // preserve os bytes originais
    const filePath = path.join("/tmp", filename);

    // Salva o .zip
    fs.writeFileSync(filePath, buffer);

    // Extrai o .csv do zip (opcional)
    await fs.createReadStream(filePath)
      .pipe(unzipper.Extract({ path: "/tmp/extract" }))
      .promise();

    return res.status(200).send("Arquivo salvo e extraído com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar o arquivo:", err);
    return res.status(500).send("Erro ao processar o arquivo.");
  }
}
