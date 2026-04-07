import { PDFParse } from 'pdf-parse';
import mammoth from "mammoth";

async function parseResume(file) {

  const mimetype = file.mimetype

  if (mimetype === "application/pdf") {

    const parser = new PDFParse({ url: file.path });

    const result = await parser.getText();
    return result.text;

  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {

    const result = await mammoth.extractRawText({
      buffer: file.buffer
    })

    return result.value
  }

  throw new Error("Unsupported file type")
}

export default parseResume