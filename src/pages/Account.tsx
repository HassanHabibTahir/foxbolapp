import React, { useState } from 'react';
import { ModifyAccount } from '../components/account/ModifyAccount';
import { PricingView } from '../components/pricing/PricingView';
import { RulesView } from '../components/rules/RulesView';
import { ImpoundsView } from '../components/impounds/ImpoundsView';
import { TagsView } from '../components/tags/TagsView';
import { UsersView } from '../components/users/UsersView';
import { NotesView } from '../components/notes/NotesView';
import { StatementsView } from '../components/statements/StatementsView';
import { InvoicesView } from '../components/invoices/InvoicesView';
import { Sidebar } from '../components/account/Sidebar';


function App() {
  const [currentView, setCurrentView] = useState('account');

  const renderView = () => {
    switch (currentView) {
      case 'account':
        return <ModifyAccount />;
      case 'pricing':
        return <PricingView />;
      case 'rules':
        return <RulesView />;
      case 'impounds':
        return <ImpoundsView />;
      case 'tags':
        return <TagsView />;
      case 'users':
        return <UsersView />;
      case 'notes':
        return <NotesView />;
      case 'statements':
        return <StatementsView />;
      case 'invoices':
        return <InvoicesView />;
      default:
        return <ModifyAccount />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          <div className="flex-1 bg-white shadow-sm rounded-lg p-6">
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;