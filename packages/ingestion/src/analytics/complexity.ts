import type Parser from "web-tree-sitter";

export interface FileAnalytics {
  ccn: number;
  nloc: number;
  nesting: number;
  dependencies: { from: string; to: string; ecosystem: string | null }[];
}

const DECISION_NODES = new Set([
  "if_statement",
  "for_statement",
  "while_statement",
  "do_statement",
  "switch_case",
  "catch_clause",
  "ternary_expression",
]);

export function analyzeAst(
  root: Parser.SyntaxNode,
  filePath: string,
  totalLines: number
): FileAnalytics {
  let ccn = 1;
  let maxNesting = 0;
  const dependencies: { from: string; to: string; ecosystem: string | null }[] = [];

  function walk(node: Parser.SyntaxNode, currentNesting: number) {
    if (DECISION_NODES.has(node.type)) {
      ccn++;
    }

    // For JS/TS logical operators
    if (node.type === "binary_expression") {
      const operator = node.childForFieldName("operator") || node.children[1];
      if (operator && (operator.type === "&&" || operator.type === "||")) {
        ccn++;
      }
    }

    // For Python logical operators
    if (node.type === "boolean_operator") {
      ccn++;
    }

    let nextNesting = currentNesting;
    if (node.type === "statement_block" || node.type === "block") {
      nextNesting++;
      maxNesting = Math.max(maxNesting, nextNesting);
    }

    // Extract JS/TS imports
    if (node.type === "import_statement") {
      const source = node.childForFieldName("source");
      if (source) {
        const val = source.text.replace(/['"]/g, "");
        const isInternal = val.startsWith(".") || val.startsWith("/");
        dependencies.push({
          from: filePath,
          to: val,
          ecosystem: isInternal ? null : "npm",
        });
      }
    }

    // Extract JS/TS requires
    if (node.type === "call_expression") {
      const func = node.childForFieldName("function");
      if (func && func.text === "require") {
        const args = node.childForFieldName("arguments");
        if (args) {
          const strNode = args.children.find((c) => c.type === "string");
          if (strNode) {
            const val = strNode.text.replace(/['"]/g, "");
            const isInternal = val.startsWith(".") || val.startsWith("/");
            dependencies.push({
              from: filePath,
              to: val,
              ecosystem: isInternal ? null : "npm",
            });
          }
        }
      }
    }

    // Extract Python imports
    if (node.type === "import_statement" || node.type === "import_from_statement") {
      const moduleNameNode = node.childForFieldName("module_name") || node.children.find(c => c.type === "dotted_name");
      if (moduleNameNode) {
        const val = moduleNameNode.text;
        const isInternal = val.startsWith(".");
        dependencies.push({
          from: filePath,
          to: val,
          ecosystem: isInternal ? null : "pypi",
        });
      }
    }

    for (const child of node.children) {
      walk(child, nextNesting);
    }
  }

  walk(root, 0);

  return {
    ccn,
    nloc: totalLines,
    nesting: maxNesting,
    dependencies,
  };
}
