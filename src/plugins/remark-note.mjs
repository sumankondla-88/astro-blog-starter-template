// Turns `> **Note:** …` blockquotes into <aside class="note"> callouts.
export function remarkNote() {
	return (tree) => {
		const visit = (node) => {
			if (node.type === "blockquote") {
				const para = node.children?.[0];
				const first = para?.type === "paragraph" ? para.children?.[0] : undefined;
				const label = first?.type === "strong" ? first.children?.[0]?.value : undefined;
				if (label && /^note:?$/i.test(label.trim())) {
					node.data = { hName: "aside", hProperties: { className: ["note"] } };
					para.children[0] = {
						type: "text",
						value: "",
						data: { hName: "span", hProperties: { className: ["note-label"] }, hChildren: [{ type: "text", value: "Note" }] },
					};
					if (para.children[1]?.type === "text") para.children[1].value = para.children[1].value.replace(/^\s+/, "");
				}
			}
			node.children?.forEach(visit);
		};
		visit(tree);
	};
}
