
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface AVLNode {
  value: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
  state: 'default' | 'highlight' | 'inserting' | 'balancing' | 'rotated';
  balanceFactor?: number;
}

interface NodePosition {
  node: AVLNode;
  x: number;
  y: number;
  level: number;
}

const AVLTreeVisualizer = () => {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [speed, setSpeed] = useState<number>(50);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  const nodePositions = useRef<NodePosition[]>([]);
  const animationQueue = useRef<(() => void)[]>([]);
  const canvasWidth = 800;
  const canvasHeight = 400;
  const nodeRadius = 20;
  
  // Calculate height of a node
  const height = (node: AVLNode | null): number => {
    return node ? node.height : 0;
  };
  
  // Calculate balance factor of a node
  const getBalanceFactor = (node: AVLNode | null): number => {
    return node ? height(node.left) - height(node.right) : 0;
  };
  
  // Create a new node
  const createNode = (value: number): AVLNode => {
    return {
      value,
      height: 1,
      left: null,
      right: null,
      state: 'inserting',
      balanceFactor: 0
    };
  };
  
  // Right rotation
  const rightRotate = (y: AVLNode): AVLNode => {
    const x = y.left as AVLNode;
    const T2 = x.right;
    
    // Perform rotation
    x.right = y;
    y.left = T2;
    
    // Update heights
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    
    // Mark nodes as rotated for animation
    x.state = 'rotated';
    y.state = 'rotated';
    
    return x;
  };
  
  // Left rotation
  const leftRotate = (x: AVLNode): AVLNode => {
    const y = x.right as AVLNode;
    const T2 = y.left;
    
    // Perform rotation
    y.left = x;
    x.right = T2;
    
    // Update heights
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    
    // Mark nodes as rotated for animation
    x.state = 'rotated';
    y.state = 'rotated';
    
    return y;
  };
  
  // Insert a node with balancing
  const insertNodeWithAnimation = (value: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    animationQueue.current = [];
    
    // Highlight that we're starting insertion
    animationQueue.current.push(() => {
      setMessage(`Inserting ${value} into the AVL tree...`);
    });
    
    // Function to perform insertion recursively
    const insert = (node: AVLNode | null, value: number): AVLNode => {
      if (!node) {
        return createNode(value);
      }
      
      // Highlight the current node being compared
      animationQueue.current.push(() => {
        setRoot(prev => updateNodeState(prev, node.value, 'highlight'));
        setMessage(`Comparing ${value} with ${node.value}...`);
      });
      
      // Standard BST insertion
      if (value < node.value) {
        animationQueue.current.push(() => {
          setMessage(`${value} < ${node.value}, going left`);
        });
        node.left = insert(node.left, value);
      } else if (value > node.value) {
        animationQueue.current.push(() => {
          setMessage(`${value} > ${node.value}, going right`);
        });
        node.right = insert(node.right, value);
      } else {
        // Equal values not allowed
        animationQueue.current.push(() => {
          setMessage(`${value} already exists in the tree`);
        });
        return node;
      }
      
      // Update height
      node.height = 1 + Math.max(height(node.left), height(node.right));
      
      // Calculate balance factor
      const balance = getBalanceFactor(node);
      node.balanceFactor = balance;
      
      animationQueue.current.push(() => {
        setRoot(prev => updateNodeState(prev, node.value, 'default'));
        setMessage(`Checking balance factor at ${node.value}: ${balance}`);
      });
      
      // Highlight imbalance
      if (Math.abs(balance) > 1) {
        animationQueue.current.push(() => {
          setRoot(prev => updateNodeState(prev, node.value, 'balancing'));
          setMessage(`Imbalance detected at ${node.value} (balance factor: ${balance})`);
        });
      }
      
      // Perform rotations if needed
      
      // Left Left Case
      if (balance > 1 && node.left && value < node.left.value) {
        animationQueue.current.push(() => {
          setMessage(`Performing Right Rotation (LL case) at ${node.value}`);
        });
        return rightRotate(node);
      }
      
      // Right Right Case
      if (balance < -1 && node.right && value > node.right.value) {
        animationQueue.current.push(() => {
          setMessage(`Performing Left Rotation (RR case) at ${node.value}`);
        });
        return leftRotate(node);
      }
      
      // Left Right Case
      if (balance > 1 && node.left && value > node.left.value) {
        animationQueue.current.push(() => {
          setMessage(`Performing Left-Right Rotation (LR case) at ${node.value}`);
          setMessage(`Step 1: Left rotation at ${node.left.value}`);
        });
        node.left = leftRotate(node.left);
        animationQueue.current.push(() => {
          setMessage(`Step 2: Right rotation at ${node.value}`);
        });
        return rightRotate(node);
      }
      
      // Right Left Case
      if (balance < -1 && node.right && value < node.right.value) {
        animationQueue.current.push(() => {
          setMessage(`Performing Right-Left Rotation (RL case) at ${node.value}`);
          setMessage(`Step 1: Right rotation at ${node.right.value}`);
        });
        node.right = rightRotate(node.right);
        animationQueue.current.push(() => {
          setMessage(`Step 2: Left rotation at ${node.value}`);
        });
        return leftRotate(node);
      }
      
      return node;
    };
    
    // Start insertion
    const newRoot = insert(root, value);
    
    // Update the root with the new tree
    animationQueue.current.push(() => {
      setRoot(newRoot);
      setMessage(`Inserted ${value} and balanced the tree`);
    });
    
    // Reset states after all operations
    animationQueue.current.push(() => {
      resetNodeStates(newRoot);
      setIsAnimating(false);
      setInputValue('');
    });
    
    // Process the animation queue
    processAnimationQueue();
  };
  
  // Process animation queue
  const processAnimationQueue = () => {
    if (animationQueue.current.length === 0) return;
    
    const animation = animationQueue.current.shift();
    if (animation) {
      animation();
    }
    
    if (animationQueue.current.length > 0) {
      setTimeout(() => {
        processAnimationQueue();
      }, 1000 - speed * 8);
    }
  };
  
  // Update a specific node's state
  const updateNodeState = (node: AVLNode | null, value: number, state: AVLNode['state']): AVLNode | null => {
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
  
  // Reset all node states to default
  const resetNodeStates = (node: AVLNode | null) => {
    if (!node) return;
    
    node.state = 'default';
    
    if (node.left) resetNodeStates(node.left);
    if (node.right) resetNodeStates(node.right);
  };
  
  // Handle insert button click
  const handleInsert = () => {
    if (!inputValue || isAnimating) return;
    
    const value = parseInt(inputValue);
    
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    insertNodeWithAnimation(value);
  };
  
  // Create a sample AVL tree
  const createSampleTree = () => {
    if (isAnimating || root !== null) return;
    
    const values = [10, 20, 30, 40, 50, 25];
    let tempRoot = null;
    
    // Insert nodes one by one
    for (const value of values) {
      const insert = (node: AVLNode | null, value: number): AVLNode => {
        if (!node) {
          return createNode(value);
        }
        
        if (value < node.value) {
          node.left = insert(node.left, value);
        } else if (value > node.value) {
          node.right = insert(node.right, value);
        } else {
          return node;
        }
        
        node.height = 1 + Math.max(height(node.left), height(node.right));
        const balance = getBalanceFactor(node);
        node.balanceFactor = balance;
        
        // Left Left Case
        if (balance > 1 && node.left && getBalanceFactor(node.left) >= 0) {
          return rightRotate(node);
        }
        
        // Left Right Case
        if (balance > 1 && node.left && getBalanceFactor(node.left) < 0) {
          node.left = leftRotate(node.left);
          return rightRotate(node);
        }
        
        // Right Right Case
        if (balance < -1 && node.right && getBalanceFactor(node.right) <= 0) {
          return leftRotate(node);
        }
        
        // Right Left Case
        if (balance < -1 && node.right && getBalanceFactor(node.right) > 0) {
          node.right = rightRotate(node.right);
          return leftRotate(node);
        }
        
        return node;
      };
      
      tempRoot = insert(tempRoot, value);
    }
    
    // Reset states
    if (tempRoot) resetNodeStates(tempRoot);
    
    setRoot(tempRoot);
    setMessage('Created a sample AVL tree');
  };
  
  // Clear the AVL tree
  const handleClear = () => {
    if (isAnimating) return;
    setRoot(null);
    setMessage('AVL tree cleared');
  };
  
  // Calculate node positions for rendering
  const calculateNodePositions = (node: AVLNode | null, level: number = 0, position: number = 0.5): NodePosition[] => {
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
      
      if (node.state === 'highlight') {
        fillColor = '#F59E0B'; // Yellow for highlights
      } else if (node.state === 'inserting') {
        fillColor = '#8B5CF6'; // Purple for insertion
      } else if (node.state === 'balancing') {
        fillColor = '#EF4444'; // Red for imbalance
      } else if (node.state === 'rotated') {
        fillColor = '#10B981'; // Green for rotated nodes
      }
      
      const balanceFactor = node.balanceFactor !== undefined ? node.balanceFactor : getBalanceFactor(node);
      
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
              node.state === 'inserting' || node.state === 'rotated' ? 'animate-pulse' : ''
            }`}
          />
          <text
            x={x}
            y={y - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            {node.value}
          </text>
          <text
            x={x}
            y={y + 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="9"
          >
            BF: {balanceFactor}
          </text>
        </g>
      );
    });
  };
  
  return (
    <div className="visualizer-container">
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex-grow">
          <label htmlFor="avl-input" className="block text-sm font-medium mb-1">
            Node Value
          </label>
          <Input
            id="avl-input"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a number"
            className="w-full sm:w-40"
            disabled={isAnimating}
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="avl-speed" className="block text-sm font-medium mb-1">
            Animation Speed: {speed}%
          </label>
          <Slider
            id="avl-speed"
            min={10}
            max={100}
            step={10}
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleInsert} disabled={!inputValue || isAnimating}>
            Insert Node
          </Button>
          <Button onClick={createSampleTree} disabled={isAnimating || root !== null} variant="outline">
            Create Sample Tree
          </Button>
          <Button onClick={handleClear} disabled={!root || isAnimating} variant="outline">
            Clear Tree
          </Button>
        </div>
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
            AVL tree is empty. Insert nodes or create a sample tree.
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>AVL Tree:</strong> A self-balancing binary search tree where the heights of the two child subtrees differ by at most one.
        </p>
        <p className="mt-2">
          <strong>Balance Factor (BF):</strong> height(left) - height(right). If |BF| &gt; 1, rotations are performed to rebalance.
        </p>
      </div>
    </div>
  );
};

export default AVLTreeVisualizer;
