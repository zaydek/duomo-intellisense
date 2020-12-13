import * as vscode from 'vscode';

const hstackDocs = `**HStack** stacks children horizontally.

![](https://i.ibb.co/z8frhcb/hstack.png)

\`\`\`html
<div class="hstack">
  <div class="w-32 h-32 ..."></div>
  <div class="w-32 h-32 ..."></div>
  <div class="w-32 h-32 ..."></div>
</div>
\`\`\`

Note that children are automatically centered.`;

const vstackDocs = `**VStack** stacks children vertically.

![](https://i.ibb.co/Xy21722/vstack.png)

\`\`\`html
<div class="vstack">
  <div class="w-32 h-32 ..."></div>
  <div class="w-32 h-32 ..."></div>
  <div class="w-32 h-32 ..."></div>
</div>
\`\`\`

Note that children are automatically centered.`;

const zstackDocs = `**ZStack** stacks children on top of each other.

![](https://i.ibb.co/FHwRNxK/zstack.png)

\`\`\`html
<div class="zstack">
  <div class="w-160 h-160 ..."></div>
  <div class="w-160 h-160 ..."></div>
  <div class="w-160 h-160 ..."></div>
</div>
\`\`\`

Note that children are automatically centered.`;

const hstackAutocomplete = new vscode.CompletionItem('hstack ');
hstackAutocomplete.kind = vscode.CompletionItemKind.Constant;
hstackAutocomplete.documentation = new vscode.MarkdownString(hstackDocs);
hstackAutocomplete.command = {
	command: 'editor.action.triggerSuggest',
	title: 'Re-trigger completions...',
};

const vstackAutoComplete = new vscode.CompletionItem('vstack ');
vstackAutoComplete.kind = vscode.CompletionItemKind.Constant;
vstackAutoComplete.documentation = new vscode.MarkdownString(vstackDocs);
vstackAutoComplete.command = {
	command: 'editor.action.triggerSuggest',
	title: 'Re-trigger completions...',
};

const zstackAutoComplete = new vscode.CompletionItem('zstack ');
zstackAutoComplete.kind = vscode.CompletionItemKind.Constant;
zstackAutoComplete.documentation = new vscode.MarkdownString(zstackDocs);
zstackAutoComplete.command = {
	command: 'editor.action.triggerSuggest',
	title: 'Re-trigger completions...',
};

export function activate(context: vscode.ExtensionContext) {
	const provider1 = vscode.languages.registerCompletionItemProvider('html', {
		provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position,
			token: vscode.CancellationToken,
			context: vscode.CompletionContext
		) {
			return [hstackAutocomplete, vstackAutoComplete, zstackAutoComplete];
		},
	});

	const provider2 = vscode.languages.registerCompletionItemProvider(
		'html',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('class="')) {
					return undefined;
				}
				return [hstackAutocomplete, vstackAutoComplete, zstackAutoComplete];
			},
		},
		'"'
	);

	context.subscriptions.push(provider1, provider2);
}
