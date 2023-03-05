import parser from "@solidity-parser/parser";

export default function handler(req, res) {
  // Check that the request is a POST request
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid request method" });
  }

  // Get the uploaded file from the request body
  const file = req.files?.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Read the file contents as a string
  const code = fs.readFileSync(file.path, "utf8");

  try {
    // Parse the Solidity code into an AST
    const ast = parser.parse(code);
    console.log("ast", ast);

    // Return the AST as JSON
    return res.json(ast);
  } catch (err) {
    // Return an error if the code couldn't be parsed
    res.status(400).json({ error: "Invalid Solidity code" });
  }
}
