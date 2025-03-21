import { useState } from 'react';
import { Copy } from 'lucide-react';

const OverviewPage = () => {
  const referralLink = 'towbook.com/signup/TB5344X2';
  const [copy, setCopy] = useState<boolean>(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(referralLink);
    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-semibold mb-2">Towbook Settings & Management</h1>
      <p className="text-gray-600 mb-8">
        To adjust various settings for your company, utilize the different settings tabs on the left!
      </p>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Items needing your attention</h2>
        <p className="text-gray-600 mb-2">
          Towbook automatically alerts you when we detect items that might need your attention.
        </p>
        <p className="text-gray-700">Currently, there are no items requiring your attention.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Incoming Email Address:</h2>
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium">Certified Towing</span>
          <span className="text-blue-600">ct141033@towbook.net</span>
          <span className="text-gray-500">→</span>
          <span className="font-medium">Forwarded To</span>
          <span className="text-blue-600">certifiedtowing4@gmail.com</span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Refer Friends, Get Rewarded:</h2>
        <div className="mb-4">
          <p className="text-gray-600 mb-2">Share your referral link</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 p-2 border rounded-md bg-gray-50"
            />
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              { copy ? "Copied": "Copy" }
            </button>
          </div>
        </div>
        <p className="text-gray-600">
          Refer a friend and you'll get a free month on Towbook for every company you send our way when they sign up for a Towbook subscription!
        </p>
      </div>
    </div>
  );
};

export default OverviewPage;
