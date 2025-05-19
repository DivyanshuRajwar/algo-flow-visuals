
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface StackElement {
  value: string;
  state: 'default' | 'highlight' | 'removing';
}

const StackVisualizer = () => {
  const [stack, setStack] = useState<StackElement[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [speed, setSpeed] = useState<number>(50);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // Push to stack
  const handlePush = () => {
    if (!inputValue || isAnimating) return;
    
    setIsAnimating(true);
    const newElement: StackElement = { value: inputValue, state: 'highlight' };
    
    setStack(prev => [...prev, newElement]);
    setInputValue('');
    setMessage(`Pushed "${inputValue}" to the stack`);
    
    // After animation, change state back to default
    setTimeout(() => {
      setStack(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1].state = 'default';
        }
        return updated;
      });
      setIsAnimating(false);
    }, 1000 - speed * 8);
  };
  
  // Pop from stack
  const handlePop = () => {
    if (stack.length === 0 || isAnimating) {
      setMessage('Stack is empty!');
      return;
    }
    
    setIsAnimating(true);
    
    // Highlight element being popped
    setStack(prev => {
      const updated = [...prev];
      updated[updated.length - 1].state = 'removing';
      return updated;
    });
    
    const poppedValue = stack[stack.length - 1].value;
    
    // After animation, remove the element
    setTimeout(() => {
      setStack(prev => prev.slice(0, prev.length - 1));
      setMessage(`Popped "${poppedValue}" from the stack`);
      setIsAnimating(false);
    }, 1000 - speed * 8);
  };
  
  // Peek at top element
  const handlePeek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }
    
    // Highlight top element
    setStack(prev => {
      const updated = [...prev];
      updated[updated.length - 1].state = 'highlight';
      return updated;
    });
    
    setMessage(`Top element: "${stack[stack.length - 1].value}"`);
    
    // Reset highlight after animation
    setTimeout(() => {
      setStack(prev => {
        const updated = [...prev];
        updated[updated.length - 1].state = 'default';
        return updated;
      });
    }, 1000 - speed * 8);
  };
  
  // Clear the stack
  const handleClear = () => {
    if (isAnimating) return;
    setStack([]);
    setMessage('Stack cleared');
  };
  
  return (
    <div className="visualizer-container">
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex-grow">
          <label htmlFor="stack-input" className="block text-sm font-medium mb-1">
            Value to Push
          </label>
          <Input
            id="stack-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter any value"
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="stack-speed" className="block text-sm font-medium mb-1">
            Animation Speed: {speed}%
          </label>
          <Slider
            id="stack-speed"
            min={10}
            max={100}
            step={10}
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handlePush} disabled={!inputValue || isAnimating}>
            Push
          </Button>
          <Button onClick={handlePop} disabled={stack.length === 0 || isAnimating} variant="outline">
            Pop
          </Button>
          <Button onClick={handlePeek} disabled={stack.length === 0} variant="outline">
            Peek
          </Button>
          <Button onClick={handleClear} disabled={stack.length === 0 || isAnimating} variant="outline">
            Clear
          </Button>
        </div>
      </div>
      
      {message && (
        <div className="p-2 mb-4 rounded bg-blue-100 text-blue-800 text-center">
          {message}
        </div>
      )}
      
      <div className="flex justify-center mt-10">
        <div className="relative w-64 border-2 border-gray-300 rounded-lg">
          <div className="absolute -top-8 left-0 right-0 text-center text-gray-500 font-medium">
            Top of Stack
          </div>
          
          <div className="flex flex-col-reverse">
            {stack.map((el, idx) => (
              <div
                key={idx}
                className={`p-4 border-b border-gray-300 last:border-b-0 transition-all ${
                  el.state === 'highlight'
                    ? 'bg-secondary text-white scale-105'
                    : el.state === 'removing'
                      ? 'bg-red-400 text-white scale-90 opacity-50'
                      : 'bg-white'
                }`}
              >
                {el.value}
              </div>
            ))}
            
            {stack.length === 0 && (
              <div className="p-4 text-gray-400 italic">
                Empty Stack
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackVisualizer;
