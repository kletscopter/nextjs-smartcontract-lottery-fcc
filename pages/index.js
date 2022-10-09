import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import LotteryEntrace from "../components/LotteryEntrance";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="our Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <LotteryEntrace />
    </div>
  );
}
