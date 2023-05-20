import { useCallback } from 'react';
import { Handle, Position,NodeResizer, NodeResizeControl  } from 'reactflow';

const handleStyle = { left: 10 };

function TextUpdaterNode({ data, isConnectable }) {

  const onChange = useCallback((evt) => {
    console.log(evt.target.id+":"+evt.target.value);
    data[evt.target.id] = evt.target.value;
  }, []);
  return (
  
    <div className="text-updater-node">
       <NodeResizer minWidth={100} minHeight={30} />
       {
        console.log(data.inputs)
      }
      {
       data.inputs.map(function(object, i){
        console.log(object);
        return <Handle type="target" position={Position.Top}  style={{ left: (i+1)*20}} isConnectable={isConnectable} id={object} />
    })}
      
      {
       data.inputs.map(function(object, i){
        console.log(object);
        return <div>
        <input id={"input"+object} name={"input"+object} onChange={onChange} className="nodrag" />
      </div>
    })}
      {
        console.log(data.outputs)
       }
      {
       data.outputs.map(function(object, i){
        console.log(object);
        return <Handle type="source" position={Position.Bottom}   style={{ left: (i+1)*20}}  id={object} isConnectable={isConnectable} />
    })}
    </div>
  );
}

export default TextUpdaterNode;
