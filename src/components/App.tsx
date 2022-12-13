import { FC, StrictMode } from 'react';
import AppContextProvider from 'components/App/Context';
import AppRouter from 'components/App/Router';
import styles from 'styles/components/App.module.scss';

const App: FC = () => {
	return (
		<StrictMode>
			<AppContextProvider>
				<div className={styles._}>
					<AppRouter />
				</div>
			</AppContextProvider>
		</StrictMode>
	);
};

export default App;
