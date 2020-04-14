import './css/medium-editor.min.css'
import './css/default.min.css'


const MediumStyle = `
  .medium-editor-toolbar-anchor-preview,
  .medium-editor-toolbar-form .medium-editor-toolbar-input {
    font-size: 0.8em;
  }
  
  .medium-editor-toolbar li button:hover {
    color: #34e79a;
  }
  
  .medium-toolbar-arrow-under:after {
    top: 35px;
  }

  .medium-editor-toolbar li button {
    height: 35px;
    min-width: 50px;
    line-height: normal;
    padding: 0px 15px;
  }
  
  .medium-editor-element > pre {
    font-family: Roboto;
    font-weight: 300;
    white-space: normal;
  }
`

export default MediumStyle
