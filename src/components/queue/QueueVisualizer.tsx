
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface QueueElement {
  value: string;
  state: 'default' | 'highlight' | 'removing';
}

const QueueVisualizer = () => {
  const [queue, setQueue] = useState<QueueElement[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [speed, setSpeed] = useState<number>(50);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // Enqueue operation
  const handleEnqueue = () => {
    if (!inputValue || isAnimating) return;
    
    setIsAnimating(true);
    const newElement: QueueElement = { value: inputValue, state: 'highlight' };
    
    setQueue(prev => [...prev, newElement]);
    setInputValue('');
    setMessage(`Enqueued "${inputValue}" to the queue`);
    
    // After animation, change state back to default
    setTimeout(() => {
      setQueue(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1].state = 'default';
        }
        return updated;
      });
      setIsAnimating(false);
    }, 1000 - speed * 8);
  };
  
  // Dequeue operation
  const handleDequeue = () => {
    if (queue.length === 0 || isAnimating) {
      setMessage('Queue is empty!');
      return;
    }
    
    setIsAnimating(true);
    
    // Highlight element being dequeued
    setQueue(prev => {
      const updated = [...prev];
      updated[0].state = 'removing';
      return updated;
    });
    
    const dequeuedValue = queue[0].value;
    
    // After animation, remove the element
    setTimeout(() => {
      setQueue(prev => prev.slice(1));
      setMessage(`Dequeued "${dequeuedValue}" from the queue`);
      setIsAnimating(false);
    }, 1000 - speed * 8);
  };
  
  // Peek at front element
  const handlePeek = () => {
    if (queue.length === 0) {
      setMessage('Queue is empty!');
      return;
    }
    
    // Highlight front element
    setQueue(prev => {
      const updated = [...prev];
      updated[0].state = 'highlight';
      return updated;
    });
    
    setMessage(`Front element: "${queue[0].value}"`);
    
    // Reset highlight after animation
    setTimeout(() => {
      setQueue(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[0].state = 'default';
        }
        return updated;
      });
    }, 1000 - speed * 8);
  };
  
  // Clear the queue
  const handleClear = () => {
    if (isAnimating) return;
    setQueue([]);
    setMessage('Queue cleared');
  };
  
  return (
    <div className="visualizer-container">
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex-grow">
          <label htmlFor="queue-input" className="block text-sm font-medium mb-1">
            Value to Enqueue
          </label>
          <Input
            id="queue-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter any value"
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="queue-speed" className="block text-sm font-medium mb-1">
            Animation Speed: {speed}%
          </label>
          <Slider
            id="queue-speed"
            min={10}
            max={100}
            step={10}
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleEnqueue} disabled={!inputValue || isAnimating}>
            Enqueue
          </Button>
          <Button onClick={handleDequeue} disabled={queue.length === 0 || isAnimating} variant="outline">
            Dequeue
          </Button>
          <Button onClick={handlePeek} disabled={queue.length === 0} variant="outline">
            Peek
          </Button>
          <Button onClick={handleClear} disabled={queue.length === 0 || isAnimating} variant="outline">
            Clear
          </Button>
        </div>
      </div>
      
      {message && (
        <div className="p-2 mb-4 rounded bg-blue-100 text-blue-800 text-center">
          {message}
        </div>
      )}
      
      <div className="flex justify-center my-10">
        <div className="relative w-full max-w-2xl border-2 border-gray-300 rounded-lg">
          <div className="absolute -top-8 left-0 text-gray-500 font-medium">
            Front
          </div>
          <div className="absolute -top-8 right-0 text-gray-500 font-medium">
            Rear
          </div>
          
          <div className="flex overflow-x-auto py-4">
            {queue.length === 0 ? (
              <div className="w-full p-4 text-gray-400 italic text-center">
                Empty Queue
              </div>
            ) : (
              queue.map((el, idx) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 w-24 h-24 m-2 flex items-center justify-center border border-gray-300 rounded transition-all ${
                    el.state === 'highlight'
                      ? 'bg-secondary text-white scale-110'
                      : el.state === 'removing'
                        ? 'bg-red-400 text-white scale-90 opacity-50'
                        : 'bg-white'
                  }`}
                >
                  {el.value}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueVisualizer;
