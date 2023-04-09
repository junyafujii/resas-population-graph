import React, { useState } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

interface Props {
  demographics: {
    prefName: string;
    data: {
      year: number;
      totalPopulation: number;
      totalIncrease: number;
      youngPopulation: number;
      youngRatio: number;
      productivePopulation: number;
      productiveRatio: number;
      elderlyPopulation: number;
      elderlyRatio: number;
    }[];
  }[];
}

const Styles: { [key: string]: React.CSSProperties } = {
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    maxWidth: '800px',
    margin: 'auto',
    marginBottom: '20px'
  },
  thead: {
    backgroundColor: '#2f2f2f',
    color: '#fff',
    fontWeight: 'bold'
  },
  th: {
    padding: '10px',
    fontSize: '1.2rem',
    textAlign: 'center',
    borderBottom: '1px solid #ccc'
  },
  td: {
    padding: '10px',
    fontSize: '1.1rem',
    textAlign: 'center',
    borderBottom: '1px solid #ccc'
  }
};

const Table: React.FC<Props> = ({ demographics }) => {
  const [sortedColumn, setSortedColumn] = useState('');
  const [isAscending, setIsAscending] = useState(false);

  const toggleSort = (column: string) => {
    if (sortedColumn === column) {
      setIsAscending(!isAscending);
    } else {
      setSortedColumn(column);
      setIsAscending(true);
    }
  };

  const sortedData = demographics.map(({ prefName, data }) => {
    const sorted = [...data].sort((a: { [key: string]: number }, b: { [key: string]: number }) => {
      if (isAscending) {
        return a[sortedColumn] - b[sortedColumn];
      } else {
        return b[sortedColumn] - a[sortedColumn];
      }
    });
    return { prefName, data: sorted };
  });

  return (
    <Tabs>
      <TabList>
        {sortedData.map(({ prefName }) => (
          <Tab key={prefName}>{prefName}</Tab>
        ))}
      </TabList>
			{sortedData.map(({ prefName, data }) => (
			<TabPanel key={prefName}>
				<table style={Styles.table}>
					<thead style={Styles.thead}>
						<tr style={Styles.th}>
							<th onClick={() => toggleSort("year")}>西暦</th>
							<th onClick={() => toggleSort("totalPopulation")}>総人口(人)</th>
							<th onClick={() => toggleSort("totalIncrease")}>総人口 増加率(%)</th>
							<th onClick={() => toggleSort("youngPopulation")}>年少人口(人)</th>
							<th onClick={() => toggleSort("youngRatio")}>年少人口 割合(%)</th>
							<th onClick={() => toggleSort("productivePopulation")}>生産年齢人口(人)</th>
							<th onClick={() => toggleSort("productiveRatio")}>生産年齢人口 割合(%)</th>
							<th onClick={() => toggleSort("elderlyPopulation")}>老年人口</th>
							<th onClick={() => toggleSort("elderlyRatio")}>老年人口 割合(%)</th>
						</tr>
					</thead>
					<tbody>
							<React.Fragment key={prefName}>
								{data.map((rowData) => (
									<tr key={`${prefName}-${rowData.year}`} style={Styles.td}>
										<td>{rowData.year}</td>
										<td>{rowData.totalPopulation}</td>
										<td>{rowData.totalIncrease}</td>
										<td>{rowData.youngPopulation}</td>
										<td>{rowData.youngRatio}</td>
										<td>{rowData.productivePopulation}</td>
										<td>{rowData.productiveRatio}</td>
										<td>{rowData.elderlyPopulation}</td>
										<td>{rowData.elderlyRatio}</td>
									</tr>
								))}
							</React.Fragment>
					</tbody>
				</table>
			</TabPanel>
			))}
    </Tabs>
  );
};

export default Table;