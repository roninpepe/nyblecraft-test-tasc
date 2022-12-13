import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Header from 'components/Header';
import styles from 'styles/components/App.module.scss';

const PageLayout: FC = () => (
	<>
		<Header />
		<main className={styles.content}>
			<Outlet />
		</main>
	</>
);

export default PageLayout;
