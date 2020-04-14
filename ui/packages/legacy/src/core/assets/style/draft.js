import './css/medium-editor.min.css'
import './css/default.min.css'

const DraftStyle = `
  .DraftEditor-root {
    position: relative;  
  }

  .public-DraftEditorPlaceholder-root {
    position: absolute;
    opacity: 0.3;
    z-index: 0;
  }
  
  .DraftEditor-editorContainer {
    width: 100%;
    height: 100%;
    z-index: 1;
  }
`

export default DraftStyle
