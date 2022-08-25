import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	Menu,
	MenuItem,
	Button,
} from '@mui/material';
import { sortBy } from 'lodash';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';

import React, { useEffect, useState } from 'react';

const desired_data_fields = [
	'dividendYield',
	'fiveYearAvgDividendYield',
	'forwardPE',
	'trailingPE',
	'grossMargins',
	'pegRatio',
	'fiftyTwoWeekLow',
	'fiftyTwoWeekHigh',
	'52WeekChange',
];

const getColumnName = (field) => {
	switch (field) {
		case 'dividendYield':
			return 'Dividend Yield';
		case 'fiveYearAvgDividendYield':
			return '5 Year Avg. Dividend Yield';
		case 'forwardPE':
			return 'Forward P/E';
		case 'trailingPE':
			return 'Trailing P/E';
		case 'grossMargins':
			return 'Gross Margins';
		case 'pegRatio':
			return 'PEG Ratio';
		case 'fiftyTwoWeekLow':
			return '52 Week Low';
		case 'fiftyTwoWeekHigh':
			return '52 Week High';
		case '52WeekChange':
			return '52 Week Change';
		default:
			return '';
	}
};

const getFieldName = (field) => {
	switch (field) {
		case 'Dividend Yield':
			return 'dividendYield';
		case '5 Year Avg. Dividend Yield':
			return 'fiveYearAverageDividendYield';
		case 'Forward P/E':
			return 'forwardPE';
		case 'Trailing P/E':
			return 'trailingPE';
		case 'Gross Margins':
			return 'grossMargins';
		case 'PEG Ratio':
			return 'pegRatio';
		case '52 Week Low':
			return 'fiftyTwoWeekLow';
		case '52 Week High':
			return 'fiftyTwoWeekHigh';
		case '52 Week Change':
			return '52WeekChange';
		default:
			return '';

	}
};

export const App = () => {
	const [data, setData] = useState(null);
	const [sortByLabel, setSortByLabel] = useState(null);
	const [sortedData, setSortedData] = useState(null);

	useEffect(() => {
		if (data && sortByLabel != null) {
			const fieldName = getFieldName(sortByLabel);
			sortData(data, fieldName);
		}
	}, [sortByLabel]);

	const sortData = (data, column) => {
		const newData = sortBy(data, (d) => [d[1][column]]);

		setSortedData(newData);
	};

	const getData = () => {
		fetch('/data')
			.then((newData) => newData.json())
			.then((d) => {
				console.log(d.data);
				setData(d.data);
			});
	};
	useEffect(() => {
		getData();
	}, []);
	console.log('bruh')

	return (
		<Box
			style={{
				width: '100vw',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justify: 'center',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: '5vh',
					fontSize: 20,
					fontWeight: 'semibold',
				}}
			>
				S&P 500 Index Data
			</div>
			<Box
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					marginTop: '10vh',
					height: '80vh',
				}}
			>
				{data && (
					<>
						<Box
							style={{
								display: 'flex',
								width: '100%',
								flexDirection: 'row',
								flex: 1,
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<SortMenu
								sortByLabel={sortByLabel}
								setSortByLabel={setSortByLabel}
							/>
							{sortByLabel && (
								<Box
									marginLeft={10}
									fontWeight={'bold'}
									fontSize={20}
									width={'18vw'}
									color="purple"
                  
									display="flex"
									flexDirection={'row'}
									alignItems="center"
									justifyContent="space-between"
								>
									<Box color="black">Sorted by </Box>
									{sortByLabel}
								</Box>
							)}
						</Box>

						<DataTable
							sortByLabel={sortByLabel}
							data={sortByLabel && sortedData ? sortedData : data}
						/>
					</>
				)}
			</Box>
		</Box>
	);
};

const SortMenu = ({ sortByLabel, setSortByLabel }) => {
	return (
		<PopupState variant="popover" popupId="demo-popup-menu">
			{(popupState) => (
				<React.Fragment>
					<Button
						variant="contained"
						style={{ background: 'purple', color: 'white' }}
						{...bindTrigger(popupState)}
					>
						Sort By
					</Button>
					<Menu {...bindMenu(popupState)}>
						{desired_data_fields.map((c) => {
							const cName = getColumnName(c);

							return (
								<MenuItem
									style={{ borderBottom: 'solid', width: '100%', height: 50 }}
									onClick={(e) => {
										setSortByLabel(e.target.innerText);
										popupState.close();
									}}
								>
									{cName}
								</MenuItem>
							);
						})}
					</Menu>
				</React.Fragment>
			)}
		</PopupState>
	);
};

const DataTable = ({ sortByLabel, data }) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const sym = ['Symbol'];
	const clms = Object.keys(data[2][1]).filter((c) => {
		return desired_data_fields.includes(c);
	});

	const columns = sym.concat(clms);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const renderRows = () => {
		return data
			.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
			.map((row) => {
				return (
					<TableRow>
						<TableCell
							style={{
								fontWeight: 'bold'
							}}
						>
							{row[1]['shortName']}
						</TableCell>
						{clms.map((c, idx) => {
              const cName = getColumnName(c)
							return (
								<TableCell
									style={{
                    background: sortByLabel === cName ? "yellow" : 'white',
										padding: 'none',
										background: 'white',
										height: '2rem',
									}}
									key={idx}
								>
									{row[1][c]}
								</TableCell>
							);
						})}
					</TableRow>
				);
			});
	};

	const renderHeader = () => {
		return columns.map((c, idx) => {
			console.log(c);
			var cName;
			if (idx > 0) {
				cName = getColumnName(c);
			} else {
				cName = c;
			}

			return (
				<TableCell
					styles={{ background: cName === sortByLabel ? 'red' : 'black' }}
					key={idx}
				>
					{cName}
				</TableCell>
			);
		});
	};
	return (
		<TableContainer
			style={{
				width: '80vw',
				height: '70vh',
				border: 'solid',
				borderRadius: 15,
				padding: '10 0 10 10',
				borderColor: 'gray',
				flex: 8,
			}}
		>
			<Table stickyHeader>
				<TableHead>
					<TableRow>{renderHeader()}</TableRow>
				</TableHead>

				<TableBody>{renderRows()}</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, 50, 100]}
							component="div"
							count={data.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
};
