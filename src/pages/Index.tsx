
import Navbar from "@/components/Navbar";
import ConceptDescription from "@/components/ConceptDescription";
import SortingVisualizer from "@/components/sorting/SortingVisualizer";
import SearchingVisualizer from "@/components/searching/SearchingVisualizer";
import StackVisualizer from "@/components/stack/StackVisualizer";
import QueueVisualizer from "@/components/queue/QueueVisualizer";
import LinkedListVisualizer from "@/components/linkedlist/LinkedListVisualizer";
import BinaryTreeVisualizer from "@/components/trees/BinaryTreeVisualizer";
import AVLTreeVisualizer from "@/components/trees/AVLTreeVisualizer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            DSA Concept Visualizer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interactive visualizations to help you understand common data structures and algorithms.
            See how they work step-by-step, manipulate the data, and watch the magic happen!
          </p>
        </div>
      </div>
      
      {/* Sorting Section */}
      <section id="sorting" className="section-container">
        <ConceptDescription 
          title="🔢 Sorting Algorithms"
          description={
            <>
              <p>
                Sorting algorithms organize data elements in a specific order—typically numerical or lexicographical. 
                They're fundamental in computer science because many operations become more efficient 
                when working with sorted data.
              </p>
              <p className="mt-2">
                From the simple but inefficient Bubble Sort (which repeatedly compares adjacent elements) 
                to the divide-and-conquer approach of Merge Sort (with its guaranteed O(n log n) performance), 
                each algorithm has unique trade-offs in terms of speed, memory usage, and implementation complexity.
              </p>
              <p className="mt-2">
                In real life, sorting algorithms power everything from database queries and spreadsheet operations
                to search engine results and file organization.
              </p>
            </>
          }
        />
        <SortingVisualizer />
      </section>
      
      {/* Searching Section */}
      <section id="searching" className="section-container">
        <ConceptDescription 
          title="🔍 Searching Algorithms"
          description={
            <>
              <p>
                Searching algorithms help us find specific values within a collection of data. 
                The approach you choose depends largely on whether your data is sorted or unsorted.
              </p>
              <p className="mt-2">
                Linear Search checks each element one-by-one—simple but slow for large datasets with O(n) complexity. 
                Binary Search, on the other hand, requires sorted data but delivers impressive O(log n) performance by 
                repeatedly dividing the search space in half.
              </p>
              <p className="mt-2">
                We use these algorithms constantly in everyday computing—from finding a contact in your phone 
                to searching a document for a specific word or locating a product in an online store.
              </p>
            </>
          }
        />
        <SearchingVisualizer />
      </section>
      
      {/* Stack Section */}
      <section id="stack" className="section-container">
        <ConceptDescription 
          title="🧱 Stack"
          description={
            <>
              <p>
                A stack is a linear data structure following the Last-In-First-Out (LIFO) principle—like a stack of plates 
                where you can only add or remove from the top.
              </p>
              <p className="mt-2">
                The key operations are <em>push</em> (adding an item to the top) and <em>pop</em> (removing the top item). 
                You can also <em>peek</em> to view the top element without removing it.
              </p>
              <p className="mt-2">
                Stacks are surprisingly versatile. They're essential for function call management (the call stack), 
                undo functionality in applications, syntax parsing in compilers, and even for backtracking algorithms 
                like maze solving or depth-first search.
              </p>
            </>
          }
        />
        <StackVisualizer />
      </section>
      
      {/* Queue Section */}
      <section id="queue" className="section-container">
        <ConceptDescription 
          title="📬 Queue"
          description={
            <>
              <p>
                A queue operates on the First-In-First-Out (FIFO) principle—similar to people waiting in line, 
                where the first person to arrive is the first to be served.
              </p>
              <p className="mt-2">
                The primary operations are <em>enqueue</em> (adding an element to the back) and <em>dequeue</em> 
                (removing an element from the front). You can also check the front element without removing it.
              </p>
              <p className="mt-2">
                Queues are ideal for any scenario involving waiting or processing in order: printer spooling, 
                task scheduling in operating systems, handling requests in web servers, and breadth-first search 
                in graph algorithms. They ensure fair processing and maintain the original sequence of items.
              </p>
            </>
          }
        />
        <QueueVisualizer />
      </section>
      
      {/* Linked List Section */}
      <section id="linkedlist" className="section-container">
        <ConceptDescription 
          title="🔗 Linked List"
          description={
            <>
              <p>
                A linked list is a sequence of elements where each element (node) contains both data and a reference 
                (or "link") to the next element in the sequence.
              </p>
              <p className="mt-2">
                Unlike arrays, linked lists don't need contiguous memory, making insertions and deletions more efficient 
                (O(1) time if you have the position). However, access is slower (O(n) in the worst case) since you can't 
                directly index into a linked list.
              </p>
              <p className="mt-2">
                Linked lists come in several variations: singly-linked (each node points to the next), doubly-linked 
                (each node points to both next and previous), and circular (the last node points back to the first).
              </p>
              <p className="mt-2">
                They're used in implementations of stacks, queues, hash tables, and for memory management in systems 
                programming where you need flexibility in allocating and freeing memory.
              </p>
            </>
          }
        />
        <LinkedListVisualizer />
      </section>
      
      {/* Binary Tree Section */}
      <section id="binarytree" className="section-container">
        <ConceptDescription 
          title="🌳 Binary Tree"
          description={
            <>
              <p>
                A binary tree is a hierarchical data structure where each node has at most two children, 
                typically referred to as "left" and "right" children.
              </p>
              <p className="mt-2">
                The binary search tree (BST) variant follows a specific ordering property: for any node, 
                all elements in its left subtree are less than the node, and all elements in its right subtree 
                are greater. This enables efficient searching, insertion, and deletion operations (O(log n) on average).
              </p>
              <p className="mt-2">
                Tree traversals let us visit all nodes in specific orders:
              </p>
              <ul className="list-disc pl-5 mt-1">
                <li>In-order: Left subtree, current node, right subtree (yields sorted order in a BST)</li>
                <li>Pre-order: Current node, left subtree, right subtree</li>
                <li>Post-order: Left subtree, right subtree, current node</li>
              </ul>
              <p className="mt-2">
                Binary trees are used in everything from expression parsing and decision trees to implementing 
                efficient searching and organizing hierarchical data.
              </p>
            </>
          }
        />
        <BinaryTreeVisualizer />
      </section>
      
      {/* AVL Tree Section */}
      <section id="avltree" className="section-container">
        <ConceptDescription 
          title="🌲 AVL Tree"
          description={
            <>
              <p>
                An AVL tree is a self-balancing binary search tree that maintains a height difference of at most 1 
                between the left and right subtrees of any node—preventing the tree from becoming skewed and inefficient.
              </p>
              <p className="mt-2">
                When an insertion or deletion would break this balance property, the tree automatically performs 
                rotations to rebalance itself. There are four rotation cases:
              </p>
              <ul className="list-disc pl-5 mt-1">
                <li>Left-Left (LL): Requires a single right rotation</li>
                <li>Right-Right (RR): Requires a single left rotation</li>
                <li>Left-Right (LR): Requires a left rotation followed by a right rotation</li>
                <li>Right-Left (RL): Requires a right rotation followed by a left rotation</li>
              </ul>
              <p className="mt-2">
                This self-balancing guarantees O(log n) time complexity for all operations (search, insert, delete), 
                even in worst-case scenarios. This reliability makes AVL trees ideal for applications where consistent 
                performance is critical, such as database indexing and real-time systems.
              </p>
            </>
          }
        />
        <AVLTreeVisualizer />
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center text-gray-600 mt-12">
        <p>DSA Concept Visualizer — An interactive tool for learning data structures and algorithms</p>
        <p className="mt-2 text-sm">Built with React + Vite</p>
      </footer>
    </div>
  );
};

export default Index;
