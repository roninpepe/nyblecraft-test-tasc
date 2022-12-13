import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageLayout from 'views/PageLayout.view';
import Home from 'views/Home.view';

const AppRouter: FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<PageLayout />}>
					<Route index element={<Home />} />
					<Route path="*" element={<Home />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
