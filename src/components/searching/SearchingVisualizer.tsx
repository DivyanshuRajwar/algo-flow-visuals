
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface ArrayElement {
  value: number;
  state: 'default' | 'checking' | 'found' | 'not-found';
}

const SearchingVisualizer = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [arraySize, setArraySize] = useState<number>(15);
  const [algorithm, setAlgorithm] = useState<string>('linear');
  const [target, setTarget] = useState<string>('');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize or reset the array
  const resetArray = () => {
    if (isSearching) return;
    
    const newArray: ArrayElement[] = [];
    const values = [];
    
    for (let i = 0; i < arraySize; i++) {
      values.push(Math.floor(Math.random() * 100));
    }
    
    // Sort array if binary search is selected
    if (algorithm === 'binary') {
      values.sort((a, b) => a - b);
    }
    
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: values[i],
        state: 'default'
      });
    }
    
    setArray(newArray);
    setResultMessage('');
  };
  
  // Clean up timeouts when component unmounts
  useState(() => {
    resetArray();
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  });
  
  // Start search based on selected algorithm
  const startSearch = () => {
    if (isSearching || !target) return;
    
    setIsSearching(true);
    setResultMessage('');
    
    // Reset all elements to default state
    setArray(prev => prev.map(el => ({ ...el, state: 'default' })));
    
    const targetValue = parseInt(target);
    
    if (isNaN(targetValue)) {
      setResultMessage('Please enter a valid number');
      setIsSearching(false);
      return;
    }
    
    if (algorithm === 'linear') {
      linearSearch(targetValue);
    } else {
      binarySearch(targetValue);
    }
  };
  
  // Linear Search Implementation
  const linearSearch = (target: number) => {
    let stepIndex = 0;
    
    const searchStep = () => {
      if (stepIndex >= array.length) {
        setResultMessage(`Element ${target} not found in the array`);
        setIsSearching(false);
        return;
      }
      
      // Mark current element as checking
      setArray(prev => {
        const updated = [...prev];
        updated[stepIndex].state = 'checking';
        return updated;
      });
      
      // Check if current element is the target
      if (array[stepIndex].value === target) {
        searchTimeoutRef.current = setTimeout(() => {
          setArray(prev => {
            const updated = [...prev];
            updated[stepIndex].state = 'found';
            return updated;
          });
          setResultMessage(`Element ${target} found at index ${stepIndex}`);
          setIsSearching(false);
        }, 1000 - speed * 9);
        return;
      }
      
      // If not the target, move to next element
      searchTimeoutRef.current = setTimeout(() => {
        setArray(prev => {
          const updated = [...prev];
          updated[stepIndex].state = 'not-found';
          return updated;
        });
        
        stepIndex++;
        searchStep();
      }, 1000 - speed * 9);
    };
    
    searchStep();
  };
  
  // Binary Search Implementation
  const binarySearch = (target: number) => {
    let left = 0;
    let right = array.length - 1;
    
    const searchStep = () => {
      if (left > right) {
        setResultMessage(`Element ${target} not found in the array`);
        setIsSearching(false);
        return;
      }
      
      const mid = Math.floor((left + right) / 2);
      
      // Mark current search range
      setArray(prev => {
        const updated = [...prev];
        for (let i = left; i <= right; i++) {
          if (i === mid) {
            updated[i].state = 'checking';
          } else {
            updated[i].state = 'default';
          }
        }
        return updated;
      });
      
      // Check if middle element is the target
      if (array[mid].value === target) {
        searchTimeoutRef.current = setTimeout(() => {
          setArray(prev => {
            const updated = [...prev];
            updated[mid].state = 'found';
            return updated;
          });
          setResultMessage(`Element ${target} found at index ${mid}`);
          setIsSearching(false);
        }, 1000 - speed * 9);
        return;
      }
      
      // Decide which half to search next
      searchTimeoutRef.current = setTimeout(() => {
        setArray(prev => {
          const updated = [...prev];
          updated[mid].state = 'not-found';
          return updated;
        });
        
        if (array[mid].value < target) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
        
        searchStep();
      }, 1000 - speed * 9);
    };
    
    searchStep();
  };
  
  // Handle algorithm change
  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value);
    // Sort array if binary search is selected
    if (value === 'binary' && !isSearching) {
      setArray(prev => {
        const sorted = [...prev].sort((a, b) => a.value - b.value);
        return sorted.map(el => ({ ...el, state: 'default' }));
      });
    }
  };
  
  return (
    <div className="visualizer-container">
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex-grow">
          <label htmlFor="search-algorithm" className="block text-sm font-medium mb-1">
            Algorithm
          </label>
          <Select
            disabled={isSearching}
            value={algorithm}
            onValueChange={handleAlgorithmChange}
          >
            <SelectTrigger id="search-algorithm" className="w-full sm:w-40">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear Search</SelectItem>
              <SelectItem value="binary">Binary Search</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-grow">
          <label htmlFor="array-size" className="block text-sm font-medium mb-1">
            Array Size: {arraySize}
          </label>
          <Slider
            id="array-size"
            disabled={isSearching}
            min={5}
            max={30}
            step={1}
            value={[arraySize]}
            onValueChange={([value]) => setArraySize(value)}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="search-speed" className="block text-sm font-medium mb-1">
            Speed: {speed}%
          </label>
          <Slider
            id="search-speed"
            min={10}
            max={100}
            step={10}
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="search-target" className="block text-sm font-medium mb-1">
            Search Target
          </label>
          <Input
            id="search-target"
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter a number"
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex space-x-2 mt-4 sm:mt-6">
          <Button 
            onClick={startSearch} 
            disabled={isSearching || !target}
            className="bg-primary"
          >
            Search
          </Button>
          <Button 
            onClick={resetArray} 
            disabled={isSearching}
            variant="outline"
          >
            Reset Array
          </Button>
        </div>
      </div>
      
      {resultMessage && (
        <div className={`p-2 mb-4 rounded text-center ${
          resultMessage.includes('found at') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {resultMessage}
        </div>
      )}
      
      <div className="flex justify-center items-center gap-3 flex-wrap mt-6">
        {array.map((el, idx) => (
          <div
            key={idx}
            className={`w-12 h-12 flex items-center justify-center rounded-md transition-all ${
              el.state === 'checking' 
                ? 'bg-yellow-500 transform scale-110' 
                : el.state === 'found' 
                  ? 'bg-green-500' 
                  : el.state === 'not-found' 
                    ? 'bg-gray-300' 
                    : 'bg-primary'
            } text-white font-medium`}
          >
            {el.value}
          </div>
        ))}
      </div>
      
      {algorithm === 'binary' && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Note: Array is sorted for binary search
        </div>
      )}
    </div>
  );
};

export default SearchingVisualizer;
