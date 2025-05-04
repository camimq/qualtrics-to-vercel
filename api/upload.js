import fs from "fs";
import path from "path";
import unzipper from "unzipper";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método não permitido.");
  }

  try {
    const { filename = "respostas.zip", file_data } = req.body;

    if (!file_data) {
      return res.status(400).send("Campo 'file_data' ausente!");
    }

    const buffer = Buffer.from(file_data, "latin1");
    const filePath = path.join("/tmp", filename);

    fs.writeFileSync(filePath, buffer);

    await fs.createReadStream(filePath)
      .pipe(unzipper.Extract({ path: "/tmp/extract" }))
      .promise();

    return res.status(200).send("Arquivo salvo e extraído com sucesso!");
  } catch (err) {
    console.error("Erro ao processar:", err);
    return res.status(500).send("Erro interno.");
  }
}
