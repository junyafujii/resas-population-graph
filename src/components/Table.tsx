import React, { useState } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

interface Props {
  demographics: {
    prefName: string;
    data: {
      label: string;
      data: {
        year: number;
        value: number;
        rate?: number;
      }[];
    }[];
  }[];
}

const Styles: { [key: string]: React.CSSProperties } = {
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    maxWidth: '1500px',
    margin: 'auto',
    marginBottom: '30px'
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
    borderBottom: '1px solid #ccc',
  },
  td: {
    padding: '10px',
    fontSize: '1.1rem',
    textAlign: 'center',
    borderBottom: '1px solid #ccc'
  },
  sortIcon: {
    marginLeft: '10px',
    fontSize: '1rem'
  },
	thWithPointer: {
    padding: '10px',
    fontSize: '1.2rem',
    textAlign: 'center',
    borderBottom: '1px solid #ccc',
		cursor: 'pointer'
  },
	tabWidth: {
    maxWidth: '1500px',
    margin: 'auto',
  },
};

const Table: React.FC<Props> = ({ demographics }) => {
  // ソート用state
  const [sortedColumn, setSortedColumn] = useState('year');
  const [isAscending, setIsAscending] = useState(false);

  // ソート用関数
  const toggleSort = (column: string) => {
    if (sortedColumn === column) {
      setIsAscending(!isAscending);
    } else {
      setSortedColumn(column);
      setIsAscending(true);
    }
  };

  // ヘッダー情報をテーブル用に加工
  const headers = demographics.map(({ data }) => {
    const header: JSX.Element[] = [];
    data.forEach((item, i) => {
      header.push(<th key={i} colSpan={2}>{item.label}</th>);
    });
    return header;
  })

  // データをテーブル用に加工
  const sortedData = demographics.map(({ prefName, data }) => {
    let tableData: {
      year: number,
      totalPopulation: number,
      totalIncrease: number,
      youngPopulation: number,
      youngRatio: number | undefined,
      productivePopulation: number,
      productiveRatio: number| undefined,
      elderlyPopulation: number,
      elderlyRatio: number| undefined,
    }[] = [];

    //APIから取得した年数総数(処理数)
    let arrayNumber = data[0].data.length;

    // 総人口
    let totalData = data[0].data;

     // 年少人口
    let youngData = data[1].data;

    // 生産年齢人口
    let productiveData = data[2].data;

     // 老年人口
    let elderlyData = data[3].data;

    for (let i = 0; i < arrayNumber; i++) {
      // 前年データがある年は増加率を計算
      if(i !== 0){
        tableData.push({
          year: totalData[i].year,
          totalPopulation: totalData[i].value,
          totalIncrease: Math.round((100 * (totalData[i].value - totalData[i-1].value) / totalData[i-1].value) * 100) / 100, // 小数点第3位で四捨五入
          youngPopulation: youngData[i].value,
          youngRatio: youngData[i].rate,
          productivePopulation: productiveData[i].value,
          productiveRatio: productiveData[i].rate,
          elderlyPopulation: elderlyData[i].value,
          elderlyRatio: elderlyData[i].rate,
        });
      //最初のデータは前年データがないので０を入れる
      }else{
        tableData.push({
          year: totalData[i].year,
          totalPopulation: totalData[i].value,
          totalIncrease: 0,
          youngPopulation: youngData[i].value,
          youngRatio: youngData[i].rate,
          productivePopulation: productiveData[i].value,
          productiveRatio: productiveData[i].rate,
          elderlyPopulation: elderlyData[i].value,
          elderlyRatio: elderlyData[i].rate,
        });
      }
    }

    // ソート
    const sorted = [...tableData].sort((a: { [key: string]: number | undefined}, b: { [key: string]: number| undefined }) => {
      if (isAscending) {
        return (a[sortedColumn] ?? 0) - (b[sortedColumn] ?? 0);
      } else {
        return (b[sortedColumn] ?? 0) - (a[sortedColumn] ?? 0);
      }
    });
    return { prefName, tableData: sorted };
  });

   // ソート判別アイコン
	const getSortIcon = (column: string) => {
    if (sortedColumn === column) {
      return isAscending ? <span style={Styles.sortIcon}>▲</span> : <span style={Styles.sortIcon}>▼</span>;
    } else {
      return null;
    }
  };

  return (
    //onSelectはエラー回避のため
    <Tabs selectedIndex={sortedData && sortedData.length - 1} onSelect={() => {}} style={Styles.tabWidth}>
      <TabList>
        {sortedData.map(({ prefName }) => (
          <Tab key={prefName}>{prefName}</Tab>
        ))}
      </TabList>
			{sortedData.map(({ prefName, tableData }) => (
			<TabPanel key={prefName}>
				<table style={Styles.table}>
					<thead style={Styles.thead}>
						<tr style={Styles.th}>
							<th style={Styles.thWithPointer} rowSpan={2} onClick={() => toggleSort("year")}>西暦{getSortIcon("year")}</th>
              {headers}
						</tr>
						<tr style={Styles.thWithPointer}>
							<th onClick={() => toggleSort("totalPopulation")}>人数(人){getSortIcon("totalPopulation")}</th>
							<th onClick={() => toggleSort("totalIncrease")}>増加率(%){getSortIcon("totalIncrease")}</th>
							<th onClick={() => toggleSort("youngPopulation")}>人数(人){getSortIcon("youngPopulation")}</th>
							<th onClick={() => toggleSort("youngRatio")}>割合(%){getSortIcon("youngRatio")}</th>
							<th onClick={() => toggleSort("productivePopulation")}>人数(人){getSortIcon("productivePopulation")}</th>
							<th onClick={() => toggleSort("productiveRatio")}>割合(%){getSortIcon("productiveRatio")}</th>
							<th onClick={() => toggleSort("elderlyPopulation")}>人数(人){getSortIcon("elderlyPopulation")}</th>
							<th onClick={() => toggleSort("elderlyRatio")}>割合(%){getSortIcon("elderlyRatio")}</th>
						</tr>
					</thead>
					<tbody>
							<React.Fragment key={prefName}>
								{tableData.map((rowData) => (
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
