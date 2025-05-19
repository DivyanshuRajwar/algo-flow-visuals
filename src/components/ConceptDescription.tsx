
import { ReactNode } from 'react';

interface ConceptDescriptionProps {
  title: string;
  description: ReactNode;
}

const ConceptDescription = ({ title, description }: ConceptDescriptionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="prose max-w-none">
        {description}
      </div>
    </div>
  );
};

export default ConceptDescription;
