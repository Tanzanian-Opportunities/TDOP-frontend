import React from 'react';

interface TabsProps {
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className = '', children }) => {
  return <div className={className}>{children}</div>;
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, value, className = '' }) => {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    setActive(true);
  }, [value]);

  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'text-tdop-primary border-b-2 border-tdop-primary'
          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
      } ${className}`}
      onClick={() => setActive(true)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ children, value, className = '' }) => {
  return <div className={className}>{children}</div>;
};
