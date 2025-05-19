
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ArrayBar {
  value: number;
  state: 'default' | 'comparing' | 'sorted';
}

const SortingVisualizer = () => {
  const [array, setArray] = useState<ArrayBar[]>([]);
  const [arraySize, setArraySize] = useState<number>(20);
  const [algorithm, setAlgorithm] = useState<string>('bubble');
  const [speed, setSpeed] = useState<number>(50);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const sortingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationQueue = useRef<(() => void)[]>([]);
  
  // Initialize array
  useEffect(() => {
    resetArray();
  }, [arraySize]);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (sortingTimeoutRef.current) {
        clearTimeout(sortingTimeoutRef.current);
      }
    };
  }, []);
  
  const resetArray = () => {
    if (isSorting) return;
    const newArray: ArrayBar[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 100) + 5,
        state: 'default'
      });
    }
    setArray(newArray);
    setIsSorted(false);
  };
  
  const startSorting = () => {
    if (isSorting || isSorted) return;
    setIsSorting(true);
    animationQueue.current = [];
    
    // Clone array for sorting
    const arrayCopy = [...array];
    
    switch (algorithm) {
      case 'bubble':
        bubbleSort(arrayCopy);
        break;
      case 'insertion':
        insertionSort(arrayCopy);
        break;
      case 'merge':
        mergeSort(arrayCopy, 0, arrayCopy.length - 1);
        break;
      case 'quick':
        quickSort(arrayCopy, 0, arrayCopy.length - 1);
        break;
      default:
        bubbleSort(arrayCopy);
    }
    
    // Mark all as sorted at the end
    animationQueue.current.push(() => {
      setArray(prev => prev.map(bar => ({ ...bar, state: 'sorted' })));
      setIsSorting(false);
      setIsSorted(true);
    });
    
    // Start the animation queue processing
    processAnimationQueue();
  };
  
  const processAnimationQueue = () => {
    if (animationQueue.current.length === 0) return;
    
    const animation = animationQueue.current.shift();
    if (animation) {
      animation();
    }
    
    sortingTimeoutRef.current = setTimeout(() => {
      processAnimationQueue();
    }, 1000 - speed * 9);
  };
  
  // Bubble Sort Implementation
  const bubbleSort = (arr: ArrayBar[]) => {
    const n = arr.length;
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Compare and potentially swap
        animationQueue.current.push(() => {
          setArray(prev => {
            const updated = [...prev];
            updated[j].state = 'comparing';
            updated[j + 1].state = 'comparing';
            return updated;
          });
        });
        
        if (arr[j].value > arr[j + 1].value) {
          // Swap
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          
          animationQueue.current.push(() => {
            setArray(prev => {
              const updated = [...prev];
              const temp = updated[j];
              updated[j] = updated[j + 1];
              updated[j + 1] = temp;
              return updated;
            });
          });
        }
        
        // Reset comparison state
        animationQueue.current.push(() => {
          setArray(prev => {
            const updated = [...prev];
            updated[j].state = 'default';
            updated[j + 1].state = 'default';
            return updated;
          });
        });
      }
      
      // Mark the last element as sorted
      animationQueue.current.push(() => {
        setArray(prev => {
          const updated = [...prev];
          updated[n - i - 1].state = 'sorted';
          return updated;
        });
      });
    }
  };
  
  // Insertion Sort Implementation
  const insertionSort = (arr: ArrayBar[]) => {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
      const key = arr[i].value;
      let j = i - 1;
      
      // Highlight current element
      animationQueue.current.push(() => {
        setArray(prev => {
          const updated = [...prev];
          updated[i].state = 'comparing';
          return updated;
        });
      });
      
      while (j >= 0 && arr[j].value > key) {
        arr[j + 1].value = arr[j].value;
        
        // Show comparison
        animationQueue.current.push(() => {
          setArray(prev => {
            const updated = [...prev];
            updated[j].state = 'comparing';
            return updated;
          });
        });
        
        // Show shift
        animationQueue.current.push(() => {
          setArray(prev => {
            const updated = [...prev];
            updated[j + 1].value = updated[j].value;
            updated[j].state = 'default';
            return updated;
          });
        });
        
        j--;
      }
      
      arr[j + 1].value = key;
      
      // Insert key
      animationQueue.current.push(() => {
        setArray(prev => {
          const updated = [...prev];
          updated[j + 1].value = key;
          updated[i].state = 'default';
          for (let k = 0; k <= i; k++) {
            updated[k].state = 'sorted';
          }
          return updated;
        });
      });
    }
  };
  
  // Merge Sort Implementation (simplified for visualization)
  const mergeSort = (arr: ArrayBar[], left: number, right: number) => {
    if (left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    
    merge(arr, left, mid, right);
  };
  
  const merge = (arr: ArrayBar[], left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    // Create temp arrays
    const L: number[] = [];
    const R: number[] = [];
    
    // Copy data to temp arrays
    for (let i = 0; i < n1; i++) {
      L[i] = arr[left + i].value;
    }
    for (let j = 0; j < n2; j++) {
      R[j] = arr[mid + 1 + j].value;
    }
    
    // Highlight the subarrays
    animationQueue.current.push(() => {
      setArray(prev => {
        const updated = [...prev];
        for (let i = left; i <= right; i++) {
          updated[i].state = 'comparing';
        }
        return updated;
      });
    });
    
    // Merge the temp arrays
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        arr[k].value = L[i];
        i++;
      } else {
        arr[k].value = R[j];
        j++;
      }
      
      const currentK = k;
      animationQueue.current.push(() => {
        setArray(prev => {
          const updated = [...prev];
          updated[currentK].value = arr[currentK].value;
          return updated;
        });
      });
      
      k++;
    }
    
    // Copy remaining elements of L[]
    while (i < n1) {
      arr[k].value = L[i];
      
      const currentK = k;
      animationQueue.current.push(() => {
        setArray(prev => {
          const updated = [...prev];
          updated[currentK].value = arr[currentK].value;
          return updated;
        });
      });
      
      i++;
      k++;
    }
    
    // Copy remaining elements of R[]
    while (j < n2) {
      arr[k].value = R[j];
      
      const currentK = k;
      animationQueue.current.push(() => {
        setArray(prev => {
          const updated = [...prev];
          updated[currentK].value = arr[currentK].value;
          return updated;
        });
      });
      
      j++;
      k++;
    }
    
    // Mark the subarray as sorted
    animationQueue.current.push(() => {
      setArray(prev => {
        const updated = [...prev];
        for (let i = left; i <= right; i++) {
          updated[i].state = 'default';
        }
        return updated;
      });
    });
  };
  
  // Quick Sort Implementation
  const quickSort = (arr: ArrayBar[], low: number, high: number) => {
    if (low < high) {
      const pi = partition(arr, low, high);
      
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    }
  };
  
  const partition = (arr: ArrayBar[], low: number, high: number) => {
    const pivot = arr[high].value;
    let i = low - 1;
    
    // Highlight pivot
    animationQueue.current.push(() => {
      setArray(prev => {
        const updated = [...prev];
        updated[high].state = 'comparing';
        return updated;
      });
    });
    
    for (let j = low; j < high; j++) {
      // Comparing current element with pivot
      animationQueue.current.push(() => {
        setArray(prev => {
          const updated = [...prev];
          updated[j].state = 'comparing';
          return updated;
        });
      });
      
      if (arr[j].value < pivot) {
        i++;
        
        // Swap arr[i] and arr[j]
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        
        animationQueue.current.push(() => {
          setArray(prev => {
            const updated = [...prev];
            const temp = { ...updated[i] };
            updated[i] = { ...updated[j] };
            updated[j] = temp;
            return updated;
          });
        });
      }
      
      // Reset comparison
      animationQueue.current.push(() => {
        setArray(prev => {
          const updated = [...prev];
          updated[j].state = 'default';
          return updated;
        });
      });
    }
    
    // Swap arr[i+1] and arr[high] (pivot)
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    // Show pivot placement
    animationQueue.current.push(() => {
      setArray(prev => {
        const updated = [...prev];
        const temp = { ...updated[i + 1] };
        updated[i + 1] = { ...updated[high] };
        updated[high] = temp;
        updated[i + 1].state = 'sorted';
        updated[high].state = 'default';
        return updated;
      });
    });
    
    return i + 1;
  };
  
  return (
    <div className="visualizer-container">
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex-grow">
          <label htmlFor="sort-algorithm" className="block text-sm font-medium mb-1">
            Algorithm
          </label>
          <Select
            disabled={isSorting}
            value={algorithm}
            onValueChange={setAlgorithm}
          >
            <SelectTrigger id="sort-algorithm" className="w-full sm:w-40">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bubble">Bubble Sort</SelectItem>
              <SelectItem value="insertion">Insertion Sort</SelectItem>
              <SelectItem value="merge">Merge Sort</SelectItem>
              <SelectItem value="quick">Quick Sort</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-grow">
          <label htmlFor="array-size" className="block text-sm font-medium mb-1">
            Array Size: {arraySize}
          </label>
          <Slider
            id="array-size"
            disabled={isSorting}
            min={5}
            max={50}
            step={1}
            value={[arraySize]}
            onValueChange={([value]) => setArraySize(value)}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex-grow">
          <label htmlFor="sorting-speed" className="block text-sm font-medium mb-1">
            Speed: {speed}%
          </label>
          <Slider
            id="sorting-speed"
            min={10}
            max={100}
            step={10}
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex space-x-2 mt-4 sm:mt-6">
          <Button 
            onClick={startSorting} 
            disabled={isSorting || isSorted}
            className="bg-primary"
          >
            Start
          </Button>
          <Button 
            onClick={resetArray} 
            disabled={isSorting}
            variant="outline"
          >
            Reset
          </Button>
        </div>
      </div>
      
      <div className="flex items-end justify-center h-72 gap-1">
        {array.map((bar, idx) => (
          <div
            key={idx}
            className={`array-bar w-full ${
              bar.state === 'comparing' 
                ? 'bg-yellow-500' 
                : bar.state === 'sorted' 
                  ? 'bg-green-500' 
                  : 'bg-primary'
            }`}
            style={{
              height: `${bar.value}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;
