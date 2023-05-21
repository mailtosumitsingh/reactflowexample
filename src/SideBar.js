import React from 'react';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">Components.</div>
      <ul>
        <li>
      <div className="" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div>
      </li>
      <li>
      <div className="" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      </li>
      <li>
      <div className="" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div>
      </li>
      <li>  
        <div className="" onDragStart={(event) => onDragStart(event, 'textUpdater')} draggable>
        Text input node
      </div>
      </li>
      </ul>
    </aside>
  );
};
