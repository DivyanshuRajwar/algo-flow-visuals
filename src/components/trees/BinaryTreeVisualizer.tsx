
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  state: 'default' | 'highlight' | 'inserting' | 'traversing' | 'visited';
}

interface NodePosition {
  node: TreeNode;
  x: number;
  y: number;
  level: number;
}

const BinaryTreeVisualizer = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [traversalType, setTraversalType] = useState<string>('inorder');
  const [speed, setSpeed] = useState<number>(50);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  const nodePositions = useRef<NodePosition[]>([]);
  const canvasWidth = 800;
  const canvasHeight = 400;
  const nodeRadius = 20;
  
  // Calculate tree node positions for rendering
  const calculateNodePositions = (node: TreeNode | null, level: number = 0, position: number = 0.5): NodePosition[] => {
    if (!node) return [];
    
    const verticalSpacing = 80;
    const y = level * verticalSpacing + 50;
    const horizontalSpacing = canvasWidth / Math.pow(2, level + 1);
    const x = position * canvasWidth;
    
    const positions: NodePosition[] = [
      { node, x, y, level },
      ...calculateNodePositions(node.left, level + 1, position - horizontalSpacing / canvasWidth),
      ...calculateNodePositions(node.right, level + 1, position + horizontalSpacing / canvasWidth),
    ];
    
    return positions;
  };
  
  // Insert a node into the tree
  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (node === null) {
      return { value, left: null, right: null, state: 'inserting' };
    }
    
    if (value < node.value) {
      return { ...node, left: insertNode(node.left, value) };
    } else if (value > node.value) {
      return { ...node, right: insertNode(node.right, value) };
    }
    
    // Value already exists, just highlight it
    return { ...node, state: 'highlight' };
  };
  
  // Handle node insertion
  const handleInsert = () => {
    if (!inputValue || isAnimating) return;
    
    const value = parseInt(inputValue);
    
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    setIsAnimating(true);
    
    // Insert node with animation
    const newRoot = insertNode(root, value);
    setRoot(newRoot);
    setInputValue('');
    setMessage(`Inserted ${value} into the tree`);
    
    // After animation, reset states
    setTimeout(() => {
      resetNodeStates(newRoot);
      setIsAnimating(false);
    }, 1000 - speed * 8);
  };
  
  // Reset all node states to default
  const resetNodeStates = (node: TreeNode | null) => {
    if (!node) return;
    
    setRoot(prev => updateNodeState(prev, node.value, 'default'));
    
    if (node.left) resetNodeStates(node.left);
    if (node.right) resetNodeStates(node.right);
  };
  
  // Update a specific node's state
  const updateNodeState = (node: TreeNode | null, value: number, state: TreeNode['state']): TreeNode | null => {
    if (!node) return null;
    
    if (node.value === value) {
      return { ...node, state };
    }
    
    return {
      ...node,
      left: updateNodeState(node.left, value, state),
      right: updateNodeState(node.right, value, state),
    };
  };
  
  // Perform tree traversal animation
  const handleTraversal = () => {
    if (!root || isAnimating) {
      if (!root) setMessage('Tree is empty!');
      return;
    }
    
    setIsAnimating(true);
    setMessage(`Starting ${traversalType} traversal...`);
    
    const visitOrder: number[] = [];
    
    // Define traversal functions
    const inOrderTraversal = (node: TreeNode | null) => {
      if (!node) return;
      inOrderTraversal(node.left);
      visitOrder.push(node.value);
      inOrderTraversal(node.right);
    };
    
    const preOrderTraversal = (node: TreeNode | null) => {
      if (!node) return;
      visitOrder.push(node.value);
      preOrderTraversal(node.left);
      preOrderTraversal(node.right);
    };
    
    const postOrderTraversal = (node: TreeNode | null) => {
      if (!node) return;
      postOrderTraversal(node.left);
      postOrderTraversal(node.right);
      visitOrder.push(node.value);
    };
    
    // Execute selected traversal
    switch (traversalType) {
      case 'inorder':
        inOrderTraversal(root);
        break;
      case 'preorder':
        preOrderTraversal(root);
        break;
      case 'postorder':
        postOrderTraversal(root);
        break;
    }
    
    // Animate traversal
    let step = 0;
    
    const animateTraversal = () => {
      if (step >= visitOrder.length) {
        setMessage(`${traversalType} traversal complete!`);
        resetNodeStates(root);
        setIsAnimating(false);
        return;
      }
      
      // Highlight current node
      setRoot(prev => updateNodeState(prev, visitOrder[step], 'traversing'));
      
      // Mark previously visited nodes
      if (step > 0) {
        setRoot(prev => updateNodeState(prev, visitOrder[step - 1], 'visited'));
      }
      
      step++;
      
      setTimeout(() => {
        animateTraversal();
      }, 1000 - speed * 8);
    };
    
    animateTraversal();
  };
  
  // Create a sample tree for demonstration
  const createSampleTree = () => {
    if (isAnimating) return;
    
    const sampleValues = [50, 30, 70, 20, 40, 60, 80];
    let newRoot: TreeNode | null = null;
    
    for (const value of sampleValues) {
      newRoot = insertNode(newRoot, value);
    }
    
    setRoot(newRoot);
    setMessage('Created a sample binary search tree');
    
    // Reset states after animation
    setTimeout(() => {
      resetNodeStates(newRoot);
    }, 500);
  };
  
  // Clear the tree
  const handleClear = () => {
    if (isAnimating) return;
    setRoot(null);
    setMessage('Tree cleared');
  };
  
  // Calculate and store node positions for rendering
  if (root) {
    nodePositions.current = calculateNodePositions(root);
  } else {
    nodePositions.current = [];
  }
  
  // Render edges between nodes
  const renderEdges = () => {
    return nodePositions.current.map((pos) => {
      const { node, x, y } = pos;
      
      return (
        <>
          {node.left && (() => {
            const leftPos = nodePositions.current.find(p => p.node === node.left);
            if (leftPos) {
              return (
                <line
                  key={`${node.value}-${node.left.value}`}
                  x1={x}
                  y1={y}
                  x2={leftPos.x}
                  y2={leftPos.y}
                  stroke="gray"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })()}
          
          {node.right && (() => {
            const rightPos = nodePositions.current.find(p => p.node === node.right);
            if (rightPos) {
              return (
                <line
                  key={`${node.value}-${node.right.value}`}
                  x1={x}
                  y1={y}
                  x2={rightPos.x}
                  y2={rightPos.y}
                  stroke="gray"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })()}
        </>
      );
    });
  };
  
  // Render nodes
  const renderNodes = () => {
    return nodePositions.current.map((pos) => {
      const { node, x, y } = pos;
      
      let fillColor = '#3B82F6'; // Default blue
      
      if (node.state === 'highlight' || node.state === 'inserting') {
        fillColor = '#8B5CF6'; // Purple for highlight/insert
      } else if (node.state === 'traversing') {
        fillColor = '#F59E0B'; // Yellow for current traversal
      } else if (node.state === 'visited') {
        fillColor = '#10B981'; // Green for visited
      }
      
      return (
        <g key={`node-${node.value}`}>
          <circle
            cx={x}
            cy={y}
            r={nodeRadius}
            fill={fillColor}
            stroke="white"
            strokeWidth="2"
            className={`transition-all duration-300 ${
              node.state === 'inserting' ? 'animate-pulse' : ''
            }`}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            {node.value}
          </text>
        </g>
      );
    });
  };
  
  return (
    <div className="visualizer-container">
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex-grow">
          <label htmlFor="tree-input" className="block text-sm font-medium mb-1">
            Node Value
          </label>
          <Input
            id="tree-input"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a number"
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="traversal-type" className="block text-sm font-medium mb-1">
            Traversal Type
          </label>
          <Select 
            value={traversalType} 
            onValueChange={setTraversalType}
          >
            <SelectTrigger id="traversal-type" className="w-full sm:w-40">
              <SelectValue placeholder="Select traversal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inorder">In-order</SelectItem>
              <SelectItem value="preorder">Pre-order</SelectItem>
              <SelectItem value="postorder">Post-order</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-grow">
          <label htmlFor="tree-speed" className="block text-sm font-medium mb-1">
            Animation Speed: {speed}%
          </label>
          <Slider
            id="tree-speed"
            min={10}
            max={100}
            step={10}
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            className="w-full sm:w-40"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Button onClick={handleInsert} disabled={!inputValue || isAnimating}>
          Insert Node
        </Button>
        <Button onClick={handleTraversal} disabled={!root || isAnimating}>
          Start Traversal
        </Button>
        <Button onClick={createSampleTree} disabled={isAnimating || root !== null} variant="outline">
          Create Sample Tree
        </Button>
        <Button onClick={handleClear} disabled={!root || isAnimating} variant="outline">
          Clear Tree
        </Button>
      </div>
      
      {message && (
        <div className="p-2 mb-4 rounded bg-blue-100 text-blue-800 text-center">
          {message}
        </div>
      )}
      
      <div className="my-8 overflow-auto">
        <svg width="100%" height={canvasHeight} style={{ minWidth: canvasWidth }}>
          <g>
            {root && renderEdges()}
            {root && renderNodes()}
          </g>
        </svg>
        
        {!root && (
          <div className="flex justify-center items-center h-64 text-gray-400 italic">
            Tree is empty. Insert nodes or create a sample tree.
          </div>
        )}
      </div>
    </div>
  );
};

export default BinaryTreeVisualizer;
