import Parser from "web-tree-sitter";

export interface RawChunk {
  filePath: string;
  symbolName: string;
  symbolType: string;
  startLine: number;
  endLine: number;
  content: string;
}

let tsParser: Parser | null = null;
let pyParser: Parser | null = null;

const TOP_LEVEL_TS = new Set([
  "function_declaration",
  "class_declaration",
  "interface_declaration",
  "type_alias_declaration",
  "enum_declaration",
  "export_statement",
  "lexical_declaration",
  "variable_declaration",
]);

const TOP_LEVEL_PY = new Set([
  "function_definition",
  "class_definition",
  "decorated_definition",
]);

const COMMENT_TYPES = new Set(["comment", "string"]);

function getLanguageForExt(ext: string): "typescript" | "python" | null {
  if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].includes(ext)) return "typescript";
  if (ext === ".py") return "python";
  return null;
}

async function getParser(lang: "typescript" | "python"): Promise<Parser> {
  if (lang === "typescript" && tsParser) return tsParser;
  if (lang === "python" && pyParser) return pyParser;

  await Parser.init();
  const parser = new Parser();
  
  // Use eval to completely hide the require from Turbopack's static analysis
  const reqResolve = eval("require.resolve");

  if (lang === "typescript") {
    const wasmPath = reqResolve("tree-sitter-typescript/tree-sitter-typescript.wasm");
    const Language = await Parser.Language.load(wasmPath);
    parser.setLanguage(Language);
    tsParser = parser;
  } else {
    const wasmPath = reqResolve("tree-sitter-python/tree-sitter-python.wasm");
    const Language = await Parser.Language.load(wasmPath);
    parser.setLanguage(Language);
    pyParser = parser;
  }

  return parser;
}

function symbolTypeFromNode(node: Parser.SyntaxNode): string {
  if (node.type.includes("function")) return "function";
  if (node.type.includes("class")) return "class";
  if (node.type.includes("interface")) return "interface";
  if (node.type.includes("enum")) return "enum";
  if (node.type.includes("type_alias")) return "type";
  return "declaration";
}

function symbolNameFromNode(node: Parser.SyntaxNode): string {
  let target = node;
  if (node.type === "export_statement" || node.type === "decorated_definition") {
    const child = node.children.find(
      (c) =>
        c.type.includes("declaration") ||
        c.type.includes("definition") ||
        c.type === "lexical_declaration"
    );
    if (child) target = child;
  }

  const nameNode =
    target.childForFieldName("name") ??
    target.children.find((c) => c.type === "identifier" || c.type === "property_identifier");

  if (nameNode) return nameNode.text;

  if (target.type === "lexical_declaration" || target.type === "variable_declaration") {
    const declarator = target.children.find(
      (c) => c.type === "variable_declarator"
    );
    if (declarator) {
      const n = declarator.childForFieldName("name");
      if (n) return n.text;
    }
  }

  return "<anonymous>";
}

function getPrecedingComment(
  node: Parser.SyntaxNode,
  sourceLines: string[]
): string | null {
  const prev = node.previousNamedSibling;
  if (!prev) return null;
  if (!COMMENT_TYPES.has(prev.type)) return null;
  if (prev.endPosition.row + 1 !== node.startPosition.row) return null;
  return prev.text;
}

import { analyzeAst, type FileAnalytics } from "../analytics/complexity";

export async function extractSymbolChunks(file: {
  path: string;
  content: string;
}): Promise<{ chunks: RawChunk[]; analytics?: FileAnalytics }> {
  const ext = "." + file.path.split(".").pop();
  const lang = getLanguageForExt(ext);
  const sourceLines = file.content.split("\n");
  const fallbackChunk = {
    filePath: file.path,
    symbolName: file.path.split("/").pop() ?? file.path,
    symbolType: "file",
    startLine: 1,
    endLine: sourceLines.length,
    content: file.content,
  };

  if (!lang) {
    return { chunks: [fallbackChunk] };
  }

  let parser: Parser;
  try {
    parser = await getParser(lang);
  } catch {
    return { chunks: [fallbackChunk] };
  }

  const tree = parser.parse(file.content);
  const root = tree.rootNode;
  const chunks: RawChunk[] = [];

  const topLevelTypes = lang === "typescript" ? TOP_LEVEL_TS : TOP_LEVEL_PY;

  for (const node of root.children) {
    if (!topLevelTypes.has(node.type)) continue;

    const comment = getPrecedingComment(node, sourceLines);
    const startLine = comment
      ? node.previousNamedSibling!.startPosition.row + 1
      : node.startPosition.row + 1;
    const endLine = node.endPosition.row + 1;
    const content = comment ? comment + "\n" + node.text : node.text;

    chunks.push({
      filePath: file.path,
      symbolName: symbolNameFromNode(node),
      symbolType: symbolTypeFromNode(node),
      startLine,
      endLine,
      content,
    });
  }

  const analytics = analyzeAst(root, file.path, sourceLines.length);

  if (chunks.length === 0) {
    return { chunks: [fallbackChunk], analytics };
  }

  return { chunks, analytics };
}
