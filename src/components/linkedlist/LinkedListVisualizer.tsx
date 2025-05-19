
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface LinkedListNode {
  value: string;
  state: 'default' | 'highlight' | 'inserting' | 'removing' | 'traversing';
}

const LinkedListVisualizer = () => {
  const [list, setList] = useState<LinkedListNode[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputIndex, setInputIndex] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [speed, setSpeed] = useState<number>(50);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // Add a node at head
  const handleAddAtHead = () => {
    if (!inputValue || isAnimating) return;
    
    setIsAnimating(true);
    const newNode: LinkedListNode = { value: inputValue, state: 'inserting' };
    
    setList(prev => [newNode, ...prev]);
    setInputValue('');
    setMessage(`Added "${inputValue}" at the head`);
    
    // After animation, change state back to default
    setTimeout(() => {
      setList(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[0].state = 'default';
        }
        return updated;
      });
      setIsAnimating(false);
    }, 1000 - speed * 8);
  };
  
  // Add a node at tail
  const handleAddAtTail = () => {
    if (!inputValue || isAnimating) return;
    
    setIsAnimating(true);
    const newNode: LinkedListNode = { value: inputValue, state: 'inserting' };
    
    setList(prev => [...prev, newNode]);
    setInputValue('');
    setMessage(`Added "${inputValue}" at the tail`);
    
    // After animation, change state back to default
    setTimeout(() => {
      setList(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1].state = 'default';
        }
        return updated;
      });
      setIsAnimating(false);
    }, 1000 - speed * 8);
  };
  
  // Add a node at specific index
  const handleAddAtIndex = () => {
    if (!inputValue || !inputIndex || isAnimating) return;
    
    const index = parseInt(inputIndex);
    
    if (isNaN(index) || index < 0 || index > list.length) {
      setMessage(`Invalid index. Must be between 0 and ${list.length}`);
      return;
    }
    
    setIsAnimating(true);
    const newNode: LinkedListNode = { value: inputValue, state: 'inserting' };
    
    setList(prev => {
      const updated = [...prev];
      updated.splice(index, 0, newNode);
      return updated;
    });
    
    setInputValue('');
    setInputIndex('');
    setMessage(`Added "${inputValue}" at index ${index}`);
    
    // After animation, change state back to default
    setTimeout(() => {
      setList(prev => {
        const updated = [...prev];
        if (updated.length > 0 && index < updated.length) {
          updated[index].state = 'default';
        }
        return updated;
      });
      setIsAnimating(false);
    }, 1000 - speed * 8);
  };
  
  // Delete a node at specific index
  const handleDeleteAtIndex = () => {
    if (!inputIndex || isAnimating) return;
    
    const index = parseInt(inputIndex);
    
    if (isNaN(index) || index < 0 || index >= list.length) {
      setMessage(`Invalid index. Must be between 0 and ${list.length - 1}`);
      return;
    }
    
    setIsAnimating(true);
    
    // Highlight node being deleted
    setList(prev => {
      const updated = [...prev];
      updated[index].state = 'removing';
      return updated;
    });
    
    const deletedValue = list[index].value;
    
    // After animation, remove the node
    setTimeout(() => {
      setList(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
      
      setInputIndex('');
      setMessage(`Deleted node at index ${index} with value "${deletedValue}"`);
      setIsAnimating(false);
    }, 1000 - speed * 8);
  };
  
  // Traverse the linked list
  const handleTraverse = () => {
    if (list.length === 0 || isAnimating) {
      setMessage('List is empty!');
      return;
    }
    
    setIsAnimating(true);
    setMessage('Traversing the linked list...');
    
    let currentIndex = 0;
    
    const traverseStep = () => {
      if (currentIndex >= list.length) {
        setMessage('Traversal complete!');
        setIsAnimating(false);
        return;
      }
      
      // Highlight current node
      setList(prev => {
        const updated = [...prev];
        
        // Reset previous node if exists
        if (currentIndex > 0) {
          updated[currentIndex - 1].state = 'default';
        }
        
        updated[currentIndex].state = 'traversing';
        return updated;
      });
      
      currentIndex++;
      
      setTimeout(() => {
        traverseStep();
      }, 1000 - speed * 8);
    };
    
    traverseStep();
  };
  
  // Clear the linked list
  const handleClear = () => {
    if (isAnimating) return;
    setList([]);
    setMessage('Linked list cleared');
  };
  
  return (
    <div className="visualizer-container">
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex-grow">
          <label htmlFor="node-value" className="block text-sm font-medium mb-1">
            Node Value
          </label>
          <Input
            id="node-value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter any value"
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="node-index" className="block text-sm font-medium mb-1">
            Index
          </label>
          <Input
            id="node-index"
            type="number"
            value={inputIndex}
            onChange={(e) => setInputIndex(e.target.value)}
            placeholder="Enter index"
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="list-speed" className="block text-sm font-medium mb-1">
            Animation Speed: {speed}%
          </label>
          <Slider
            id="list-speed"
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
        <Button onClick={handleAddAtHead} disabled={!inputValue || isAnimating}>
          Add at Head
        </Button>
        <Button onClick={handleAddAtTail} disabled={!inputValue || isAnimating}>
          Add at Tail
        </Button>
        <Button onClick={handleAddAtIndex} disabled={!inputValue || !inputIndex || isAnimating}>
          Add at Index
        </Button>
        <Button onClick={handleDeleteAtIndex} disabled={!inputIndex || isAnimating} variant="outline">
          Delete at Index
        </Button>
        <Button onClick={handleTraverse} disabled={list.length === 0 || isAnimating} variant="outline">
          Traverse
        </Button>
        <Button onClick={handleClear} disabled={list.length === 0 || isAnimating} variant="outline">
          Clear
        </Button>
      </div>
      
      {message && (
        <div className="p-2 mb-4 rounded bg-blue-100 text-blue-800 text-center">
          {message}
        </div>
      )}
      
      <div className="flex justify-center my-10 overflow-x-auto pb-4">
        <div className="flex items-center">
          {list.length === 0 ? (
            <div className="p-4 text-gray-400 italic">
              Empty Linked List
            </div>
          ) : (
            list.map((node, idx) => (
              <div key={idx} className="flex items-center">
                <div
                  className={`flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full border-2 transition-all ${
                    node.state === 'highlight' || node.state === 'traversing'
                      ? 'bg-secondary text-white border-secondary scale-110'
                      : node.state === 'inserting'
                        ? 'bg-green-500 text-white border-green-500 scale-110'
                        : node.state === 'removing'
                          ? 'bg-red-400 text-white border-red-400 scale-90 opacity-50'
                          : 'bg-white border-gray-300'
                  }`}
                >
                  {node.value}
                </div>
                
                {idx < list.length - 1 && (
                  <div className="w-8 h-1 bg-gray-400 mx-1">
                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-gray-400 transform translate-x-7"></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
