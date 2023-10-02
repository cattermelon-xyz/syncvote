import React, { useState, useEffect } from 'react';
import Spinner from './components/Spinner';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import {
  Header,
  SearchFilter,
  CardSection,
  Charts,
  TabTable,
} from './components';
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard, { FilterType } from './components/Dashboard';
import WorkspaceDetail from './components/WorkspaceDetail';

const AppLayout: React.FC = () => {
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('7 days');

  useEffect(() => {
    if (dashboardLoading && chartLoading) {
      setIsLoading(false);
    }
  }, [dashboardLoading, chartLoading]);
  return (
    <div className='flex flex-col relative min-h-screen'>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className='absolute z-[0] w-[50%] h-[50%] -right-[50%] -top-[40%] rounded-full blue__gradient'></div>
          <Header />
          <Dashboard
            setLoading={(loading) => setDashboardLoading(loading)}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
          <Charts
            setLoading={(loading) => setChartLoading(loading)}
            selectedFilter={selectedFilter}
          />
          <TabTable />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className='bg-black flex-center grid grid-cols-12 gap-4 h-full overflow-hidden'>
          <div className='col-start-2 lg:col-start-3 col-span-10 lg:col-span-8 max-w-screen-x1 mt-20'>
            <Routes>
              <Route path='/' element={<AppLayout />}>
                <Route index element={<TabTable />} />
              </Route>
              <Route
                path='/workspace/:workspaceName'
                element={<WorkspaceDetail />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
