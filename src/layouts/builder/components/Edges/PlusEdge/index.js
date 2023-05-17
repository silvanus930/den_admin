import React from 'react';
import { getBezierPath } from 'reactflow';
import { Box, Button, IconButton, Icon, TextField, Input, Card, Divider, colorManipulator } from '@mui/material';

import './index.css';

const foreignObjectSize = 40;

const onEdgeClick = (evt, id) => {
    evt.stopPropagation();
    alert(`remove ${id}`);
};

export default function PlusEdge({
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    sourceHandle,
    targetHandle,
    style = {},
    markerEnd,
    data,
}) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={labelX - foreignObjectSize / 2}
                y={labelY - foreignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <div>
                    <button className="edgebutton" onClick={() => {
                        data?.handle({
                            id,
                            source,
                            target,
                            sourceX,
                            sourceY,
                            targetX,
                            targetY,
                            sourceHandle,
                            targetHandle,
                        });
                    }
                    }>
                        <Icon fontSize="small" sx={{ color: 'Highlight' }}>
                            {'add'}
                        </Icon>
                    </button>
                </div>
            </foreignObject>
        </>
    );
}
