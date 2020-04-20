export const editorConfig = {
  toolbar: {
    buttons: [
      {
        name: 'h2',
        action: 'append-h3',
        aria: 'header type 2',
        tagNames: ['h3'],
        contentDefault: '<b>T</b>',
        classList: ['custom-class-h2'],
        attrs: {
          'data-custom-attr': 'attr-value-h2',
        },
      },
      'bold', 'italic', 'underline'],
  },
  paste: {
    forcePlainText: true,
    cleanPastedHTML: false,
    cleanReplacements: ['style'],
    cleanAttrs: ['class', 'style', 'dir'],
    cleanTags: ['meta', 'label'],
    unwrapTags: [],
  },
}

export function getElementByQuery(editor, query) {
  const [element] = editor.elements

  return element.querySelectorAll(query)
}

export function editorModeView(editor) {
  const [element] = editor.elements
  element.setAttribute('contentEditable', 'false')
}
