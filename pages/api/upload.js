const parser = require("@solidity-parser/parser");

export default function handler(req, res) {
  console.log(req.body.text);
  // Check that the request is a POST request
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid request method" });
  }

  try {
    // Parse the Solidity code into an AST
    const ast = parser.parse(req.body.text);
    console.log("ast", ast);

    // Return the AST as JSON
    return res.json(ast);
  } catch (err) {
    console.log(err);
    // Return an error if the code couldn't be parsed
    res.status(400).json({ error: "Invalid Solidity code" });
  }
}
