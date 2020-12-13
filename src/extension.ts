import * as vscode from "vscode"

const hstackDocs = `**HStack** stacks children horizontally.

![](https://i.ibb.co/z8frhcb/hstack.png)

\`\`\`html
<div class="hstack">
  <div class="w-32 h-32 ..."></div>
  <div class="w-32 h-32 ..."></div>
  <div class="w-32 h-32 ..."></div>
</div>
\`\`\`

Note that children are automatically centered.`

const vstackDocs = `**VStack** stacks children vertically.

![](https://i.ibb.co/Xy21722/vstack.png)

\`\`\`html
<div class="vstack">
  <div class="w-32 h-32 ..."></div>
  <div class="w-32 h-32 ..."></div>
  <div class="w-32 h-32 ..."></div>
</div>
\`\`\`

Note that children are automatically centered.`

const zstackDocs = `**ZStack** stacks children on top of each other.

![](https://i.ibb.co/FHwRNxK/zstack.png)

\`\`\`html
<div class="zstack">
  <div class="w-160 h-160 ..."></div>
  <div class="w-160 h-160 ..."></div>
  <div class="w-160 h-160 ..."></div>
</div>
\`\`\`

Note that children are automatically centered.`

// TODO: Remove trailing space. The trailing space prevents completions from
// appearing in between classes. In order for completions to appear in between
// classes, `provider2` needs to be scoped to anywhere inside of `class="..."`.
const hstackCompletion = new vscode.CompletionItem("hstack ")
hstackCompletion.kind = vscode.CompletionItemKind.Constant
hstackCompletion.documentation = new vscode.MarkdownString(hstackDocs)
hstackCompletion.command = {
	command: "editor.action.triggerSuggest",
	title: "Re-trigger completions...",
}

const vstackCompletion = new vscode.CompletionItem("vstack ")
vstackCompletion.kind = vscode.CompletionItemKind.Constant
vstackCompletion.documentation = new vscode.MarkdownString(vstackDocs)
vstackCompletion.command = {
	command: "editor.action.triggerSuggest",
	title: "Re-trigger completions...",
}

const zstackCompletion = new vscode.CompletionItem("zstack ")
zstackCompletion.kind = vscode.CompletionItemKind.Constant
zstackCompletion.documentation = new vscode.MarkdownString(zstackDocs)
zstackCompletion.command = {
	command: "editor.action.triggerSuggest",
	title: "Re-trigger completions...",
}

const completions = [hstackCompletion, vstackCompletion, zstackCompletion]

// TODO: Extend completion support for `htm html js jsx ts tsx` extensions.
// This may need to expand over time to support non-standard filetypes.
export function activate(context: vscode.ExtensionContext) {
	// This provider provides intellisense for Duomo classes anywhere.
	//
	// TODO: This provider should be deprecated; in theory we only need providers
	// for typing scoped to in between the quotes of `class="..."` and on hover for
	// matching classes.
	const provider1 = vscode.languages.registerCompletionItemProvider("html", {
		provideCompletionItems() {
			// TODO: Scope these completions to the contents of `class="..."`.
			// Completions probably shouldn’t appear outside of the context of a class.
			return completions
		},
	})

	// This provider provides intellisense for Duomo classes when the line ends with `class="`.
	// This is simply a heuristic but it make sense to target `class="..."`. Finally,
	// JSX and TSX files could simply trigger on `className="..."`.
	const provider2 = vscode.languages.registerCompletionItemProvider(
		"html",
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				// TODO: Trigger completions anywhere in the scope of `class="..."`
				// not just the start; `class="`.
				const linePrefix = document.lineAt(position).text.substr(0, position.character)
				if (!linePrefix.endsWith('class="')) {
					return undefined
				}
				return completions
			},
		},
		'"',
	)

	// This provider provides intellisense for Duomo classes on hover.
	const provider3 = vscode.languages.registerHoverProvider("html", {
		provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
			const range = document.getWordRangeAtPosition(position)
			const word = document.getText(range)

			if (word) {
				const match = ({
					hstack: hstackDocs,
					vstack: vstackDocs,
					zstack: zstackDocs,
				} as any)[word] // FIXME
				if (match) {
					const markdown = new vscode.MarkdownString(match)
					return new vscode.Hover(markdown)
				}
			}
		},
	})

	context.subscriptions.push(provider2, provider3)
}
