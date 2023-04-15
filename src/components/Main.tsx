import React, { useEffect, useState } from "react";
import CheckField from "./CheckField";
import Graph from "./Graph";
import Table from "./Table";

import axios from "axios";

const Styles: { [key: string]: React.CSSProperties } = {
  graph: {
    padding: "10px",
  },
  label: {
    fontSize: "20px",
    padding: "0.5rem 2rem",
    borderLeft: "4px solid #000",
    marginLeft: "10pt",
  },
};

const Main: React.FC = () => {
  // 都道府県チェックボックス用state
  const [prefectures, setPreFectures] = useState<{
    message: null; // API仕様上もnullしか来ないが、データ構造を合わせておく
    result: {
      prefCode: number;
      prefName: string;
    }[];
  } | null>(null);

  // 都道府県別人口推移グラフ用state
  const [prefPopulation, setPrefPopulation] = useState<
    { 
      prefName: string;
      data: {
        year: number;
        value: number;
      }[];
    }[]
  >([]);

  // 人口構成テーブル用state
  const [demographics, setDemographics] = useState<
    { 
      prefName: string;
      data: {
        label: string;
        data: {
          year: number;
          value: number;
          rate?: number;
        }[];
      }[];
    }[]
  >([]);

  useEffect(() => {
    // 都道府県一覧を取得する
    axios
      .get("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
        headers: { "X-API-KEY": process.env.REACT_APP_API_KEY },
      })
      .then((results) => {
        setPreFectures(results.data);
      })
      .catch((error) => {});
  }, []);

  // チェックボックスをクリック
  const handleClickCheck = (
    prefName: string,
    prefCode: number,
    check: boolean
  ) => {
    let c_prefPopulation = prefPopulation.slice();
    let c_demographics = demographics.slice();

    // チェックをつけた処理
    if (check) {
      // チェックをつけた県名が見つからなかった場合
      if (c_prefPopulation.findIndex((value) => value.prefName === prefName) !== -1){
        return;
      }
      
      // APIから人口構成データを取得
      axios
        .get(
          "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=" + String(prefCode),
          {
            headers: { "X-API-KEY": process.env.REACT_APP_API_KEY },
          }
        )
        // データが取得できたら、stateに渡す
        .then((results) => {
          //都道府県別人口推移グラフ用state
          c_prefPopulation.push({
            prefName: prefName,
            data: results.data.result.data[0].data, // 人口データのみをピックアップ
          });
          setPrefPopulation(c_prefPopulation);

          

          c_demographics.push({
            prefName: prefName,
            data: results.data.result.data //　人口構成のデータすべて
          });
          setDemographics(c_demographics);
        })
        // エラー処理
        .catch((error) => {
          return;
        });
    }
    // チェックを外した処理
    else {
      //都道府県別人口推移グラフ用state
      const deleteIndexPref = c_prefPopulation.findIndex((value) => value.prefName === prefName);
      // deleteindexが見つからなかった際の処理
      if (deleteIndexPref === -1){
        return;
      }
      // deleteindexに基づいて対象を配列から削除
      c_prefPopulation.splice(deleteIndexPref, 1);
      setPrefPopulation(c_prefPopulation);

      //人口構成テーブル用state
      const deleteIndexDemographics = c_demographics.findIndex((value) => value.prefName === prefName);
      // deleteindexが見つからなかった際の処理
      if (deleteIndexDemographics === -1){
        return;
      }
      // deleteindexに基づいて対象を配列から削除
      c_demographics.splice(deleteIndexDemographics, 1);
      setDemographics(c_demographics);
    }
  };

  return (
    <main>
      <h2 style={Styles.label}>都道府県</h2>
      {prefectures && (
        <CheckField
          prefectures={prefectures.result}
          onChange={handleClickCheck}
        />
      )}
      <h2 style={Styles.label}>人口推移グラフ</h2>
      <Graph populationdata={prefPopulation} />
      <Table demographics={demographics}/>
    </main>
  );
};

export default Main;