// @ts-nocheck
export function ast_to_source(ast) {
  console.log(ast);
  let source = "";

  // Recursively traverse the AST nodes
  for (let node of ast.children) {
    if (node.type === "PragmaDirective") {
      source += `pragma ${node.name} ${node.value};\n`;
    } else if (node.type === "ContractDefinition") {
      source += "contract " + node.name + " {\n";
      for (let sub_node of node.subNodes) {
        if (sub_node.type === "FunctionDefinition") {
          if (sub_node.isConstructor) {
            let params = sub_node.parameters.map(
              (p) => `${p.typeName.name} ${p.name}`
            );
            source += `  constructor(${params.join(", ")}) `;
          } else {
            let params = sub_node.parameters.map(
              (p) => `${p.typeName.name} ${p.name}`
            );
            let returns = sub_node?.returnParameters?.map(
              (r) => `${r.typeName.name} ${r.name}`
            );
            let visibility = sub_node.visibility
              ? sub_node.visibility + " "
              : "";
            source += `  function ${sub_node.name}(${params.join(
              ", "
            )}) ${visibility}`;

            if (returns?.length > 0) {
              source += ` returns (${returns.join(", ")})`;
            }
            if (sub_node.stateMutability) {
              source += ` ${sub_node.stateMutability}`;
            }
          }
          source += " {\n";
          for (let statement of sub_node.body.statements) {
            if (statement.type === "VariableDeclarationStatement") {
              let variables = statement.variables.map((vari) => {
                return `${vari.typeName.name} ${vari.name}`;
              });
              source += `    ${variables.join(", ")};\n`;
            } else if (statement.type === "ExpressionStatement") {
              let expr = expression_to_source(statement.expression);
              source += `    ${expr};\n`;
            } else if (statement.type === "ReturnStatement") {
              let expr = expression_to_source(statement.expression);
              source += `    return ${expr};\n`;
            } else if (statement.type === "IfStatement") {
              source += `    if (${expression_to_source(
                statement.condition
              )}) {\n`;
              for (let stmt of statement.trueBody.statements) {
                if (stmt.type === "VariableDeclarationStatement") {
                  let variables = stmt.variables.map(
                    (vari) => `${vari.typeName.name} ${vari.name}`
                  );
                  source += `        ${variables.join(", ")};\n`;
                } else if (stmt.type === "ExpressionStatement") {
                  let expr = expression_to_source(stmt.expression);
                  source += `        ${expr};\n`;
                } else if (stmt.type === "ReturnStatement") {
                  let expr = expression_to_source(stmt.expression);
                  source += `        return ${expr};\n`;
                }
              }
              source += `    }`;
              if (statement.falseBody) {
                source += ` else {\n`;
                for (let stmt of statement.falseBody.statements) {
                  if (stmt.type === "VariableDeclarationStatement") {
                    let variables = stmt.variables.map(
                      (vari) => `${vari.typeName.name} ${vari.name}`
                    );
                    source += `        ${variables.join(", ")};\n`;
                  } else if (stmt.type === "ExpressionStatement") {
                    let expr = expression_to_source(stmt.expression);
                    source += `        ${expr};\n`;
                  } else if (stmt.type === "ReturnStatement") {
                    let expr = expression_to_source(stmt.expression);
                    source += `        return ${expr};\n`;
                  }
                }
                source += `    }\n`;
              } else {
                source += `;\n`;
              }
            }
          }
          source += `  }\n`;
        } else if (sub_node.type === "StateVariableDeclaration") {
          let variables = sub_node.variables.map((vari) => {
            return `${vari.typeName.name} ${vari.name}`;
          });
          source += `  ${variables.join(", ")};\n`;
        }
      }
      source += `}\n`;
    } else if (node.type === "StructDefinition") {
      source += `struct ${node.name} {\n`;
      for (let member of node.members) {
        source += `  ${member.typeName.name} ${member.name};\n`;
      }
      source += "}\n";
    }
  }

  return source;
}

export function expression_to_source(expr) {
  // console.log(expr);
  if (expr.type === "Identifier") {
    return expr.name;
  } else if (expr.type === "NumberLiteral") {
    return expr.number;
  } else if (expr.type === "BooleanLiteral") {
    return String(expr.value).toLowerCase();
  } else if (expr.type === "BinaryOperation") {
    return `${expression_to_source(expr.left)} ${
      expr.operator
    } ${expression_to_source(expr.right)}`;
  } else if (expr.type === "StringLiteral") {
    return `"${expr.value}"`;
  } else if (expr["type"] === "FunctionCall") {
    const expression = expression_to_source(expr["expression"]);
    const args = expr["arguments"]
      .map((arg) => expression_to_source(arg))
      .join(", ");
    return `${expression}(${args})`;
  } else if (expr.type === "MemberAccess") {
    if (expr.memberName === "sender") {
      return "msg.sender";
    } else {
      return `${expression_to_source(expr.expression)}.${expr.memberName}`;
    }
  } else if (expr.type === "UnaryOperation") {
    let subExpression = expression_to_source(expr.subExpression);
    return `${subExpression}${expr.operator}`;
  } else if (expr.type === "IndexAccess") {
    let base = expression_to_source(expr.base);
    let index = expression_to_source(expr.index);
    return `${base}[${index}]`;
  } else {
    const str = `Unsupported expression type: ${expr.type}`;
    throw new Error(str);
  }
}
