import ConnectButton from './ConnectButton';

const QuickBooksSetupPage = () => {
  const handleConnect = () => {
    // Handle QuickBooks connection
    console.log('Connecting to QuickBooks...');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-2">QuickBooks Setup</h1>
        <p className="text-gray-600">
          You can review and modify settings here for sending information from Towbook directly to QuickBooks.
        </p>
      </div>

      <div className="mt-4">
        <ConnectButton onClick={handleConnect} />
      </div>
    </div>
  );
};

export default QuickBooksSetupPage;