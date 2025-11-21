import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <img 
            src={logo} 
            alt="Возьми с собой" 
            className="h-12 w-auto"
          />
        </div>
      </div>
    </header>
  );
};
