
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'sorting', label: '🔢 Sorting' },
  { id: 'searching', label: '🔍 Searching' },
  { id: 'stack', label: '🧱 Stack' },
  { id: 'queue', label: '📬 Queue' },
  { id: 'linkedlist', label: '🔗 Linked List' },
  { id: 'binarytree', label: '🌳 Binary Tree' },
  { id: 'avltree', label: '🌲 AVL Tree' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Handle navbar background change on scroll
      setIsScrolled(window.scrollY > 10);
      
      // Active section highlighting
      const sections = navItems.map(item => item.id);
      
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-primary font-bold text-xl">DSA Visualizer</div>
          <div className="hidden md:flex overflow-x-auto space-x-2 py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "px-3 py-1 text-sm rounded-md whitespace-nowrap transition-colors",
                  activeSection === item.id
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
