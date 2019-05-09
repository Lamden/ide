

import * as React from 'react';
import * as monaco from 'monaco-editor';

export default class MonacoEditor extends React.Component {
  componentDidMount() {
   // const { path, value, language, onValueChange, ...options } = this.props;
    const model = monaco.editor.createModel(
      { value: '\n',
        width: '100%',
       height: '100%',});
  
    this._editor = monaco.editor.create(this._node);
    this._editor.setModel(model);
    this._subscription = model.onDidChangeContent(() => {
      this.props.onValueChange(model.getValue());
    });
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
  
    const model = this._editor.getModel();
  
    if (value !== model.getValue()) {
      model.pushEditOperations(
        [],
        [
          {
            text: value,
          },
        ]
      );
    }
  }

  componentWillUnmount() {
    this._editor && this._editor.dispose();
    this._subscription && this._subscription.dispose();
  }

  render() {
    return <div ref={c => this._node = c} />
  }
}