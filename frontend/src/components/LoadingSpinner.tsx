export const LoadingSpinner = () => {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500"></div>
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          </div>
          <div className="text-blue-600 font-semibold">Calculating fees...</div>
        </div>
      </div>
    );
  };