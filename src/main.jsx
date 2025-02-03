import { createRoot } from 'react-dom/client';
// router
import MainRouter from './routers/MainRouter.jsx';
//redux & persistor
import { store, persistor } from './redux/stores.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <MainRouter />
        </PersistGate>
    </Provider>
);
