import React from 'react';
import './styles/App.css';
import { Labeller } from './components/Labeller'

export function App() {
  const testSchema = [{
    label: 'Question',
    key: 'question',
    type: 'text',
  }, {
    label: 'Difficulty',
    key: 'difficulty',
    type: 'number',
    min: 1,
    max: 10,
  }, {
    label: 'Marks',
    key: 'marks',
    type: 'number',
    attributes: {
      min: 1,
      max: 10,
    }
  }, {
    label: 'Topic',
    key: 'topic',
    type: 'select',
    optionGroups: [
      { label: 'abc', options: [{ label: 'groupOpt1', value: '1' }] }
    ],
  }]

  return (
    <div className="App">
      <Labeller schema={testSchema} />
    </div>
  );
}
